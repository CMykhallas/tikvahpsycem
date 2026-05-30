import { serve } from "https://deno.land";
import Stripe from "https://esm.sh";
import { createClient } from "npm:@supabase/supabase-js@2";
import React from "npm:react@18.3.1";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { PaymentConfirmationEmail } from "./_templates/payment-confirmation.tsx";
import { AdminNotificationEmail } from "./_templates/admin-notification.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] \${step}\${detailsStr}`);
};

// Declaração do EdgeRuntime global para compatibilidade com compiladores e linters
declare const EdgeRuntime: {
  waitUntil: (promise: Promise<any>) => void;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("Missing stripe signature");
      return new Response(JSON.stringify({ error: "No signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    // MANDATORY signature verification for security
    if (!webhookSecret) {
      logStep("CRITICAL: STRIPE_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
 
    let event: Stripe.Event;
 
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified", { type: event.type });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logStep("Webhook signature verification failed", { error: errorMessage });
      return new Response(
        JSON.stringify({ error: "Invalid signature" }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Processar evento de checkout completado
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout session completed", { 
        sessionId: session.id,
        customerEmail: session.customer_email,
        metadata: session.metadata 
      });

      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Atualizar status do agendamento
      const { data: appointments, error: fetchError } = await supabaseClient
        .from("appointments")
        .select("*")
        .eq("email", session.customer_email || session.customer_details?.email)
        .eq("service_type", session.metadata?.service_type)
        .eq("status", "pending_payment")
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        logStep("Error fetching appointment", { error: fetchError.message });
        throw fetchError;
      }

      if (!appointments || appointments.length === 0) {
        logStep("No pending appointment found", { 
          email: session.customer_email,
          serviceType: session.metadata?.service_type 
        });
        return new Response(JSON.stringify({ received: true, message: "No appointment to update" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const appointment = appointments[0];
      logStep("Appointment found", { appointmentId: appointment.id });

      // Atualizar status para confirmed
      const { error: updateError } = await supabaseClient
        .from("appointments")
        .update({ status: "confirmed" })
        .eq("id", appointment.id);

      if (updateError) {
        logStep("Error updating appointment", { error: updateError.message });
        throw updateError;
      }

      logStep("Appointment status updated to confirmed", { appointmentId: appointment.id });

      // Criar registro de pedido
      const { error: orderError } = await supabaseClient
        .from("orders")
        .insert({
          stripe_session_id: session.id,
          amount: session.amount_total,
          status: "paid",
          metadata: {
            appointment_id: appointment.id,
            service_type: session.metadata?.service_type,
            client_name: session.metadata?.client_name,
            preferred_date: session.metadata?.preferred_date,
          }
        });

      if (orderError) {
        logStep("Error creating order", { error: orderError.message });
      } else {
        logStep("Order created successfully");
      }

      // Enviar emails em background
      EdgeRuntime.waitUntil(
        (async () => {
          try {
            logStep("Starting email notifications");
            const currency = session.currency || "usd";
            const amount = session.amount_total || 0;

            // Email para o cliente
            const clientHtml = await renderAsync(
              React.createElement(PaymentConfirmationEmail, {
                clientName: session.metadata?.client_name || appointment.client_name,
                serviceType: session.metadata?.service_type || appointment.service_type,
                preferredDate: session.metadata?.preferred_date || appointment.preferred_date,
                amount: amount,
                currency: currency,
                sessionId: session.id,
              })
            );

            const { error: clientEmailError } = await resend.emails.send({
              from: "Tikvah Psicologia <onboarding@resend.dev>",
              to: [session.customer_email || session.customer_details?.email || appointment.email],
              subject: "Pagamento Confirmado - Tikvah Psicologia",
              html: clientHtml,
            });

            if (clientEmailError) {
              logStep("Error sending client email", { error: clientEmailError });
            } else {
              logStep("Client confirmation email sent successfully");
            }

            // Email para admin
            const adminHtml = await renderAsync(
              React.createElement(AdminNotificationEmail, {
                clientName: session.metadata?.client_name || appointment.client_name,
                clientEmail: session.customer_email || session.customer_details?.email || appointment.email,
                clientPhone: session.metadata?.phone || appointment.phone,
                serviceType: session.metadata?.service_type || appointment.service_type,
                preferredDate: session.metadata?.preferred_date || appointment.preferred_date,
                amount: amount,
                currency: currency,
                sessionId: session.id,
                message: appointment.message,
              })
            );

            const { error: adminEmailError } = await resend.emails.send({
              from: "Tikvah Sistema <onboarding@resend.dev>",
              to: ["suporte.oficina.psicologo@proton.me"],
              subject: `Novo Pagamento - \${session.metadata?.client_name || appointment.client_name}`,
              html: adminHtml,
            });

            if (adminEmailError) {
              logStep("Error sending admin email", { error: adminEmailError });
            } else {
              logStep("Admin notification email sent successfully");
            }

          } catch (emailError) {
            const emailErrorMsg = emailError instanceof Error ? emailError.message : String(emailError);
            logStep("Error in email sending process", { error: emailErrorMsg });
          }
        })()
      );
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    // CORREÇÃO ALERTA #10: Proteção contra exposição do Stack Trace na API pública
    console.error("[CRITICAL ERROR IN STRIPE-WEBHOOK SERVER-SIDE]:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Ocorreu um erro interno ao processar a notificação de pagamento." 
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

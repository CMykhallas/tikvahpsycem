import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildCorsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-CONTACT-EMAIL] ${step}${detailsStr}`);
};

// Input validation and sanitization
const MAX_PAYLOAD_SIZE = 10240; // 10KB

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function sanitizeString(str: string, maxLength: number): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '')
    .replace(/[\r\n]+/g, '\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

function validateContactData(data: unknown): { valid: boolean; error?: string; data?: ContactData } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request payload' };
  }

  const { name, email, subject, message } = data as Record<string, unknown>;

  if (!name || !email || !subject || !message) {
    return { valid: false, error: 'Missing required fields' };
  }

  if (typeof name !== 'string' || typeof email !== 'string' || 
      typeof subject !== 'string' || typeof message !== 'string') {
    return { valid: false, error: 'Invalid field types' };
  }

  if (!validateEmail(email)) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (name.length > 100 || subject.length > 200 || message.length > 2000) {
    return { valid: false, error: 'Input exceeds maximum length' };
  }

  return { 
    valid: true, 
    data: { 
      name, 
      email, 
      phone: typeof (data as Record<string, unknown>).phone === 'string' 
        ? (data as Record<string, unknown>).phone as string 
        : undefined,
      subject, 
      message 
    } 
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client with service_role
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    logStep('Function started');

    // Validate content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check payload size
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Payload too large' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 413 }
      );
    }

    const rawData = await req.json();

    // Validate input data
    const validation = validateContactData(rawData);
    if (!validation.valid || !validation.data) {
      logStep('Validation failed', { error: validation.error });
      return new Response(
        JSON.stringify({ error: validation.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Sanitize all inputs
    const name = sanitizeString(validation.data.name, 100);
    const email = validation.data.email.trim().toLowerCase();
    const phone = validation.data.phone ? sanitizeString(validation.data.phone, 20) : 'Não informado';
    const subject = sanitizeString(validation.data.subject, 200);
    const message = sanitizeString(validation.data.message, 2000);

    logStep('Sending contact email', { email, subject });

    // Escape HTML for email content
    const safeName = escapeHtml(name);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
    const safePhone = escapeHtml(phone);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: 'Tikvah Psycem <onboarding@resend.dev>',
      to: ['suporte.oficina.psicologo@proton.me'],
      subject: `Nova mensagem de contato: ${safeSubject}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head><meta charset="UTF-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a365d;">Nova mensagem de contato recebida</h2>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3182ce;">
            <p style="margin: 8px 0;"><strong>Nome:</strong> ${safeName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Telefone:</strong> ${safePhone}</p>
            <p style="margin: 8px 0;"><strong>Assunto:</strong> ${safeSubject}</p>
          </div>
          <h3 style="color: #2d3748;">Mensagem:</h3>
          <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            ${safeMessage}
          </div>
          <p style="color: #718096; font-size: 12px; margin-top: 20px;">
            Recebido em: ${new Date().toLocaleString('pt-BR', { timeZone: 'Africa/Maputo' })}
          </p>
        </body>
        </html>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: 'Tikvah Psycem <onboarding@resend.dev>',
      to: [email],
      subject: 'Mensagem recebida - Obrigado pelo contato!',
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head><meta charset="UTF-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a365d;">Olá, ${safeName}!</h2>
          <p style="color: #4a5568;">Recebemos sua mensagem e entraremos em contato em breve.</p>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">Resumo da sua mensagem:</h3>
            <p><strong>Assunto:</strong> ${safeSubject}</p>
            <div style="background: #fff; padding: 15px; border: 1px solid #e2e8f0; border-radius: 4px; margin-top: 10px;">
              ${safeMessage}
            </div>
          </div>
          
          <p style="color: #4a5568;">Agradecemos o seu interesse e responderemos em até 24 horas úteis.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <p style="color: #718096; font-size: 12px;">
            Tikvah Psychological Center<br>
            Avenida 24 de Julho, Nº 797, 1º Andar<br>
            Maputo, Moçambique
          </p>
        </body>
        </html>
      `,
    });

    logStep('Emails sent successfully', { 
      adminEmailId: adminEmailResponse.data?.id, 
      userEmailId: userEmailResponse.data?.id 
    });

    // Log to audit table
    await supabase.from('audit_logs').insert({
      action: 'CONTACT_EMAIL_SENT',
      table_name: 'contacts',
      new_data: { email, subject, timestamp: new Date().toISOString() }
    }).catch(() => {});

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('Error sending email', { error: errorMessage });
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send message',
        code: 'EMAIL_SEND_ERROR'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

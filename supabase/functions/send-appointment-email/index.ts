
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { buildCorsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Input validation schemas
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const sanitizeString = (input: string, maxLength: number = 1000): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, maxLength);
};

const validateAppointmentData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.client_name || typeof data.client_name !== 'string' || data.client_name.length < 2 || data.client_name.length > 100) {
    errors.push('Invalid client name');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Invalid email address');
  }
  
  if (!data.phone || typeof data.phone !== 'string' || data.phone.length > 20) {
    errors.push('Invalid phone number');
  }
  
  if (!data.service_type || typeof data.service_type !== 'string') {
    errors.push('Invalid service type');
  }
  
  if (!data.preferred_date || isNaN(Date.parse(data.preferred_date))) {
    errors.push('Invalid preferred date');
  }
  
  return { isValid: errors.length === 0, errors };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Check content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Invalid content type' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Check request size (prevent large payloads)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10240) { // 10KB limit
      return new Response(
        JSON.stringify({ error: 'Request too large' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 413,
        }
      );
    }

    const rawData = await req.json();
    
    // Validate input data
    const validation = validateAppointmentData(rawData);
    if (!validation.isValid) {
      console.warn('Invalid appointment data:', validation.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid input data' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Sanitize data
    const sanitizedData = {
      client_name: sanitizeString(rawData.client_name, 100),
      email: sanitizeString(rawData.email, 254),
      phone: sanitizeString(rawData.phone, 20),
      service_type: sanitizeString(rawData.service_type, 50),
      preferred_date: rawData.preferred_date,
      message: rawData.message ? sanitizeString(rawData.message, 2000) : ''
    };

    console.log('Enviando email de agendamento:', { 
      client_name: sanitizedData.client_name, 
      email: sanitizedData.email, 
      service_type: sanitizedData.service_type 
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: 'Sistema de Agendamentos <onboarding@resend.dev>',
      to: ['suporte.oficina.psicologo@proton.me'], // Admin email
      subject: `Novo agendamento solicitado - ${sanitizedData.service_type}`,
      html: `
        <h2>Novo agendamento solicitado</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Cliente:</strong> ${sanitizedData.client_name}</p>
          <p><strong>Email:</strong> ${sanitizedData.email}</p>
          <p><strong>Telefone:</strong> ${sanitizedData.phone}</p>
          <p><strong>Serviço:</strong> ${sanitizedData.service_type}</p>
          <p><strong>Data Preferida:</strong> ${new Date(sanitizedData.preferred_date).toLocaleString('pt-PT')}</p>
        </div>
        
        ${sanitizedData.message ? `
          <h3>Observações:</h3>
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            ${sanitizedData.message.replace(/\n/g, '<br>')}
          </div>
        ` : ''}
        
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Acesse o painel administrativo para confirmar ou reagendar este atendimento.
        </p>
      `,
    });

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: 'Atendimento <onboarding@resend.dev>',
      to: [sanitizedData.email],
      subject: 'Agendamento recebido - Confirmação pendente',
      html: `
        <h2>Olá, ${sanitizedData.client_name}!</h2>
        <p>Recebemos sua solicitação de agendamento e entraremos em contato em breve para confirmar.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Detalhes do seu agendamento:</h3>
          <p><strong>Serviço:</strong> ${sanitizedData.service_type}</p>
          <p><strong>Data Preferida:</strong> ${new Date(sanitizedData.preferred_date).toLocaleString('pt-PT')}</p>
          <p><strong>Telefone de contato:</strong> ${sanitizedData.phone}</p>
        </div>
        
        ${sanitizedData.message ? `
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h4>Suas observações:</h4>
            <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}
        
        <p>Nossa equipe analisará sua solicitação e entrará em contato em até 24 horas para confirmar o horário disponível mais próximo da sua preferência.</p>
        
        <p><strong>Próximos passos:</strong></p>
        <ul>
          <li>Aguarde nosso contato por email ou telefone</li>
          <li>Confirme o horário proposto</li>
          <li>Receba as informações de localização e preparação</li>
        </ul>
        
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Esta é uma mensagem automática. Se tiver dúvidas, responda a este email.
        </p>
      `,
    });

    console.log('Emails de agendamento enviados:', { 
      adminEmailId: adminEmailResponse.data?.id, 
      clientEmailId: clientEmailResponse.data?.id 
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email de confirmação enviado',
        adminEmailId: adminEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-appointment-email:', error.message);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

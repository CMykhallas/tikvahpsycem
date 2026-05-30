// =========================================
// SECURITY ALERT WEBHOOK
// Sends critical security alerts via Email, Slack, and Discord
// =========================================

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityIncident {
  id: string;
  created_at: string;
  incident_type: string;
  severity: string;
  ip_address: string;
  user_agent?: string;
  endpoint?: string;
  details?: any;
}

const escapeHtml = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  );

const formatIncidentDetailsHtml = (incident: SecurityIncident): string => {
  const severityColor = incident.severity === 'critical' ? '#dc2626' : '#f97316';
  const severityLabel = incident.severity === 'critical' ? '🔴 CRÍTICO' : '🟠 ALTO';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: ${severityColor}; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 24px; }
        .field { margin-bottom: 16px; }
        .field-label { font-weight: 600; color: #374151; margin-bottom: 4px; }
        .field-value { color: #1f2937; background: #f3f4f6; padding: 8px 12px; border-radius: 4px; font-family: monospace; }
        .details-box { background: #1f2937; color: #e5e7eb; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
        .footer { background: #f3f4f6; padding: 16px; text-align: center; color: #6b7280; font-size: 12px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: 600; background: ${severityColor}; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Alerta de Segurança</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Severidade</div>
            <div><span class="badge">${severityLabel}</span></div>
          </div>
          <div class="field">
            <div class="field-label">Tipo de Incidente</div>
            <div class="field-value">${escapeHtml(incident.incident_type)}</div>
          </div>
          <div class="field">
            <div class="field-label">Endereço IP</div>
            <div class="field-value">${escapeHtml(incident.ip_address)}</div>
          </div>
          ${incident.endpoint ? `
          <div class="field">
            <div class="field-label">Endpoint</div>
            <div class="field-value">${escapeHtml(incident.endpoint)}</div>
          </div>
          ` : ''}
          ${incident.user_agent ? `
          <div class="field">
            <div class="field-label">User Agent</div>
            <div class="field-value">${escapeHtml(incident.user_agent)}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="field-label">Data/Hora</div>
            <div class="field-value">${escapeHtml(new Date(incident.created_at).toLocaleString('pt-PT', { timeZone: 'Africa/Maputo' }))}</div>
          </div>
          ${incident.details ? `
          <div class="field">
            <div class="field-label">Detalhes Técnicos</div>
            <div class="details-box">${escapeHtml(JSON.stringify(incident.details, null, 2))}</div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>Este é um alerta automático do sistema de segurança Tikvah Psicologia.</p>
          <p>ID do Incidente: ${escapeHtml(incident.id)}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Caller authentication: only the DB trigger (using service_role key) may invoke this.
  const expectedAuth = `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''}`;
  if (req.headers.get('authorization') !== expectedAuth) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    console.log('🚨 [SECURITY ALERT] Processing webhook trigger');

    const { incident } = await req.json() as { incident: SecurityIncident };

    if (!incident) {
      return new Response(
        JSON.stringify({ error: 'No incident provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only send alerts for high/critical incidents
    if (!['high', 'critical'].includes(incident.severity)) {
      console.log('ℹ️ [ALERT] Incident severity too low, skipping notification');
      return new Response(
        JSON.stringify({ success: true, message: 'Severity too low for alert' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const alerts: Promise<any>[] = [];
    let emailSent = false;

    // =========================================
    // EMAIL ALERT (PRIMARY - Always tries to send)
    // =========================================
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const severityLabel = incident.severity === 'critical' ? 'CRÍTICO' : 'ALTO';
      
      const emailPromise = resend.emails.send({
        from: 'Tikvah Security <onboarding@resend.dev>',
        to: ['suporte.oficina.psicologo@proton.me'],
        subject: `🚨 [${severityLabel}] Alerta de Segurança - ${incident.incident_type}`,
        html: formatIncidentDetailsHtml(incident),
      }).then(result => {
        if (result.error) {
          console.error('❌ [EMAIL] Failed to send:', result.error);
        } else {
          console.log('✅ [EMAIL] Security alert sent successfully');
          emailSent = true;
        }
        return result;
      });

      alerts.push(emailPromise);
    } else {
      console.log('⚠️ [EMAIL] RESEND_API_KEY not configured');
    }

    // =========================================
    // SLACK WEBHOOK
    // =========================================
    const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (slackWebhookUrl) {
      const slackMessage = {
        text: '🚨 ALERTA DE SEGURANÇA CRÍTICO',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🚨 Alerta de Segurança - Tikvah Psycem',
              emoji: true
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Tipo:*\n${incident.incident_type}`
              },
              {
                type: 'mrkdwn',
                text: `*Severidade:*\n${incident.severity === 'critical' ? '🔴 CRÍTICO' : '🟠 ALTO'}`
              },
              {
                type: 'mrkdwn',
                text: `*IP:*\n\`${incident.ip_address}\``
              },
              {
                type: 'mrkdwn',
                text: `*Data:*\n${new Date(incident.created_at).toLocaleString('pt-PT')}`
              }
            ]
          }
        ]
      };

      if (incident.endpoint) {
        slackMessage.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Endpoint:* \`${incident.endpoint}\``
          }
        });
      }

      if (incident.details) {
        slackMessage.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Detalhes:*\n\`\`\`${JSON.stringify(incident.details, null, 2)}\`\`\``
          }
        });
      }

      alerts.push(
        fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackMessage)
        })
      );
    }

    // =========================================
    // DISCORD WEBHOOK
    // =========================================
    const discordWebhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL');
    if (discordWebhookUrl) {
      const severityEmoji = incident.severity === 'critical' ? '🔴' : '🟠';
      const severityColor = incident.severity === 'critical' ? 0xFF0000 : 0xFF8800;

      const discordMessage = {
        username: 'Security Alert Bot',
        avatar_url: 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
        embeds: [
          {
            title: `${severityEmoji} Alerta de Segurança - ${incident.severity.toUpperCase()}`,
            description: `**Tipo:** ${incident.incident_type}\n**IP:** \`${incident.ip_address}\``,
            color: severityColor,
            fields: [
              {
                name: 'Endpoint',
                value: incident.endpoint || 'N/A',
                inline: true
              },
              {
                name: 'Data/Hora',
                value: new Date(incident.created_at).toLocaleString('pt-PT'),
                inline: true
              }
            ],
            timestamp: incident.created_at,
            footer: {
              text: 'Tikvah Psycem Security System'
            }
          }
        ]
      };

      if (incident.details) {
        discordMessage.embeds[0].fields.push({
          name: 'Detalhes',
          value: `\`\`\`json\n${JSON.stringify(incident.details, null, 2).slice(0, 1000)}\n\`\`\``,
          inline: false
        });
      }

      alerts.push(
        fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordMessage)
        })
      );
    }

    if (alerts.length === 0) {
      console.log('⚠️ [ALERT] No notification channels configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No notification channels configured. Please set RESEND_API_KEY, SLACK_WEBHOOK_URL, or DISCORD_WEBHOOK_URL secrets.' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send all alerts in parallel
    const results = await Promise.allSettled(alerts);
    
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failedCount = results.filter(r => r.status === 'rejected').length;

    console.log(`✅ [ALERT] Sent ${successCount} alerts, ${failedCount} failed, emailSent: ${emailSent}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successCount,
        failed: failedCount,
        emailSent
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ [ALERT ERROR]', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

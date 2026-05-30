import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface AdminNotificationEmailProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  preferredDate: string;
  amount: number;
  currency: string;
  sessionId: string;
  message?: string;
}

export const AdminNotificationEmail = ({
  clientName,
  clientEmail,
  clientPhone,
  serviceType,
  preferredDate,
  amount,
  currency,
  sessionId,
  message,
}: AdminNotificationEmailProps) => {
  const serviceNames: Record<string, string> = {
    individual: 'Terapia Individual',
    casal: 'Terapia de Casal',
    familiar: 'Terapia Familiar',
    consultoria: 'Consultoria Organizacional',
  };

  const formattedAmount = new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: currency === 'mzn' ? 'MZN' : 'USD',
  }).format(amount / 100);

  return (
    <Html>
      <Head />
      <Preview>Novo pagamento confirmado - {clientName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>💰 Novo Pagamento Recebido</Heading>
          
          <Text style={text}>
            Um novo agendamento foi pago e confirmado no sistema.
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>Informações do Cliente:</Text>
            <Hr style={divider} />
            <Text style={infoText}>
              <strong>Nome:</strong> {clientName}
            </Text>
            <Text style={infoText}>
              <strong>Email:</strong>{' '}
              <Link href={`mailto:${clientEmail}`} style={link}>
                {clientEmail}
              </Link>
            </Text>
            <Text style={infoText}>
              <strong>Telefone:</strong>{' '}
              <Link href={`tel:${clientPhone}`} style={link}>
                {clientPhone}
              </Link>
            </Text>
          </Section>

          <Section style={infoBox}>
            <Text style={infoTitle}>Detalhes do Agendamento:</Text>
            <Hr style={divider} />
            <Text style={infoText}>
              <strong>Serviço:</strong> {serviceNames[serviceType] || serviceType}
            </Text>
            <Text style={infoText}>
              <strong>Data Preferencial:</strong> {new Date(preferredDate).toLocaleDateString('pt-PT', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {message && (
              <Text style={infoText}>
                <strong>Mensagem:</strong> {message}
              </Text>
            )}
          </Section>

          <Section style={paymentBox}>
            <Text style={infoTitle}>Informações de Pagamento:</Text>
            <Hr style={divider} />
            <Text style={infoText}>
              <strong>Valor Recebido:</strong> <span style={amountText}>{formattedAmount}</span>
            </Text>
            <Text style={infoText}>
              <strong>Status:</strong> <span style={statusPaid}>PAGO</span>
            </Text>
            <Text style={infoText}>
              <strong>ID da Transação Stripe:</strong> {sessionId}
            </Text>
            <Text style={infoText}>
              <strong>Data do Pagamento:</strong> {new Date().toLocaleString('pt-PT')}
            </Text>
          </Section>

          <Text style={actionText}>
            ⚡ <strong>Ação Necessária:</strong> Entre em contato com o cliente para confirmar os detalhes finais da sessão.
          </Text>

          <Hr style={divider} />

          <Text style={footer}>
            Esta é uma notificação automática do sistema de agendamentos Tikvah.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminNotificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 20px 20px',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 20px',
};

const infoBox = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  margin: '24px 20px',
  padding: '24px',
  border: '1px solid #e2e8f0',
};

const paymentBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  margin: '24px 20px',
  padding: '24px',
  border: '2px solid #86efac',
};

const infoTitle = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const infoText = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const amountText = {
  color: '#059669',
  fontWeight: 'bold',
  fontSize: '18px',
};

const statusPaid = {
  color: '#059669',
  fontWeight: 'bold',
  backgroundColor: '#d1fae5',
  padding: '4px 12px',
  borderRadius: '4px',
};

const actionText = {
  color: '#b45309',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '24px 20px',
  padding: '16px',
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  border: '1px solid #fbbf24',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '16px 0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '32px 20px 0',
};

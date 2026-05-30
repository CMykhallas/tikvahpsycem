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

interface PaymentConfirmationEmailProps {
  clientName: string;
  serviceType: string;
  preferredDate: string;
  amount: number;
  currency: string;
  sessionId: string;
}

export const PaymentConfirmationEmail = ({
  clientName,
  serviceType,
  preferredDate,
  amount,
  currency,
  sessionId,
}: PaymentConfirmationEmailProps) => {
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
      <Preview>Pagamento confirmado - {serviceNames[serviceType] || serviceType}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>✓ Pagamento Confirmado</Heading>
          
          <Text style={text}>
            Olá <strong>{clientName}</strong>,
          </Text>
          
          <Text style={text}>
            O pagamento para o agendamento foi confirmado com sucesso!
          </Text>

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
            <Text style={infoText}>
              <strong>Valor Pago:</strong> {formattedAmount}
            </Text>
            <Text style={infoText}>
              <strong>ID da Transação:</strong> {sessionId}
            </Text>
          </Section>

          <Text style={text}>
            Entraremos em contato em breve para confirmar os detalhes finais da sessão.
          </Text>

          <Text style={text}>
            Se tiver alguma dúvida, responda a este email ou entre em contato através do nosso WhatsApp.
          </Text>

          <Hr style={divider} />

          <Text style={footer}>
            <strong>Tikvah - Centro de Psicologia</strong>
            <br />
            Av. 24 de Julho, Maputo
            <br />
            <Link href="https://tikvah-psicologia.com" style={link}>
              www.tikvah-psicologia.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PaymentConfirmationEmail;

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

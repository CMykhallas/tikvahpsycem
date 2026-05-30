import { useMemo } from 'react';
import { useAuth } from './useAuth';
import {
  maskEmail,
  maskPhone,
  maskName,
  maskPaymentReference,
  maskAccessToken,
  maskIpAddress,
  maskMetadata,
  getMaskingConfig,
  type MaskingLevel
} from '@/utils/dataMasking';

/**
 * Hook para aplicar mascaramento de dados baseado no papel do usuário
 */
export const useMaskedData = () => {
  const { isAdmin, user } = useAuth();
  
  // CORREÇÃO: Adicionado 'none' para Admins, permitindo que os IFs abaixo sejam válidos
  const maskingLevel: MaskingLevel = useMemo(() => {
    if (isAdmin) return 'none'; // Admins veem tudo (ou mude para 'partial' se desejar mascaramento parcial)
    if (user) return 'partial'; // Staff/User logado
    return 'full';              // Deslogado/Público
  }, [isAdmin, user]);
  
  const config = useMemo(() => getMaskingConfig(
    isAdmin ? 'admin' : user ? 'staff' : null
  ), [isAdmin, user]);
  
  /**
   * Mascarar e-mail
   */
  const maskedEmail = (email: string | null | undefined): string => {
    if (maskingLevel === 'none') return email || '';
    return maskEmail(email);
  };
  
  /**
   * Mascarar telefone
   */
  const maskedPhone = (phone: string | null | undefined): string => {
    if (maskingLevel === 'none') return phone || '';
    return maskPhone(phone);
  };
  
  /**
   * Mascarar nome
   */
  const maskedName = (name: string | null | undefined): string => {
    // Nomes costumam ser visíveis para admin e usuários autenticados
    if (maskingLevel === 'none' || maskingLevel === 'partial') return name || '';
    return maskName(name);
  };
  
  /**
   * Mascarar referência de pagamento
   */
  const maskedPaymentRef = (ref: string | null | undefined): string => {
    if (maskingLevel === 'none') return ref || '';
    return maskPaymentReference(ref);
  };
  
  /**
   * Mascarar token de acesso (Sempre mascarado por segurança)
   */
  const maskedToken = (token: string | null | undefined): string => {
    return maskAccessToken(token);
  };
  
  /**
   * Mascarar endereço IP
   */
  const maskedIp = (ip: string | null | undefined): string => {
    // IPs só são visíveis se o nível for 'none'
    if (maskingLevel === 'none') return ip || '';
    return maskIpAddress(ip);
  };
  
  /**
   * Mascarar objeto de metadados
   */
  const maskedMeta = (metadata: Record<string, any> | null | undefined) => {
    if (maskingLevel === 'none') return metadata;
    return maskMetadata(metadata);
  };

  // --- Funções de Formatação de Objetos ---

  const maskOrderData = (order: any) => ({
    ...order,
    phone_number: maskedPhone(order.phone_number),
    mpesa_reference: maskedPaymentRef(order.mpesa_reference),
    bank_transfer_reference: maskedPaymentRef(order.bank_transfer_reference),
    order_access_token: maskedToken(order.order_access_token),
    metadata: maskedMeta(order.metadata)
  });

  const maskContactData = (contact: any) => ({
    ...contact,
    email: maskedEmail(contact.email),
    phone: maskedPhone(contact.phone)
  });

  const maskAppointmentData = (appointment: any) => ({
    ...appointment,
    email: maskedEmail(appointment.email),
    phone: maskedPhone(appointment.phone)
  });

  const maskLeadData = (lead: any) => ({
    ...lead,
    email: maskedEmail(lead.email),
    phone: maskedPhone(lead.phone)
  });

  const maskProfileData = (profile: any) => ({
    ...profile,
    email: maskedEmail(profile.email)
  });

  const maskSecurityIncidentData = (incident: any) => ({
    ...incident,
    ip_address: maskedIp(incident.ip_address),
    details: maskedMeta(incident.details)
  });

  return {
    maskingLevel,
    config,
    maskedEmail,
    maskedPhone,
    maskedName,
    maskedPaymentRef,
    maskedToken,
    maskedIp,
    maskedMeta,
    maskOrderData,
    maskContactData,
    maskAppointmentData,
    maskLeadData,
    maskProfileData,
    maskSecurityIncidentData
  };
};

export default useMaskedData;

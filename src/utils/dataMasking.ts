// =========================================
// DATA MASKING UTILITIES
// Protects sensitive data in UI displays
// =========================================

/**
 * Masks an email address showing only first 2 characters and domain
 * Example: "john.doe@example.com" -> "jo***@example.com"
 */
export const maskEmail = (email: string | null | undefined): string => {
  if (!email || typeof email !== 'string') return '***@***.***';
  
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***.***';
  
  const [localPart, domain] = parts;
  const maskedLocal = localPart.length > 2 
    ? localPart.slice(0, 2) + '***' 
    : '***';
  
  return `${maskedLocal}@${domain}`;
};

/**
 * Masks a phone number showing only last 4 digits
 * Example: "+258 82 759 2980" -> "***-****-2980"
 */
export const maskPhone = (phone: string | null | undefined): string => {
  if (!phone || typeof phone !== 'string') return '***-****-****';
  
  // Extract only digits
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length < 4) return '***-****-****';
  
  const lastFour = digits.slice(-4);
  return `***-****-${lastFour}`;
};

/**
 * Masks a name showing only first letter and last name initial
 * Example: "João Silva" -> "J*** S***"
 */
export const maskName = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string') return '***';
  
  const parts = name.trim().split(/\s+/);
  
  return parts
    .map(part => part.length > 0 ? `${part[0]}***` : '***')
    .join(' ');
};

/**
 * Masks a payment reference showing only last 4 characters
 * Example: "MP240102ABC123XYZ" -> "***XYZ"
 */
export const maskPaymentReference = (ref: string | null | undefined): string => {
  if (!ref || typeof ref !== 'string') return '***';
  
  if (ref.length <= 4) return '***';
  
  return `***${ref.slice(-4)}`;
};

/**
 * Masks an access token showing only first and last 4 characters
 * Example: "abc123def456ghi789" -> "abc1...i789"
 */
export const maskAccessToken = (token: string | null | undefined): string => {
  if (!token || typeof token !== 'string') return '***';
  
  if (token.length <= 8) return '***';
  
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
};

/**
 * Masks an IP address showing only first octet
 * Example: "192.168.1.100" -> "192.***.***.**"
 */
export const maskIpAddress = (ip: string | null | undefined): string => {
  if (!ip || typeof ip !== 'string') return '***.***.***.***';
  
  const parts = ip.split('.');
  if (parts.length !== 4) return ip.slice(0, 3) + '***';
  
  return `${parts[0]}.***.***.**`;
};

/**
 * Masks sensitive JSONB metadata fields
 * Recursively masks known sensitive field names
 */
export const maskMetadata = (metadata: Record<string, any> | null | undefined): Record<string, any> | null => {
  if (!metadata || typeof metadata !== 'object') return null;
  
  const sensitiveFields = [
    'email', 'customer_email', 'user_email',
    'phone', 'customer_phone', 'phone_number',
    'name', 'customer_name', 'full_name',
    'ip_address', 'ip',
    'access_token', 'token', 'order_access_token'
  ];
  
  const masked: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      if (typeof value === 'string') {
        if (lowerKey.includes('email')) {
          masked[key] = maskEmail(value);
        } else if (lowerKey.includes('phone')) {
          masked[key] = maskPhone(value);
        } else if (lowerKey.includes('name')) {
          masked[key] = maskName(value);
        } else if (lowerKey.includes('ip')) {
          masked[key] = maskIpAddress(value);
        } else if (lowerKey.includes('token')) {
          masked[key] = maskAccessToken(value);
        } else {
          masked[key] = '***';
        }
      } else {
        masked[key] = '***';
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      masked[key] = maskMetadata(value);
    } else {
      masked[key] = value;
    }
  }
  
  return masked;
};

/**
 * Configuration for masking behavior based on user role
 */
export type MaskingLevel = 'full' | 'partial' | 'none';

export interface MaskingConfig {
  level: MaskingLevel;
  showLastDigits?: number;
}

/**
 * Get masking configuration based on user role
 */
export const getMaskingConfig = (role: 'admin' | 'staff' | 'user' | null): MaskingConfig => {
  switch (role) {
    case 'admin':
      return { level: 'partial', showLastDigits: 4 };
    case 'staff':
      return { level: 'partial', showLastDigits: 2 };
    default:
      return { level: 'full' };
  }
};

/**
 * Apply masking based on configuration
 */
export const applyMasking = (
  value: string | null | undefined,
  type: 'email' | 'phone' | 'name' | 'payment' | 'token' | 'ip',
  config: MaskingConfig
): string => {
  if (config.level === 'none') return value || '';
  
  switch (type) {
    case 'email':
      return maskEmail(value);
    case 'phone':
      return maskPhone(value);
    case 'name':
      return config.level === 'full' ? maskName(value) : (value || '');
    case 'payment':
      return maskPaymentReference(value);
    case 'token':
      return maskAccessToken(value);
    case 'ip':
      return maskIpAddress(value);
    default:
      return value || '';
  }
};

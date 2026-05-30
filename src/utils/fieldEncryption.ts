// =========================================
// FIELD-LEVEL ENCRYPTION UTILITIES
// Client-side helpers for encrypted data
// =========================================

/**
 * Encryption is performed server-side in Edge Functions.
 * This file provides utilities for working with encrypted data on the client.
 */

export interface EncryptedField {
  encrypted: boolean;
  data: string;
  iv: string;
  version: number;
}

/**
 * Check if a field contains encrypted data
 */
export const isEncryptedField = (value: unknown): value is EncryptedField => {
  if (!value || typeof value !== 'object') return false;
  
  const obj = value as Record<string, unknown>;
  return (
    obj.encrypted === true &&
    typeof obj.data === 'string' &&
    typeof obj.iv === 'string' &&
    typeof obj.version === 'number'
  );
};

/**
 * Display placeholder for encrypted fields
 * Used when encrypted data shouldn't be decrypted on client
 */
export const getEncryptedPlaceholder = (fieldType: 'phone' | 'payment_ref' | 'generic'): string => {
  switch (fieldType) {
    case 'phone':
      return '🔒 [Encrypted Phone]';
    case 'payment_ref':
      return '🔒 [Encrypted Reference]';
    default:
      return '🔒 [Encrypted]';
  }
};

/**
 * List of fields that should be encrypted
 */
export const ENCRYPTED_FIELDS = [
  'phone_number',
  'mpesa_reference',
  'bank_transfer_reference',
  'order_access_token'
] as const;

export type EncryptableField = typeof ENCRYPTED_FIELDS[number];

/**
 * Check if a field name should be encrypted
 */
export const shouldEncryptField = (fieldName: string): boolean => {
  return ENCRYPTED_FIELDS.includes(fieldName as EncryptableField);
};

/**
 * Get display value for potentially encrypted field
 */
export const getDisplayValue = (
  value: unknown,
  fieldType: 'phone' | 'payment_ref' | 'generic' = 'generic'
): string => {
  if (isEncryptedField(value)) {
    return getEncryptedPlaceholder(fieldType);
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  return '';
};

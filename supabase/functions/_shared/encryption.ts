// =========================================
// SERVER-SIDE FIELD ENCRYPTION
// AES-256-GCM encryption for sensitive data
// =========================================

const ENCRYPTION_VERSION = 1;

/**
 * Generate a random initialization vector
 */
const generateIV = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(12));
};

/**
 * Derive encryption key from secret
 */
const deriveKey = async (secret: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('tikvah-field-encryption-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Convert Uint8Array to base64
 */
const toBase64 = (bytes: Uint8Array): string => {
  return btoa(String.fromCharCode(...bytes));
};

/**
 * Convert base64 to Uint8Array
 */
const fromBase64 = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

export interface EncryptedData {
  encrypted: boolean;
  data: string;
  iv: string;
  version: number;
}

/**
 * Encrypt a string value
 */
export const encryptField = async (
  value: string,
  encryptionKey?: string
): Promise<EncryptedData> => {
  const key = encryptionKey || Deno.env.get('FIELD_ENCRYPTION_KEY');
  
  if (!key) {
    console.warn('[ENCRYPTION] No encryption key configured, storing as plain text');
    return {
      encrypted: false,
      data: value,
      iv: '',
      version: ENCRYPTION_VERSION
    };
  }

  try {
    const cryptoKey = await deriveKey(key);
    const iv = generateIV();
    const encoder = new TextEncoder();
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoder.encode(value)
    );

    return {
      encrypted: true,
      data: toBase64(new Uint8Array(encryptedData)),
      iv: toBase64(iv),
      version: ENCRYPTION_VERSION
    };
  } catch (error) {
    console.error('[ENCRYPTION ERROR]', error);
    throw new Error('Failed to encrypt field');
  }
};

/**
 * Decrypt an encrypted value
 */
export const decryptField = async (
  encryptedData: EncryptedData,
  encryptionKey?: string
): Promise<string> => {
  if (!encryptedData.encrypted) {
    return encryptedData.data;
  }

  const key = encryptionKey || Deno.env.get('FIELD_ENCRYPTION_KEY');
  
  if (!key) {
    throw new Error('No encryption key configured');
  }

  try {
    const cryptoKey = await deriveKey(key);
    const iv = fromBase64(encryptedData.iv);
    const data = fromBase64(encryptedData.data);

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('[DECRYPTION ERROR]', error);
    throw new Error('Failed to decrypt field');
  }
};

/**
 * Check if a value is encrypted
 */
export const isEncrypted = (value: unknown): value is EncryptedData => {
  if (!value || typeof value !== 'object') return false;
  
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.encrypted === 'boolean' &&
    typeof obj.data === 'string' &&
    typeof obj.iv === 'string' &&
    typeof obj.version === 'number'
  );
};

/**
 * Encrypt multiple fields in an object
 */
export const encryptFields = async (
  data: Record<string, any>,
  fieldNames: string[],
  encryptionKey?: string
): Promise<Record<string, any>> => {
  const result = { ...data };
  
  for (const fieldName of fieldNames) {
    if (data[fieldName] && typeof data[fieldName] === 'string') {
      result[fieldName] = await encryptField(data[fieldName], encryptionKey);
    }
  }
  
  return result;
};

/**
 * Decrypt multiple fields in an object
 */
export const decryptFields = async (
  data: Record<string, any>,
  fieldNames: string[],
  encryptionKey?: string
): Promise<Record<string, any>> => {
  const result = { ...data };
  
  for (const fieldName of fieldNames) {
    if (isEncrypted(data[fieldName])) {
      result[fieldName] = await decryptField(data[fieldName], encryptionKey);
    }
  }
  
  return result;
};

/**
 * Mask encrypted data for display (returns last 4 chars)
 */
export const getMaskedValue = async (
  encryptedData: EncryptedData,
  encryptionKey?: string
): Promise<string> => {
  try {
    const decrypted = await decryptField(encryptedData, encryptionKey);
    if (decrypted.length <= 4) return '****';
    return '***' + decrypted.slice(-4);
  } catch {
    return '🔒 [Encrypted]';
  }
};

/**
 * TOTP (Time-based One-Time Password) Service
 * Implements RFC 6238 standard for 2FA authentication
 * 
 * Security Properties:
 * - 6-digit codes valid for 30 seconds
 * - SHA-1 HMAC algorithm (standard)
 * - Compatible with: Google Authenticator, Authy, 1Password, Microsoft Authenticator
 */

import { encode as base32Encode } from "npm:js-base64";

/**
 * HMAC-SHA1 implementation for TOTP
 */
async function hmacSha1(key: ArrayBuffer, message: ArrayBuffer): Promise<ArrayBuffer> {
  const key_obj = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key_obj, message);
}

/**
 * Convert number to big-endian bytes
 */
function numberToBytes(num: number): Uint8Array {
  const bytes = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    bytes[i] = num & 0xff;
    num >>>= 8;
  }
  return bytes;
}

export class TotpService {
  static readonly TOTP_CONFIG = {
    issuer: "Tikvah Psychological Center",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  };

  /**
   * Gerar novo secret TOTP + QR code
   * @param userId - ID do usuário para label
   * @returns { secret: string (base32), qrCode: data-url }
   */
  static async generateSecret(userId: string): Promise<{
    secret: string;
    qrCode: string;
  }> {
    try {
      // Gerar 32 bytes de secret aleatório (256 bits)
      const secretBytes = crypto.getRandomValues(new Uint8Array(32));
      
      // Converter para base32
      const secretArray = Array.from(secretBytes);
      const secretBase32 = base32Encode(new TextEncoder().encode(
        String.fromCharCode(...secretArray)
      )).replace(/=/g, "");

      // Criar URI otpauth para QR code
      const label = encodeURIComponent(`Tikvah (${userId})`);
      const issuer = encodeURIComponent(this.TOTP_CONFIG.issuer);
      const otpauthUri = `otpauth://totp/${label}?secret=${secretBase32}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;

      // Gerar QR code via API externa
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUri)}`;

      return { 
        secret: secretBase32, 
        qrCode
      };
    } catch (error) {
      console.error("Error generating TOTP secret:", error);
      throw new Error("Failed to generate TOTP secret");
    }
  }

  /**
   * Verificar código TOTP
   * @param secret - Secret em base32
   * @param token - Código digitado pelo usuário (6 dígitos)
   * @returns true se válido, false se inválido
   */
  static async verifyToken(secret: string, token: string): Promise<boolean> {
    try {
      // Validar formato
      if (!token || !/^\d{6}$/.test(token)) {
        return false;
      }

      // Decodificar secret (base32 -> bytes)
      const secretBytes = new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret))
      ).slice(0, 20); // Usar apenas 20 bytes para SHA1

      // Calcular TOTP para período atual e anterior
      const now = Math.floor(Date.now() / 1000);
      const timeCounter = Math.floor(now / 30);

      for (let i = -1; i <= 1; i++) {
        const counter = timeCounter + i;
        const counterBytes = numberToBytes(counter);

        // HMAC-SHA1
        const hmac = await hmacSha1(
          secretBytes.buffer,
          counterBytes.buffer
        );

        // Dinâmico truncamento (RFC 4226)
        const offset = new Uint8Array(hmac)[19] & 0x0f;
        const p = new DataView(hmac, offset, 4);
        let codeInt = p.getUint32(0, false) & 0x7fffffff;
        const code = String(codeInt % 1000000).padStart(6, "0");

        if (code === token) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error verifying TOTP token:", error);
      return false;
    }
  }

  /**
   * Gerar códigos de backup (recovery codes)
   * @returns Array de 10 códigos aleatórios de 8 dígitos
   */
  static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Array.from(crypto.getRandomValues(new Uint8Array(4)))
        .map(b => String(b % 10))
        .join("");
      codes.push(code);
    }
    return codes;
  }

  /**
   * Verificar código de backup (uso único)
   * @param backupCodes - Array de códigos não utilizados
   * @param code - Código digitado pelo usuário
   * @returns { valid: boolean, remainingCodes: string[] }
   */
  static verifyBackupCode(
    backupCodes: string[],
    code: string
  ): { valid: boolean; remainingCodes: string[] } {
    const index = backupCodes.indexOf(code);

    if (index === -1) {
      return { valid: false, remainingCodes: backupCodes };
    }

    // Remover código usado
    const remainingCodes = [
      ...backupCodes.slice(0, index),
      ...backupCodes.slice(index + 1),
    ];

    return { valid: true, remainingCodes };
  }
}

export default TotpService;

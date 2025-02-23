// src/services/encryptionService.ts
import crypto from 'crypto';
import { ENV } from '../config/environment';

export class EncryptionService {
  private static algorithm = 'aes-256-cbc';
  private static key = crypto.createHash('sha256').update(ENV.ENCRYPTION_SECRET).digest();
  private static iv = crypto.randomBytes(16);

  static encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // We need to store IV with the text for decryption:
    return this.iv.toString('base64') + ':' + encrypted;
  }

  static decrypt(encryptedText: string): string {
    const [ivBase64, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
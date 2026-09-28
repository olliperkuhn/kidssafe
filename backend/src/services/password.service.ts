import crypto from 'crypto';
import { env } from '../config/env';

export class PasswordService {
  private readonly keyLength = 64;

  /**
   * Hasht ein Passwort mit einem einzigartigen Salt und dem serverweiten Pepper.
   */
  public async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const salt = crypto.randomBytes(16).toString('hex');
    const pepperedPassword = password + env.PASSWORD_PEPPER;

    return new Promise((resolve, reject) => {
      crypto.scrypt(pepperedPassword, salt, this.keyLength, (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          hash: derivedKey.toString('hex'),
          salt,
        });
      });
    });
  }

  /**
   * Verifiziert ein Passwort zeitkonstant gegen Hash und Salt.
   */
  public async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const pepperedPassword = password + env.PASSWORD_PEPPER;

    return new Promise((resolve, reject) => {
      crypto.scrypt(pepperedPassword, salt, this.keyLength, (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }

        const storedHashBuffer = Buffer.from(hash, 'hex');
        if (storedHashBuffer.length !== derivedKey.length) {
          resolve(false);
          return;
        }

        const match = crypto.timingSafeEqual(storedHashBuffer, derivedKey);
        resolve(match);
      });
    });
  }
}

export const passwordService = new PasswordService();

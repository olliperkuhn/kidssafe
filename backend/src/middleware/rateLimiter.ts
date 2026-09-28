import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const isTestEnv = env.NODE_ENV === 'test';

/**
 * Globaler API-Ratenbegrenzer zum Schutz vor generellen DoS-Angriffen.
 */
export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 Minuten
  limit: 500, // Max. 500 Anfragen pro IP im Zeitfenster
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => isTestEnv,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Zu viele Anfragen. Bitte warte einen Moment, bevor du es erneut versuchst.',
    },
  },
});

/**
 * Strenger Ratenbegrenzer für Passwort- und Registrierungs-Endpunkte (Schutz vor Wörterbuch-Attacken).
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  limit: 20, // Max. 20 Anmelde-/Registrierversuche pro IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => isTestEnv,
  message: {
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Zu viele Anmeldeversuche. Bitte warte 15 Minuten, bevor du es erneut versuchst.',
    },
  },
});

/**
 * Schutz vor automatisierter Brute-Force-Suche nach gültigen Schüler-Zugangscodes.
 */
export const codeVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Minuten
  limit: 40, // Max. 40 Code-Prüfungen pro IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => isTestEnv,
  message: {
    error: {
      code: 'CODE_VERIFY_LIMIT_EXCEEDED',
      message: 'Zu viele fehlerhafte Code-Eingaben. Bitte wende dich an deine Lehrkraft.',
    },
  },
});

/**
 * Schutz vor Überflutung der Datenbank durch unbegrenzte Erstellung von Gast-Zugängen.
 */
export const guestCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Stunde
  limit: 15, // Max. 15 Gast-Codes pro IP pro Stunde
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => isTestEnv,
  message: {
    error: {
      code: 'GUEST_LIMIT_EXCEEDED',
      message: 'Zu viele Gast-Zugänge von dieser Verbindung erstellt. Bitte nutze einen vorhandenen Zugangscode.',
    },
  },
});

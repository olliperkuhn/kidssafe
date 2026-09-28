import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().default('postgresql://kidssafe:kidssafe_secret@localhost:5432/kidssafe_db?schema=public'),
  JWT_SECRET: z.string().default('dev_fallback_secret_change_in_prod'),
  PASSWORD_PEPPER: z.string().default('dev_fallback_pepper_change_in_prod'),
  COOKIE_SECRET: z.string().default('dev_cookie_secret_change_in_prod'),
  GEMINI_API_KEY: z.string().optional(),
  OLLAMA_API_URL: z.string().default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().default('gemma2:2b'),
  AI_DEFAULT_PROVIDER: z.enum(['mock', 'ollama', 'gemini']).default('mock'),
});

export type EnvConfig = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Ungültige Umgebungsvariablen:', parsedEnv.error.format());
  process.exit(1);
}

export const env: EnvConfig = parsedEnv.data;

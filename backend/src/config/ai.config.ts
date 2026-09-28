import { env } from './env';

export type AIProviderType = 'mock' | 'ollama' | 'gemini';

export interface GeminiConfig {
  apiKey?: string;
  model: string;
}

export interface OllamaConfig {
  baseUrl: string;
  model: string;
}

export interface GuardrailConfig {
  maxTokens: number;
  childSafeLanguage: boolean;
}

export interface AIConfig {
  activeProvider: AIProviderType;
  fallbackOrder: AIProviderType[];
  temperature: number;
  timeoutMs: number;
  gemini: GeminiConfig;
  ollama: OllamaConfig;
  guardrails: GuardrailConfig;
}

/**
 * Standardkonfiguration für die Kidssafe KI-Pipeline.
 * Kann über .env gesteuert, im Code-Editor angepasst oder
 * zur Laufzeit über das Teacher/Admin-Backend überschrieben werden.
 */
export const defaultAIConfig: AIConfig = {
  activeProvider: (env.AI_DEFAULT_PROVIDER as AIProviderType) || 'mock',
  fallbackOrder: ['gemini', 'ollama', 'mock'],
  temperature: 0.7,
  timeoutMs: 8000,
  gemini: {
    apiKey: env.GEMINI_API_KEY || process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
  },
  ollama: {
    baseUrl: env.OLLAMA_API_URL,
    model: env.OLLAMA_MODEL,
  },
  guardrails: {
    maxTokens: 2048,
    childSafeLanguage: true,
  },
};

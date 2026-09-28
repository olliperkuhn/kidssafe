export type AIProviderId = 'gemini' | 'ollama' | 'mock';

export interface ProviderHealthDTO {
  id: AIProviderId;
  name: string;
  isConfigured: boolean;
  isAvailable: boolean;
  latencyMs?: number;
  error?: string;
}

export interface GeminiModelInfo {
  model: string;
  apiKeyConfigured: boolean;
  apiKeyMasked?: string;
}

export interface OllamaModelInfo {
  baseUrl: string;
  model: string;
}

export interface AiStatusResponseDTO {
  activeProvider: AIProviderId;
  fallbackOrder: AIProviderId[];
  temperature: number;
  providers: ProviderHealthDTO[];
  models: {
    gemini: GeminiModelInfo;
    ollama: OllamaModelInfo;
  };
}

export interface UpdateAiConfigDTO {
  activeProvider?: AIProviderId;
  temperature?: number;
  gemini?: {
    apiKey?: string;
    model?: string;
  };
  ollama?: {
    baseUrl?: string;
    model?: string;
  };
}

export interface TestAiPromptDTO {
  provider?: AIProviderId;
  systemPrompt: string;
  userPrompt: string;
  responseJson?: boolean;
}

export interface TestAiPromptResponseDTO {
  response: string;
  providerUsed: string;
  latencyMs: number;
}

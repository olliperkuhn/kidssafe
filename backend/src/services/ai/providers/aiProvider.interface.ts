export interface LLMGenerateOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  responseJson?: boolean;
}

export interface ProviderHealthStatus {
  id: string;
  name: string;
  isConfigured: boolean;
  isAvailable: boolean;
  latencyMs?: number;
  error?: string;
}

export interface AIProvider {
  readonly id: string;
  readonly name: string;
  isAvailable(): Promise<boolean>;
  generateCompletion(options: LLMGenerateOptions): Promise<string | null>;
  checkHealth(): Promise<ProviderHealthStatus>;
}

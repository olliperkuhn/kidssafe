import { AIProvider, LLMGenerateOptions, ProviderHealthStatus } from './aiProvider.interface';
import { defaultAIConfig } from '../../../config/ai.config';

interface OllamaGenerateResponse {
  response?: string;
  done?: boolean;
}

export class OllamaProvider implements AIProvider {
  public readonly id = 'ollama';
  public readonly name = 'Lokales Ollama (Open-Source)';

  private baseUrl: string;
  private model: string;
  private timeoutMs: number;

  constructor(
    baseUrl: string = defaultAIConfig.ollama.baseUrl,
    model: string = defaultAIConfig.ollama.model,
    timeoutMs: number = defaultAIConfig.timeoutMs
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.model = model;
    this.timeoutMs = timeoutMs;
  }

  public updateConfig(baseUrl?: string, model?: string): void {
    if (baseUrl) this.baseUrl = baseUrl.replace(/\/+$/, '');
    if (model) this.model = model;
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(1500),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async checkHealth(): Promise<ProviderHealthStatus> {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });
      const latencyMs = Date.now() - start;

      if (!res.ok) {
        return {
          id: this.id,
          name: this.name,
          isConfigured: true,
          isAvailable: false,
          latencyMs,
          error: `Ollama antwortete mit HTTP ${res.status}`,
        };
      }

      return {
        id: this.id,
        name: `${this.name} (${this.model})`,
        isConfigured: true,
        isAvailable: true,
        latencyMs,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Verbindungsfehler';
      return {
        id: this.id,
        name: this.name,
        isConfigured: true,
        isAvailable: false,
        latencyMs: Date.now() - start,
        error: errorMsg,
      };
    }
  }

  public async generateCompletion(options: LLMGenerateOptions): Promise<string | null> {
    try {
      const payload: Record<string, unknown> = {
        model: this.model,
        system: options.systemPrompt,
        prompt: options.userPrompt,
        stream: false,
        options: {
          temperature: options.temperature ?? defaultAIConfig.temperature,
        },
      };

      if (options.responseJson) {
        payload.format = 'json';
      }

      const res = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!res.ok) {
        return null;
      }

      const data = (await res.json()) as OllamaGenerateResponse;
      return data.response?.trim() || null;
    } catch {
      return null;
    }
  }
}

export const ollamaProvider = new OllamaProvider();

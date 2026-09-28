import { AIProvider, LLMGenerateOptions, ProviderHealthStatus } from './aiProvider.interface';
import { defaultAIConfig } from '../../../config/ai.config';

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export class GeminiProvider implements AIProvider {
  public readonly id = 'gemini';
  public readonly name = 'Google Gemini Flash (Cloud Flaggschiff)';

  private apiKey?: string;
  private model: string;
  private timeoutMs: number;

  constructor(
    apiKey: string | undefined = defaultAIConfig.gemini.apiKey,
    model: string = defaultAIConfig.gemini.model,
    timeoutMs: number = defaultAIConfig.timeoutMs
  ) {
    this.apiKey = apiKey;
    this.model = model;
    this.timeoutMs = timeoutMs;
  }

  public updateConfig(apiKey?: string, model?: string): void {
    if (apiKey !== undefined) this.apiKey = apiKey;
    if (model) this.model = model;
  }

  public async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public async checkHealth(): Promise<ProviderHealthStatus> {
    const isConfigured = Boolean(this.apiKey && this.apiKey.trim().length > 0);
    if (!isConfigured) {
      return {
        id: this.id,
        name: `${this.name} (${this.model})`,
        isConfigured: false,
        isAvailable: false,
        error: 'Kein GEMINI_API_KEY konfiguriert (Offline-Klassenzimmer-Modus)',
      };
    }

    const start = Date.now();
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      const latencyMs = Date.now() - start;

      if (!res.ok) {
        return {
          id: this.id,
          name: `${this.name} (${this.model})`,
          isConfigured: true,
          isAvailable: false,
          latencyMs,
          error: `Gemini API antwortete mit HTTP ${res.status}`,
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
      return {
        id: this.id,
        name: `${this.name} (${this.model})`,
        isConfigured: true,
        isAvailable: false,
        latencyMs: Date.now() - start,
        error: err instanceof Error ? err.message : 'Verbindungsfehler zu Google Gemini',
      };
    }
  }

  public async generateCompletion(options: LLMGenerateOptions): Promise<string | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const payload = {
        system_instruction: {
          parts: [{ text: options.systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: options.userPrompt }],
          },
        ],
        generationConfig: {
          temperature: options.temperature ?? defaultAIConfig.temperature,
          maxOutputTokens: defaultAIConfig.guardrails.maxTokens,
          responseMimeType: options.responseJson ? 'application/json' : 'text/plain',
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!res.ok) {
        return null;
      }

      const data = (await res.json()) as GeminiResponse;
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    } catch {
      return null;
    }
  }
}

export const geminiProvider = new GeminiProvider();

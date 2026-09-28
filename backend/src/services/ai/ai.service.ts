/**
 * AI Service: Entkoppelte Schnittstelle zu Open-Source-LLMs (z. B. Ollama / Gemma / Qwen)
 * Beinhaltet einen didaktischen Fallback-Mechanismus, damit Schulstunden auch ohne
 * aktiven GPU-Server oder bei Netzausfällen zu 100 % stabil und performant funktionieren.
 */

export interface LLMGenerateOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

export class AIService {
  private ollamaUrl: string;
  private defaultModel: string;

  constructor() {
    this.ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    this.defaultModel = process.env.OLLAMA_MODEL || 'gemma2:2b';
  }

  /**
   * Prüft, ob ein lokaler LLM-Dienst (z. B. Ollama) erreichbar ist.
   */
  public async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(1500),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Sendet einen Prompt an das lokale LLM, falls verfügbar.
   */
  public async generateText(options: LLMGenerateOptions): Promise<string | null> {
    const isOnline = await this.isAvailable();
    if (!isOnline) {
      return null;
    }

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.defaultModel,
          system: options.systemPrompt,
          prompt: options.userPrompt,
          stream: false,
          options: {
            temperature: options.temperature ?? 0.7,
          },
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as { response?: string };
      return data.response?.trim() || null;
    } catch {
      return null;
    }
  }
}

export const aiService = new AIService();

import fs from 'fs';
import path from 'path';
import { AIProvider, LLMGenerateOptions, ProviderHealthStatus } from './providers/aiProvider.interface';
import { geminiProvider, GeminiProvider } from './providers/geminiProvider';
import { ollamaProvider, OllamaProvider } from './providers/ollamaProvider';
import { mockProvider } from './providers/mockProvider';
import {
  AIConfig,
  AIProviderType,
  defaultAIConfig,
  GeminiConfig,
  OllamaConfig,
  GuardrailConfig,
} from '../../config/ai.config';
import { AIPromptBuilder, AttackerTurnDTO } from './aiPromptBuilder';
import { PhishingReviewDTO, ChatStatus } from '../../types/dto/phishing.dto';
import { logger } from '../../utils/logger';

export interface UpdateAIConfigInput {
  activeProvider?: AIProviderType;
  fallbackOrder?: AIProviderType[];
  temperature?: number;
  timeoutMs?: number;
  gemini?: Partial<GeminiConfig>;
  ollama?: Partial<OllamaConfig>;
  guardrails?: Partial<GuardrailConfig>;
}

const RUNTIME_CONFIG_PATH = path.join(process.cwd(), 'ai-runtime.json');

export class AIService {
  private config: AIConfig;
  private providers: Map<AIProviderType, AIProvider> = new Map();

  constructor() {
    this.config = { ...defaultAIConfig };
    this.providers.set('gemini', geminiProvider);
    this.providers.set('ollama', ollamaProvider);
    this.providers.set('mock', mockProvider);
    this.loadPersistedConfig();
  }

  public getActiveProviderId(): AIProviderType {
    return this.config.activeProvider;
  }

  public setActiveProviderId(provider: AIProviderType): void {
    if (this.providers.has(provider)) {
      this.config.activeProvider = provider;
      this.persistConfig();
    }
  }

  public getConfig(): AIConfig {
    return { ...this.config };
  }

  public updateRuntimeConfig(updates: UpdateAIConfigInput, persist = true): void {
    if (updates.activeProvider) this.config.activeProvider = updates.activeProvider;
    if (updates.fallbackOrder) this.config.fallbackOrder = updates.fallbackOrder;
    if (updates.temperature !== undefined) this.config.temperature = updates.temperature;
    if (updates.timeoutMs !== undefined) {
      this.config.timeoutMs = updates.timeoutMs;
      (this.providers.get('gemini') as GeminiProvider)?.updateConfig(
        undefined,
        undefined,
        updates.timeoutMs
      );
    }
    if (updates.gemini) {
      this.config.gemini = { ...this.config.gemini, ...updates.gemini };
      (this.providers.get('gemini') as GeminiProvider)?.updateConfig(
        updates.gemini.apiKey,
        updates.gemini.model,
        this.config.timeoutMs
      );
    }
    if (updates.ollama) {
      this.config.ollama = { ...this.config.ollama, ...updates.ollama };
      (this.providers.get('ollama') as OllamaProvider)?.updateConfig(
        updates.ollama.baseUrl,
        updates.ollama.model
      );
    }
    if (updates.guardrails) {
      this.config.guardrails = { ...this.config.guardrails, ...updates.guardrails };
    }
    if (persist) {
      this.persistConfig();
    }
  }

  private loadPersistedConfig(): void {
    try {
      if (fs.existsSync(RUNTIME_CONFIG_PATH)) {
        const raw = fs.readFileSync(RUNTIME_CONFIG_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (data && typeof data === 'object') {
          this.updateRuntimeConfig(data, false);
        }
      }
    } catch (err) {
      logger.warn('[AIService] Fehler beim Laden der Konfiguration:', err);
    }
  }

  private persistConfig(): void {
    try {
      const data = {
        activeProvider: this.config.activeProvider,
        temperature: this.config.temperature,
        timeoutMs: this.config.timeoutMs,
        gemini: {
          apiKey: this.config.gemini.apiKey,
          model: this.config.gemini.model,
        },
        ollama: {
          baseUrl: this.config.ollama.baseUrl,
          model: this.config.ollama.model,
        },
      };
      fs.writeFileSync(RUNTIME_CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      logger.warn('[AIService] Fehler beim Speichern der Konfiguration:', err);
    }
  }

  public async getProviderStatuses(): Promise<ProviderHealthStatus[]> {
    const statuses: ProviderHealthStatus[] = [];
    for (const provider of this.providers.values()) {
      const status = await provider.checkHealth();
      statuses.push(status);
    }
    return statuses;
  }

  /**
   * Führt einen Prompt mit automatischer Failover-Kaskade aus:
   * 1. Aktiver Provider (z. B. Gemini)
   * 2. Zweiter Provider laut Fallback-Order (z. B. Ollama)
   * 3. Letzte Instanz: Deterministischer Mock-Provider (Offline-Garantie)
   */
  public async generateWithCascade(
    options: LLMGenerateOptions,
    preferredProvider?: AIProviderType
  ): Promise<{ text: string; providerUsed: string }> {
    const primary = preferredProvider || this.config.activeProvider;
    const candidates = [primary, ...this.config.fallbackOrder.filter((p) => p !== primary)];

    for (const providerId of candidates) {
      const provider = this.providers.get(providerId);
      if (!provider) continue;

      try {
        const isOnline = await provider.isAvailable();
        if (!isOnline && providerId !== 'mock') {
          continue;
        }

        const result = await provider.generateCompletion(options);
        if (result && result.trim().length > 0) {
          return { text: result, providerUsed: provider.id };
        }
      } catch (err) {
        logger.warn(
          `[AIService] Provider ${providerId} Ausführungsfehler: ${err instanceof Error ? err.message : String(err)}`
        );
        continue;
      }
    }

    // Sollte selbst der Mock unerwartet fehlschlagen, liefert mockProvider die absolute Garantie
    const fallbackText = await mockProvider.generateCompletion(options);
    return { text: fallbackText || '', providerUsed: mockProvider.id };
  }

  /**
   * Generiert den nächsten Zug des Angreifers im Phishing-Simulator.
   */
  public async generateAttackerTurn(
    scenarioContext: string,
    history: Array<{ sender: string; text: string }>,
    step: number
  ): Promise<{ turn: AttackerTurnDTO; providerUsed: string }> {
    const prompts = AIPromptBuilder.buildAttackerPrompt(scenarioContext, history, step);
    const { text, providerUsed } = await this.generateWithCascade({
      systemPrompt: prompts.systemPrompt,
      userPrompt: prompts.userPrompt,
      responseJson: true,
    });

    const parsed = AIPromptBuilder.parseAttackerResponse(text);
    if (parsed) {
      return { turn: parsed, providerUsed };
    }

    // Bei ungültigem JSON deterministischen Fallback parsen
    const mockJson = await mockProvider.generateCompletion({
      systemPrompt: 'Angreifer',
      userPrompt: 'options attitude',
      responseJson: true,
    });
    return {
      turn: AIPromptBuilder.parseAttackerResponse(mockJson!)!,
      providerUsed: 'mock-parser-fallback',
    };
  }

  /**
   * Generiert die Nachbesprechung von Löwe Leo nach Abschluss eines Szenarios.
   */
  public async generateLeoReview(
    scenarioTitle: string,
    outcome: ChatStatus,
    history: Array<{ sender: string; text: string }>,
    chatId: string
  ): Promise<{ review: PhishingReviewDTO; providerUsed: string }> {
    const prompts = AIPromptBuilder.buildLeoReviewPrompt(scenarioTitle, outcome, history);
    const { text, providerUsed } = await this.generateWithCascade({
      systemPrompt: prompts.systemPrompt,
      userPrompt: prompts.userPrompt,
      responseJson: true,
    });

    const parsed = AIPromptBuilder.parseLeoReviewResponse(text, chatId, outcome);
    if (parsed) {
      return { review: parsed, providerUsed };
    }

    // Bei ungültigem JSON deterministischen Fallback parsen
    const mockJson = await mockProvider.generateCompletion({
      systemPrompt: 'Löwe Leo Warnsignale',
      userPrompt: 'Detektiv Review',
      responseJson: true,
    });
    return {
      review: AIPromptBuilder.parseLeoReviewResponse(mockJson!, chatId, outcome)!,
      providerUsed: 'mock-parser-fallback',
    };
  }
}

export const aiService = new AIService();

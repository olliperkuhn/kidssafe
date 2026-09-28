import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai/ai.service';
import { AIProviderType } from '../config/ai.config';
import { z } from 'zod';

const updateAiConfigSchema = z.object({
  activeProvider: z.enum(['mock', 'ollama', 'gemini']).optional(),
  temperature: z.number().min(0).max(2).optional(),
  gemini: z
    .object({
      apiKey: z.string().optional(),
      model: z.string().optional(),
    })
    .optional(),
  ollama: z
    .object({
      baseUrl: z.string().url().optional(),
      model: z.string().optional(),
    })
    .optional(),
});

const testAiPromptSchema = z.object({
  provider: z.enum(['mock', 'ollama', 'gemini']).optional(),
  systemPrompt: z.string().default('Du bist ein kindgerechter Assistent.'),
  userPrompt: z.string().default('Erkläre in einem Satz, was ein Passwort ist.'),
  responseJson: z.boolean().default(false),
});

export class AdminAIController {
  /**
   * GET /api/admin/ai/status
   * Liefert aktuellen Status aller Provider (Verbindung, Latenz) & Konfiguration.
   */
  public async getStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = aiService.getConfig();
      const providerStatuses = await aiService.getProviderStatuses();

      // Maskiere Gemini API-Key für sichere Übertragung
      const maskedKey = config.gemini.apiKey
        ? `${config.gemini.apiKey.substring(0, 6)}...${config.gemini.apiKey.slice(-4)}`
        : undefined;

      res.status(200).json({
        success: true,
        data: {
          activeProvider: config.activeProvider,
          fallbackOrder: config.fallbackOrder,
          temperature: config.temperature,
          providers: providerStatuses,
          models: {
            gemini: {
              model: config.gemini.model,
              apiKeyConfigured: Boolean(config.gemini.apiKey),
              apiKeyMasked: maskedKey,
            },
            ollama: {
              baseUrl: config.ollama.baseUrl,
              model: config.ollama.model,
            },
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/ai/config
   * Erlaubt Lehrkräften/Admins, den aktiven Provider oder Parameter zur Laufzeit anzupassen.
   */
  public async updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateAiConfigSchema.parse(req.body);

      if (parsed.activeProvider) {
        aiService.setActiveProviderId(parsed.activeProvider as AIProviderType);
      }

      aiService.updateRuntimeConfig(parsed);

      res.status(200).json({
        success: true,
        message: 'KI-Konfiguration erfolgreich aktualisiert',
        data: {
          activeProvider: aiService.getActiveProviderId(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/ai/test
   * Führt einen Test-Prompt über den gewählten oder aktiven Provider aus.
   */
  public async testPrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = testAiPromptSchema.parse(req.body);
      const start = Date.now();

      const result = await aiService.generateWithCascade(
        {
          systemPrompt: parsed.systemPrompt,
          userPrompt: parsed.userPrompt,
          responseJson: parsed.responseJson,
        },
        parsed.provider as AIProviderType | undefined
      );

      const latencyMs = Date.now() - start;

      res.status(200).json({
        success: true,
        data: {
          response: result.text,
          providerUsed: result.providerUsed,
          latencyMs,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const adminAiController = new AdminAIController();

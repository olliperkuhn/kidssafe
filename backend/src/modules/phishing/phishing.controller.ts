import { Request, Response, NextFunction } from 'express';
import { phishingService } from './phishing.service';
import {
  replyPhishingRequestSchema,
  startPhishingRequestSchema,
} from '../../types/dto/phishing.dto';

export class PhishingController {
  public async start(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = startPhishingRequestSchema.safeParse(req.body);
      const scenarioCount = parsed.success ? parsed.data.scenarioCount : 3;

      const initialStep = phishingService.startSession(scenarioCount);
      res.status(200).json(initialStep);
    } catch (err) {
      next(err);
    }
  }

  public async reply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = replyPhishingRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { message: 'Ungültige Anfrage', details: parsed.error.issues } });
        return;
      }

      const nextStep = phishingService.replyToChat(parsed.data.chatId, parsed.data.selectedOptionId);
      res.status(200).json(nextStep);
    } catch (err) {
      next(err);
    }
  }

  public async nextScenario(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const chatId = req.body?.chatId;
      if (!chatId || typeof chatId !== 'string') {
        res.status(400).json({ error: { message: 'chatId ist erforderlich' } });
        return;
      }

      const step = phishingService.nextScenario(chatId);
      res.status(200).json(step);
    } catch (err) {
      next(err);
    }
  }

  public async review(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawId = req.params.chatId;
      const chatId = Array.isArray(rawId) ? rawId[0] : rawId;
      if (!chatId) {
        res.status(400).json({ error: { message: 'chatId fehlt' } });
        return;
      }

      const review = await phishingService.getLeoReview(chatId);
      res.status(200).json(review);
    } catch (err) {
      next(err);
    }
  }
}

export const phishingController = new PhishingController();

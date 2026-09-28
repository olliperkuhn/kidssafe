import { Request, Response, NextFunction } from 'express';
import { fakeNewsService } from './fakeNews.service';
import {
  startFakeNewsRequestSchema,
  submitVerdictRequestSchema,
  factCheckToolTypeSchema,
} from '../../types/dto/fakenews.dto';

export class FakeNewsController {
  public async start(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = startFakeNewsRequestSchema.safeParse(req.body);
      const count = parsed.success ? parsed.data.count : 4;
      const difficulty = parsed.success ? parsed.data.difficulty : 'JUNIOR';

      const session = await fakeNewsService.startSession(count, difficulty);
      res.status(200).json(session);
    } catch (err) {
      next(err);
    }
  }

  public async inspect(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.body?.sessionId;
      const rawArticleId = req.params?.articleId;
      const articleId = Array.isArray(rawArticleId) ? rawArticleId[0] : rawArticleId;
      const rawTool = req.body?.toolType;

      if (!sessionId || !articleId) {
        res.status(400).json({ error: { message: 'sessionId und articleId sind erforderlich' } });
        return;
      }

      const parsedTool = factCheckToolTypeSchema.safeParse(rawTool);
      const toolType = parsedTool.success ? parsedTool.data : 'PLAUSIBILITY_CHECK';

      const result = fakeNewsService.inspectArticle(sessionId, articleId, toolType);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async vote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = submitVerdictRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { message: 'Ungültige Anfrage', details: parsed.error.issues } });
        return;
      }

      const result = fakeNewsService.submitVerdict(
        parsed.data.sessionId,
        parsed.data.articleId,
        parsed.data.userVerdict
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async summary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawId = req.params?.sessionId;
      const sessionId = Array.isArray(rawId) ? rawId[0] : rawId;
      if (!sessionId) {
        res.status(400).json({ error: { message: 'sessionId fehlt' } });
        return;
      }

      const summary = fakeNewsService.getSessionSummary(sessionId);
      res.status(200).json(summary);
    } catch (err) {
      next(err);
    }
  }
}

export const fakeNewsController = new FakeNewsController();

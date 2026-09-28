import { Router } from 'express';
import { fakeNewsController } from './fakeNews.controller';

const router = Router();

router.post('/start', (req, res, next) => fakeNewsController.start(req, res, next));
router.post('/inspect/:articleId', (req, res, next) => fakeNewsController.inspect(req, res, next));
router.post('/vote', (req, res, next) => fakeNewsController.vote(req, res, next));
router.get('/summary/:sessionId', (req, res, next) => fakeNewsController.summary(req, res, next));

export default router;

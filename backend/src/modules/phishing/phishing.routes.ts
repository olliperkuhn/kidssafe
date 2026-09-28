import { Router } from 'express';
import { phishingController } from './phishing.controller';

const router = Router();

router.post('/start', (req, res, next) => phishingController.start(req, res, next));
router.post('/reply', (req, res, next) => phishingController.reply(req, res, next));
router.post('/next', (req, res, next) => phishingController.nextScenario(req, res, next));
router.get('/review/:chatId', (req, res, next) => phishingController.review(req, res, next));

export default router;

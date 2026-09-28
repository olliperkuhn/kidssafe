import { Router } from 'express';
import { adminAiController } from '../controllers/adminAi.controller';
import { authenticateAdult, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Alle AI-Admin-Routen erfordern Teacher- oder Admin-Berechtigung
router.use(authenticateAdult);
router.use(requireRole(UserRole.TEACHER, UserRole.ADMIN));

router.get('/status', (req, res, next) => adminAiController.getStatus(req, res, next));
router.post('/config', (req, res, next) => adminAiController.updateConfig(req, res, next));
router.post('/test', (req, res, next) => adminAiController.testPrompt(req, res, next));

export default router;

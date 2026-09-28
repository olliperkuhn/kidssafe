import { Router } from 'express';
import { codeController } from '../controllers/code.controller';
import { authenticateAdult, requireRole } from '../middleware/auth.middleware';
import { codeVerifyLimiter, guestCreateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Öffentliche Routen für Kinder (Security by Design: keine Registrierung)
router.post('/verify', codeVerifyLimiter, (req, res, next) => {
  codeController.verifyCode(req, res, next);
});

router.get('/resume', (req, res, next) => {
  codeController.resumeSession(req, res, next);
});

router.post('/guest', guestCreateLimiter, (req, res, next) => {
  codeController.createGuest(req, res, next);
});

// Geschützte Routen für Lehrkräfte & Admins
router.post('/classrooms', authenticateAdult, requireRole('TEACHER', 'ADMIN'), (req, res, next) => {
  codeController.createClassroom(req, res, next);
});

router.get('/classrooms', authenticateAdult, requireRole('TEACHER', 'ADMIN'), (req, res, next) => {
  codeController.listClassrooms(req, res, next);
});

router.post('/generate', authenticateAdult, requireRole('TEACHER', 'ADMIN'), (req, res, next) => {
  codeController.generateBatch(req, res, next);
});

export default router;

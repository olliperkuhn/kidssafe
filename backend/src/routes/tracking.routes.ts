import { Router } from 'express';
import { trackingController } from '../controllers/tracking.controller';
import { authenticateChild, authenticateAdult, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Schüler-Heartbeat (gesichert durch Kind-Token oder Session-Cookie)
router.post('/heartbeat', authenticateChild, (req, res, next) => {
  trackingController.heartbeat(req, res, next);
});

// Lehrkräfte-Live-Tracking für eine Schulklasse
router.get('/classroom/:classroomId', authenticateAdult, requireRole('TEACHER', 'ADMIN'), (req, res, next) => {
  trackingController.getLiveStatus(req, res, next);
});

export default router;

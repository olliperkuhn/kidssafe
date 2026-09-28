import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import codeRoutes from './code.routes';
import trackingRoutes from './tracking.routes';
import moduleRoutes from './module.routes';
import adminAiRoutes from './adminAi.routes';

const apiRouter = Router();

apiRouter.use(healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/codes', codeRoutes);
apiRouter.use('/tracking', trackingRoutes);
apiRouter.use('/modules', moduleRoutes);
apiRouter.use('/admin/ai', adminAiRoutes);

export default apiRouter;

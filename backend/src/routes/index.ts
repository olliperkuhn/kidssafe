import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import codeRoutes from './code.routes';
import trackingRoutes from './tracking.routes';

const apiRouter = Router();

apiRouter.use(healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/codes', codeRoutes);
apiRouter.use('/tracking', trackingRoutes);

export default apiRouter;

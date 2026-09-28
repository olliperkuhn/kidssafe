import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import codeRoutes from './code.routes';

const apiRouter = Router();

apiRouter.use(healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/codes', codeRoutes);

export default apiRouter;

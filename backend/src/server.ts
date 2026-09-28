import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { prisma } from './models/prisma';

const app = express();

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

// Server Start
const server = app.listen(env.PORT, () => {
  logger.info(`Kidssafe Backend läuft auf http://localhost:${env.PORT} [${env.NODE_ENV}]`);
});

// Graceful Shutdown
async function shutdown(): Promise<void> {
  logger.info('Beende Kidssafe Backend...');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Server und Datenbankverbindungen sauber beendet.');
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;

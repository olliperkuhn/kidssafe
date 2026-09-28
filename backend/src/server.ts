import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import apiRouter from './routes';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { prisma } from './models/prisma';

const app = express();

// Cloud Reverse Proxy Trust (für korrekte Client-IPs bei Rate-Limiting & Logging)
app.set('trust proxy', 1);

// Security Headers (OWASP Empfehlungen)
app.use(
  helmet({
    contentSecurityPolicy: false, // Erlaubt lokale Dev-Tools und Inline-Styles für PWA
    crossOriginEmbedderPolicy: false,
  })
);
app.disable('x-powered-by');

// Middlewares & DoS-Schutz
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(express.json({ limit: '250kb' })); // Schutz vor überdimensionierten JSON-Payloads

// Globales Rate-Limiting auf alle API-Routen
app.use('/api', globalLimiter);

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

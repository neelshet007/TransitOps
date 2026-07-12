import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import { HTTP_STATUS } from './constants';
import { successResponse } from '@transitops/utils';

const app = express();

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// Request parsing & compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// HTTP Request logging with Morgan
const morganFormat = config.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }),
);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json(
    successResponse('System is healthy.', {
      status: 'UP',
      timestamp: new Date(),
      uptime: process.uptime(),
    }),
  );
});

// Register routes
app.use('/api/v1/auth', authRoutes);

// Fallback handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(config.PORT, () => {
  logger.info(`🚀 TransitOps API server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
});

process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Promise Rejection: %o', reason);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

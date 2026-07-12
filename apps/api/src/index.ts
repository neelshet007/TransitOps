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
import userRoutes from './routes/user.routes';
import roleRoutes from './routes/role.routes';
import permissionRoutes from './routes/permission.routes';
import driverRoutes from './routes/driver.routes';
import dashboardRoutes from './routes/dashboard.routes';
import vehicleRoutes from './routes/vehicle.routes';
import lookupRoutes from './routes/lookup.routes';
import fleetRoutes from './routes/fleet.routes';
import tripRoutes from './routes/trip.routes';
import reportRoutes from './routes/report.routes';
import maintenanceRoutes from './routes/maintenance.routes';
import expenseRoutes from './routes/expense.routes';
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

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

app.use('/api/', limiter);

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Logging
const morganFormat = config.NODE_ENV === 'production' ? 'combined' : 'dev';

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  }),
);

// Health Check
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json(
    successResponse('System is healthy.', {
      status: 'UP',
      timestamp: new Date(),
      uptime: process.uptime(),
    }),
  );
});

// Root
app.get('/', (req, res) => {
  res.status(HTTP_STATUS.OK).json(
    successResponse(
      'TransitOps API is running. Database connection established.',
      {
        status: 'UP',
        timestamp: new Date(),
      },
    ),
  );
});

// ===============================
// API Routes
// ===============================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/permissions', permissionRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/lookup', lookupRoutes);
app.use('/api/v1/fleet', fleetRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1', reportRoutes);

// ===============================
// Error Handlers
// ===============================
app.use(notFoundHandler);
app.use(errorHandler);

// ===============================
// Start Server
// ===============================
const server = app.listen(config.PORT, () => {
  logger.info(
    `🚀 TransitOps API server running in ${config.NODE_ENV} mode on port ${config.PORT}`,
  );
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Promise Rejection: %o', reason);

  server.close(() => {
    process.exit(1);
  });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');

  server.close(() => {
    logger.info('HTTP server closed');
  });
});
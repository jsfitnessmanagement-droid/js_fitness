// Load env vars FIRST, before any other module reads process.env
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cronJobs = require('./services/cronJobs');

const app = express();

// security and rate limiting (best-effort requires packages installed)
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

try {
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
  app.use(limiter);
} catch (e) {
  console.warn('express-rate-limit not installed — skip');
}

// Middleware
const cookieParser = require('cookie-parser');
try {
  const morgan = require('morgan');
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
} catch (e) {
  console.warn('morgan not installed — skip');
}
app.use(express.json());
// ensure cookies are parsed before routes
app.use(cookieParser());
// CORS — allow frontend origin and include credentials for refresh cookies
const allowedOrigins = (process.env.CORS_ORIGIN || 'https://js-fitness-lilac.vercel.app')
  .split(',')
  .map(o => o.trim());
console.log('Allowed CORS origins:', allowedOrigins);
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/membership-plans', require('./routes/membershipPlanRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// process-level handlers
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // optional: exit in production
  if (process.env.NODE_ENV === 'production') process.exit(1);
});

// Attach centralized error handlers (require after routes)
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;

// If server.js is run directly, start the server and connect to DB
if (require.main === module) {
  const connectDB = require('./config/db');

  // Basic env validation
  const requiredEnvs = ['MONGO_URI', 'JWT_SECRET'];
  const missing = requiredEnvs.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('Missing required environment variables:', missing.join(', '));
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }

  connectDB()
    .then(() => {
      const PORT = process.env.PORT || 5000;
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        cronJobs.init();
      });

      // Graceful shutdown
      process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
          console.log('HTTP server closed');
          mongoose.connection.close(false).then(() => {
            console.log('MongoDB connection closed');
            process.exit(0);
          });
        });
      });
    })
    .catch((err) => {
      console.error('Failed to connect to DB:', err);
      process.exit(1);
    });
}

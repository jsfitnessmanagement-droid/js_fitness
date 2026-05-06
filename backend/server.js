const express = require('express');
const cors = require('cors');
const cronJobs = require('./services/cronJobs');

const app = express();

// security and rate limiting (best-effort requires packages installed)
try {
  const helmet = require('helmet');
  app.use(helmet());
} catch (e) {
  console.warn('helmet not installed — skip');
}

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
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://js-fitness-lilac.vercel.app/',
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

app.get('/', (req, res) => {
  res.send('API is running...');
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
  const dotenv = require('dotenv');
  const connectDB = require('./config/db');
  dotenv.config();

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
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        cronJobs.init();
      });
    })
    .catch((err) => {
      console.error('Failed to connect to DB:', err);
      process.exit(1);
    });
}

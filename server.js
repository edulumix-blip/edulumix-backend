import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { startDailyJobFetchCron } from './cron/dailyJobFetch.js';
import { startDailyResourceFetchCron } from './cron/dailyResourceFetch.js';
import { startDailyCourseFetchCron } from './cron/dailyCourseFetch.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import productRoutes from './routes/productRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import mockTestRoutes from './routes/mockTestRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load env vars
dotenv.config();

// Validate critical env vars at startup
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be set and at least 32 characters long');
  process.exit(1);
}

// Connect to database
connectDB();

// Start daily job fetch cron (Adzuna + JSearch at scheduled time)
startDailyJobFetchCron();
// Start daily resource fetch cron (Dev.to, freeCodeCamp, Hashnode, YouTube)
startDailyResourceFetchCron();
startDailyCourseFetchCron();

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3045',
  'http://localhost:3046',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:3045',
  'http://127.0.0.1:5173',
  'http://10.59.50.240:5173', // Local network for mobile testing
  process.env.CLIENT_URL, // Production frontend URL
  'https://edulumix.in', // Custom domain
  'https://www.edulumix.in', // www subdomain
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed (includes Firebase domains)
    if (allowedOrigins.includes(origin) || 
        origin.endsWith('.netlify.app') || 
        origin.endsWith('.web.app') || 
        origin.endsWith('.firebaseapp.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware - Helmet: allow cross-origin for API (frontend on different port)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize()); // Prevent NoSQL injection ($ and . in keys)

// General API rate limiting (100 req/15 min per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/products', productRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/mocktests', mockTestRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/chat', chatRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduLumix API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EduLumix API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 EduLumix Server Started Successfully!                ║
║                                                            ║
║   📍 Server running on: http://localhost:${PORT}              ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                            ║
║                                                            ║
║   Available Endpoints:                                     ║
║   ├── POST   /api/auth/signup                              ║
║   ├── POST   /api/auth/login                               ║
║   ├── GET    /api/auth/me                                  ║
║   ├── GET    /api/users                                    ║
║   ├── GET    /api/jobs                                     ║
║   ├── GET    /api/resources                                ║
║   ├── GET    /api/blogs                                    ║
║   └── GET    /api/products                                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

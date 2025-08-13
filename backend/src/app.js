require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); // Load .env from backend folder
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Debug environment variables
console.log('🔍 Environment check:');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Expected .env path:', path.join(__dirname, '..', '.env'));
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('PORT:', process.env.PORT || 'not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'loaded ✅' : 'not loaded ❌');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'loaded ✅' : 'not loaded ❌');
console.log('ADMIN_JWT_SECRET:', process.env.ADMIN_JWT_SECRET ? 'loaded ✅' : 'not loaded ❌');
if (process.env.MONGODB_URI) {
  console.log('MongoDB URI starts with:', process.env.MONGODB_URI.substring(0, 25) + '...');
}

const app = express();
const PORT = process.env.PORT || 5001;

// Security: Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Enhanced CORS configuration for security
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? function (origin, callback) {
        // Allow requests from any Vercel deployment under your account
        if (!origin || origin.includes('ananyas-projects-00b32e57.vercel.app')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    : ['http://localhost:3000', 'http://localhost:3001'], // Allow both dev ports
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection with security options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  // Security options for Atlas
  retryWrites: true,
  w: 'majority'
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alankree-saree-store', mongoOptions)
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('📊 Database:', mongoose.connection.db.databaseName);
  console.log('🌐 Connection ready state:', mongoose.connection.readyState);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('⚠️  Continuing with local fallback data...');
});

// MongoDB connection event listeners for monitoring
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
});

// Routes
// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Alankree Saree Store Backend API is running!',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            orders: '/api/orders',
            admin: '/api/admin',
            users: '/api/users',
            notifications: '/api/notifications'
        },
        adminEndpoints: {
            login: 'POST /api/admin/login',
            dashboard: 'GET /api/admin/dashboard-stats',
            orders: 'GET /api/admin/orders',
            updateOrder: 'PUT /api/admin/orders/:id/status',
            products: 'GET /api/admin/products',
            notifications: 'GET /api/notifications'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

// Updated to port 5002
module.exports = app;
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from './middleware/errorHandler.js';
import productRoutes from './routes/products.js';
import aiRoutes from './routes/ai.js';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import WebSocketService from './services/websocketService.js';
import paymentRoutes from './routes/payments.js';
import instagramRoutes from './routes/instagram.js';
import orderRoutes from './routes/orderRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import authRoutes from './routes/auth.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket with the HTTP server
WebSocketService.initialize(server);

// FIXED CORS CONFIGURATION - Use this simplified approach
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// REMOVE the problematic line: app.options('*', cors());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ADD THIS - Manual preflight handler for specific routes
app.options('/api/auth/login', cors()); // Specific route for login
app.options('/api/ai/generate-post', cors()); // Specific route for AI

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CORS is working!',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/orders', orderRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Delightico AI Marketing API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth mock endpoint to prevent frontend errors
app.get('/api/auth/profile', (req, res) => {
  res.json({
    user: {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@delightico.com',
      role: 'customer'
    }
  });
});

// AI test endpoint
app.get('/api/test-ai', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AI endpoint is accessible',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// Use the HTTP server to listen, not the Express app
server.listen(PORT, () => {
  console.log(`🚀 Delightico server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 WebSocket server initialized`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 CORS test: http://localhost:${PORT}/api/cors-test`);
  console.log(`🔗 Auth profile: http://localhost:${PORT}/api/auth/profile`);
  console.log(`🔗 CORS enabled for: http://localhost:3000, http://localhost:5173, http://localhost:5174`);
  console.log(`💳 Payment routes available at: http://localhost:${PORT}/api/payments`);
  console.log(`📸 Instagram routes available at: http://localhost:${PORT}/api/instagram`);
});
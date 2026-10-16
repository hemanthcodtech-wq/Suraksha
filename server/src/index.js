import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSchema } from './db/schema.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Property Suraksha Express Backend (Neon PostgreSQL)'
  });
});

// Initialize database schema and start server
const startServer = async () => {
  try {
    if (process.env.DATABASE_URL) {
      await initSchema();
    } else {
      console.warn('⚠️ Server started without DATABASE_URL. Please add your Neon connection string in server/.env');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Property Suraksha Backend running on port ${PORT}`);
      console.log(`📡 Admin API active at http://localhost:${PORT}/api/admin`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

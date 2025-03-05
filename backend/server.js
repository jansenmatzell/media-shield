import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Import route handlers
import articleRoutes from './routes/articles.js';
import sourceRoutes from './routes/sources.js';
import factCheckRoutes from './routes/fact-check.js';

// Load environment variables
dotenv.config();

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
}

// API Routes
app.use('/api/articles', articleRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/fact-checks', factCheckRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'MediaShield API',
    version: '1.0.0',
    endpoints: [
      { path: '/api/articles/analyze', method: 'POST', description: 'Analyze an article URL' },
      { path: '/api/sources/:domain', method: 'GET', description: 'Get information about a news source' },
      { path: '/api/fact-checks', method: 'GET', description: 'Get fact check results for a claim' }
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Fallback route to serve index.html in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST, before any other imports
dotenv.config({ path: join(__dirname, '.env') });

import { createServer } from 'http';
import app from './src/app.js';
import { sequelize } from './src/models/index.js';
import { initializeSocketIO } from './src/config/socket.js';
import process from 'process';

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO with authentication and rooms
const io = initializeSocketIO(server);

// Make io accessible in routes/controllers
app.set('io', io);

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await sequelize.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
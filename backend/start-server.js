// Small entrypoint to start the Express app in all environments
import app from './src/index-refactored.js';
import { config } from './src/config/database.js';

const PORT = process.env.PORT || config.port || 3001;

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

const server = app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  console.log('🚀 PERGUNU API SERVER STARTED');
  console.log(`🌐 Server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Listening for connections...`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

export default app;

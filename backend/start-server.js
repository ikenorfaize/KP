// Small entrypoint to start the Express app in all environments
import app from './src/index-refactored.js';
import { config } from './src/config/database.js';

const PORT = process.env.PORT || config.port || 3001;

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  console.log('🚀 PERGUNU API SERVER STARTED');
  console.log(`🌐 Server running on http://0.0.0.0:${PORT}`);
});

export default app;

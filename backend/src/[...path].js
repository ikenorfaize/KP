// Catch-all serverless function for Vercel
// This wraps the Express app from index.js to handle all /api/* routes properly
import app from './index.js';

// Export the Express app as serverless function handler
export default app;

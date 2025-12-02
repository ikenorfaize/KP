// Migration script: JSON to MongoDB
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
config({ path: join(__dirname, '..', '.env') });

async function migrate() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not set in environment');
    console.log('Please set MONGODB_URI in .env or Vercel environment');
    process.exit(1);
  }

  console.log('📦 Starting migration from JSON to MongoDB...');

  try {
    // Read current JSON data
    const jsonPath = join(__dirname, 'db.json');
    const jsonData = JSON.parse(readFileSync(jsonPath, 'utf8'));

    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('pergunu');

    // Migrate each collection
    for (const [collectionName, data] of Object.entries(jsonData)) {
      if (Array.isArray(data) && data.length > 0) {
        const collection = db.collection(collectionName);
        
        // Clear existing data
        await collection.deleteMany({});
        console.log(`🗑️ Cleared ${collectionName}`);
        
        // Insert new data
        await collection.insertMany(data);
        console.log(`✅ Migrated ${data.length} documents to ${collectionName}`);
      }
    }

    await client.close();
    console.log('✅ Migration completed successfully!');
    console.log('📝 Next steps:');
    console.log('1. Add MONGODB_URI to Vercel environment variables');
    console.log('2. Redeploy to Vercel');
    console.log('3. Test the application');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

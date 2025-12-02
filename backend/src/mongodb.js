import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log('⚠️ MongoDB URI not found, using JSON file');
    return null;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    
    // Extract database name from URI or use default
    const dbName = uri.includes('/pergunu_db?') ? 'pergunu_db' : 'pergunu_db';
    db = client.db(dbName);
    
    console.log('✅ MongoDB connected to database:', dbName);
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Connection URI pattern:', uri.substring(0, 30) + '...');
    return null;
  }
}

export async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

export function getDB() {
  return db;
}

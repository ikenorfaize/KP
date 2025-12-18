// ===================================
// DATABASE UTILITIES
// ===================================

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { DB_PATH } from '../config/database.js';

/**
 * Read entire database
 */
export const readDB = () => {
  try {
    if (!existsSync(DB_PATH)) {
      console.error('❌ Database file not found:', DB_PATH);
      return { users: [], news: [], beasiswa: [], applications: [], beasiswa_applications: [] };
    }
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading database:', error.message);
    return { users: [], news: [], beasiswa: [], applications: [], beasiswa_applications: [] };
  }
};

/**
 * Write entire database
 */
export const writeDB = (data) => {
  try {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('❌ Error writing database:', error.message);
    return false;
  }
};

/**
 * Get items from a collection
 */
export const getCollection = (collectionName) => {
  const data = readDB();
  return data[collectionName] || [];
};

/**
 * Save entire collection
 */
export const saveCollection = (collectionName, items) => {
  const data = readDB();
  data[collectionName] = items;
  writeDB(data);
  console.log(`✅ Saved ${items.length} items to LOCAL JSON: ${collectionName}`);
};

/**
 * Update a single document by ID
 */
export const updateDocument = (collectionName, documentId, updates) => {
  const data = readDB();
  const items = data[collectionName] || [];
  const index = items.findIndex(item => String(item.id) === String(documentId));
  
  if (index !== -1) {
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    writeDB(data);
    console.log(`✅ Updated document in LOCAL JSON: ${collectionName}, id=${documentId}`);
    return items[index];
  }
  return null;
};

/**
 * Delete a single document by ID
 */
export const deleteDocument = (collectionName, documentId) => {
  const data = readDB();
  const items = data[collectionName] || [];
  const filteredItems = items.filter(item => String(item.id) !== String(documentId));
  
  if (filteredItems.length < items.length) {
    data[collectionName] = filteredItems;
    writeDB(data);
    console.log(`✅ Deleted document from LOCAL JSON: ${collectionName}, id=${documentId}`);
    return true;
  }
  return false;
};

/**
 * Add a new document to collection
 */
export const addDocument = (collectionName, document) => {
  const data = readDB();
  const items = data[collectionName] || [];
  
  const newDocument = {
    ...document,
    id: document.id || Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  items.push(newDocument);
  data[collectionName] = items;
  writeDB(data);
  
  console.log(`✅ Added document to LOCAL JSON: ${collectionName}, id=${newDocument.id}`);
  return newDocument;
};

/**
 * Find one document by query
 */
export const findOne = (collectionName, query) => {
  const items = getCollection(collectionName);
  return items.find(item => {
    return Object.keys(query).every(key => {
      if (key === 'id') return String(item[key]) === String(query[key]);
      return item[key] === query[key];
    });
  });
};

/**
 * Find all documents matching query
 */
export const findMany = (collectionName, query = {}) => {
  const items = getCollection(collectionName);
  
  if (Object.keys(query).length === 0) {
    return items;
  }
  
  return items.filter(item => {
    return Object.keys(query).every(key => {
      if (key === 'id') return String(item[key]) === String(query[key]);
      return item[key] === query[key];
    });
  });
};

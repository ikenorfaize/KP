// ===================================
// BEASISWA CONTROLLER
// ===================================

import { getCollection, saveCollection, addDocument, updateDocument, deleteDocument, findOne } from '../utils/database.js';
import { generateId, sanitizeHtml, successResponse, errorResponse, paginate } from '../utils/helpers.js';

/**
 * Get all beasiswa
 */
export const getAllBeasiswa = (req, res) => {
  try {
    const beasiswa = getCollection('beasiswa').sort((a, b) => {
      const idA = typeof a.id === 'string' ? parseInt(a.id) : a.id;
      const idB = typeof b.id === 'string' ? parseInt(b.id) : b.id;
      return idB - idA;
    });

    const { page, limit, status } = req.query;

    // Filter by status if provided
    let filtered = beasiswa;
    if (status) {
      filtered = beasiswa.filter(b => b.status === status);
    }

    if (page && limit) {
      const result = paginate(filtered, parseInt(page), parseInt(limit));
      return res.json(successResponse(result));
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error get beasiswa:', error);
    res.status(500).json(errorResponse('Failed to fetch beasiswa', error));
  }
};

/**
 * Get beasiswa by ID - supports both string and integer ID
 */
export const getBeasiswaById = (req, res) => {
  try {
    const { id } = req.params;
    const allBeasiswa = getCollection('beasiswa');
    const beasiswa = allBeasiswa.find(b => b.id === id || b.id === parseInt(id));

    if (!beasiswa) {
      return res.status(404).json(errorResponse('Beasiswa not found'));
    }

    res.json(beasiswa);
  } catch (error) {
    console.error('Error get beasiswa by ID:', error);
    res.status(500).json(errorResponse('Failed to fetch beasiswa', error));
  }
};

/**
 * Create beasiswa
 */
export const createBeasiswa = (req, res) => {
  try {
    const {
      judul,
      nominal,
      deadline,
      tanggal_mulai,
      deskripsi,
      persyaratan,
      kategori,
      image,
      status
    } = req.body;

    if (!judul || !deskripsi || !nominal) {
      return res.status(400).json(errorResponse('Judul, deskripsi, and nominal are required'));
    }

    const newBeasiswa = addDocument('beasiswa', {
      judul: judul.trim(),
      deskripsi: sanitizeHtml(deskripsi),
      nominal: nominal,
      deadline: deadline || null,
      tanggal_mulai: tanggal_mulai || null,
      persyaratan: persyaratan || [],
      kategori: kategori || 'Pendidikan',
      image: image || '/uploads/images/placeholder-beasiswa.png',
      status: status || 'active',
      applicants: 0
    });

    console.log('Beasiswa created:', newBeasiswa.judul);

    res.status(201).json(successResponse(newBeasiswa, 'Beasiswa created successfully'));
  } catch (error) {
    console.error('Error create beasiswa:', error);
    res.status(500).json(errorResponse('Failed to create beasiswa', error));
  }
};

/**
 * Update beasiswa - supports both string and integer ID
 */
export const updateBeasiswa = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Sanitize deskripsi if provided
    if (updates.deskripsi) {
      updates.deskripsi = sanitizeHtml(updates.deskripsi);
    }

    // Get beasiswa collection
    const allBeasiswa = getCollection('beasiswa');
    const beasiswaIndex = allBeasiswa.findIndex(b => b.id === id || b.id === parseInt(id));

    if (beasiswaIndex === -1) {
      return res.status(404).json(errorResponse('Beasiswa not found'));
    }

    // Update beasiswa
    allBeasiswa[beasiswaIndex] = {
      ...allBeasiswa[beasiswaIndex],
      ...updates,
      id: allBeasiswa[beasiswaIndex].id // Keep original ID
    };

    saveCollection('beasiswa', allBeasiswa);

    console.log('Beasiswa updated: ID', id);

    res.json(successResponse(allBeasiswa[beasiswaIndex], 'Beasiswa updated successfully'));
  } catch (error) {
    console.error('Error update beasiswa:', error);
    res.status(500).json(errorResponse('Failed to update beasiswa', error));
  }
};

/**
 * Delete beasiswa - supports both string and integer ID
 */
export const deleteBeasiswa = (req, res) => {
  try {
    const { id } = req.params;

    const allBeasiswa = getCollection('beasiswa');
    const beasiswaIndex = allBeasiswa.findIndex(b => b.id === id || b.id === parseInt(id));

    if (beasiswaIndex === -1) {
      return res.status(404).json(errorResponse('Beasiswa not found'));
    }

    allBeasiswa.splice(beasiswaIndex, 1);
    saveCollection('beasiswa', allBeasiswa);

    console.log('Beasiswa deleted: ID', id);

    res.json(successResponse({ id }, 'Beasiswa deleted successfully'));
  } catch (error) {
    console.error('Error delete beasiswa:', error);
    res.status(500).json(errorResponse('Failed to delete beasiswa', error));
  }
};

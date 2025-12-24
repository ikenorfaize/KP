// ===================================
// BEASISWA CONTROLLER
// ===================================

import { getCollection, addDocument, updateDocument, deleteDocument, findOne } from '../utils/database.js';
import { generateId, sanitizeHtml, successResponse, errorResponse, paginate } from '../utils/helpers.js';

/**
 * Helper to calculate beasiswa status based on dates
 */
const calculateBeasiswaStatus = (tanggal_mulai, deadline) => {
  try {
    const now = new Date();
    const startDate = new Date(tanggal_mulai);
    const endDate = new Date(deadline);
    if (isNaN(startDate) || isNaN(endDate)) return 'TBA';
    if (now < startDate) return 'Segera';
    if (now >= startDate && now <= endDate) return 'Buka';
    return 'Tutup';
  } catch (e) {
    return 'TBA';
  }
};

/**
 * Get all beasiswa
 */
export const getAllBeasiswa = (req, res) => {
  try {
    const beasiswa = getCollection('beasiswa').sort((a, b) => b.id - a.id);

    const { page, limit, status } = req.query;

    // Filter by status if provided (we'll compute status later)
    let filtered = beasiswa;
    if (status) {
      filtered = beasiswa.filter(b => b.status === status);
    }

    // Map to include computed status
    const mapped = filtered.map(b => ({
      ...b,
      status: calculateBeasiswaStatus(b.tanggal_mulai || b.tanggalMulai, b.deadline)
    }));

    if (page && limit) {
      const result = paginate(mapped, parseInt(page), parseInt(limit));
      return res.json(successResponse(result));
    }

    res.json(mapped);
  } catch (error) {
    console.error('❌ Get beasiswa error:', error);
    res.status(500).json(errorResponse('Failed to fetch beasiswa', error));
  }
};

/**
 * Get beasiswa by ID
 */
export const getBeasiswaById = (req, res) => {
  try {
    const { id } = req.params;
    const beasiswa = findOne('beasiswa', { id: parseInt(id) });
    
    if (!beasiswa) {
      return res.status(404).json(errorResponse('Beasiswa not found'));
    }

    const withStatus = {
      ...beasiswa,
      status: calculateBeasiswaStatus(beasiswa.tanggal_mulai || beasiswa.tanggalMulai, beasiswa.deadline)
    };

    res.json(withStatus);
  } catch (error) {
    console.error('❌ Get beasiswa by ID error:', error);
    res.status(500).json(errorResponse('Failed to fetch beasiswa', error));
  }
};

/**
 * Get beasiswa by kategori
 */
export const getBeasiswaByKategori = (req, res) => {
  try {
    const beasiswa = getCollection('beasiswa');
    const kategori = req.params.kategori;

    let filteredBeasiswa = beasiswa;

    // Filter by kategori (case insensitive), kecuali "Semua Program"
    if (kategori && kategori !== 'Semua Program') {
      filteredBeasiswa = filteredBeasiswa.filter(b => {
        const k = (b.kategori || b.category || '').toString().toLowerCase();
        return k === kategori.toLowerCase();
      });
    }

    const beasiswaWithStatus = filteredBeasiswa.map(b => ({
      ...b,
      status: calculateBeasiswaStatus(b.tanggal_mulai || b.tanggalMulai, b.deadline)
    }));

    res.json(beasiswaWithStatus);
  } catch (error) {
    console.error('❌ Get beasiswa by kategori error:', error);
    res.status(500).json(errorResponse('Failed to fetch beasiswa by kategori', error));
  }
};

/**
 * Create beasiswa
 */
export const createBeasiswa = (req, res) => {
  try {
    const {
      name,
      description,
      amount,
      deadline,
      tanggal_mulai,
      requirements,
      image,
      status,
      category
    } = req.body;
    
    if (!name || !description || !amount) {
      return res.status(400).json(errorResponse('Name, description, and amount are required'));
    }
    
    const newBeasiswa = addDocument('beasiswa', {
      judul: name.trim(),
      deskripsi: sanitizeHtml(description),
      nominal: parseInt(amount),
      deadline: deadline || null,
      tanggal_mulai: tanggal_mulai || null,
      persyaratan: requirements || [],
      image: image || '/uploads/images/placeholder-beasiswa.png',
      status: status || 'active',
      kategori: category || 'Umum',
      applicants: 0
    });
    
    console.log(`✅ Beasiswa created: ${newBeasiswa.judul}`);
    
    res.status(201).json(successResponse(newBeasiswa, 'Beasiswa created successfully'));
  } catch (error) {
    console.error('❌ Create beasiswa error:', error);
    res.status(500).json(errorResponse('Failed to create beasiswa', error));
  }
};

/**
 * Update beasiswa
 */
export const updateBeasiswa = (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      amount,
      deadline,
      tanggal_mulai,
      requirements,
      category,
      status
    } = req.body;
    
    // Build update object with Indonesian field names
    const updates = {};
    
    if (name !== undefined) updates.judul = name.trim();
    if (description !== undefined) updates.deskripsi = sanitizeHtml(description);
    if (amount !== undefined) updates.nominal = parseInt(amount);
    if (deadline !== undefined) updates.deadline = deadline;
    if (tanggal_mulai !== undefined) updates.tanggal_mulai = tanggal_mulai;
    if (requirements !== undefined) updates.persyaratan = requirements;
    if (category !== undefined) updates.kategori = category;
    if (status !== undefined) updates.status = status;
    
    const updatedBeasiswa = updateDocument('beasiswa', parseInt(id), updates);
    
    if (!updatedBeasiswa) {
      return res.status(404).json(errorResponse('Beasiswa not found'));
    }
    
    console.log(`✅ Beasiswa updated: ID ${id}`);
    
    res.json(successResponse(updatedBeasiswa, 'Beasiswa updated successfully'));
  } catch (error) {
    console.error('❌ Update beasiswa error:', error);
    res.status(500).json(errorResponse('Failed to update beasiswa', error));
  }
};

/**
 * Delete beasiswa
 */
export const deleteBeasiswa = (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = deleteDocument('beasiswa', parseInt(id));
    
    if (!deleted) {
      return res.status(404).json(errorResponse('Beasiswa not found'));
    }
    
    console.log(`✅ Beasiswa deleted: ID ${id}`);
    
    res.json(successResponse({ id }, 'Beasiswa deleted successfully'));
  } catch (error) {
    console.error('❌ Delete beasiswa error:', error);
    res.status(500).json(errorResponse('Failed to delete beasiswa', error));
  }
};

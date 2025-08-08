// ApplicationService.js - Shared service for fetching applications consistently
import { apiService } from './apiService';

const demoApplications = [
  {
    id: '1',
    fullName: 'Ahmad Fajar Rahman',
    email: 'fajar.demo@gmail.com',
    phone: '081234567890',
    position: 'Guru Matematika',
    address: 'Jl. Pendidikan No. 123, Jakarta',
    status: 'pending',
    submittedAt: '2025-01-27T08:30:00Z',
    processedAt: null,
    processedBy: null,
    rejectionReason: null,
    username: null
  },
  {
    id: '2',
    fullName: 'Siti Nurhaliza',
    email: 'siti.pending@gmail.com',
    phone: '081234567891',
    position: 'Guru Bahasa Indonesia',
    address: 'Jl. Bahasa No. 456, Bandung',
    status: 'pending',
    submittedAt: '2025-01-27T09:15:00Z',
    processedAt: null,
    processedBy: null,
    rejectionReason: null,
    username: null
  },
  {
    id: '3',
    fullName: 'Budi Santoso',
    email: 'budi.approved@gmail.com',
    phone: '081234567892',
    position: 'Guru Fisika',
    address: 'Jl. Fisika No. 789, Surabaya',
    status: 'approved',
    submittedAt: '2025-01-26T10:00:00Z',
    processedAt: '2025-01-26T15:30:00Z',
    processedBy: 'admin',
    rejectionReason: null,
    username: 'budi_santoso_123'
  },
  {
    id: '4',
    fullName: 'Maya Dewi',
    email: 'maya.rejected@gmail.com',
    phone: '081234567893',
    position: 'Guru Kimia',
    address: 'Jl. Kimia No. 321, Yogyakarta',
    status: 'rejected',
    submittedAt: '2025-01-25T11:00:00Z',
    processedAt: '2025-01-25T16:45:00Z',
    processedBy: 'admin',
    rejectionReason: 'Data ijazah tidak lengkap. Mohon upload ijazah yang jelas dan sertifikat mengajar.',
    username: null
  }
];

const normalizeList = (list) =>
  (Array.isArray(list) ? list : []).map(a => ({
    ...a,
    fullName: a.fullName || a.applicantName || '',
    submittedAt: a.submittedAt || a.submissionDate || a.createdAt || null,
  }));

export const ApplicationService = {
  async getApplications() {
    // If local mode is active (e.g., due to missing PATCH support), prefer local data
    const mode = typeof localStorage !== 'undefined' ? localStorage.getItem('applications_mode') : null;
    if (mode === 'local') {
      const local = localStorage.getItem('applications');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          return normalizeList(parsed);
        } catch {}
      }
    }
    try {
      await apiService.init();
      const resp = await fetch(`${apiService.API_URL}/applications`);
      if (resp.ok) {
        const data = await resp.json();
        return normalizeList(data);
      }
    } catch (e) {
      // ignore and fallback
    }
    // Fallback to localStorage persisted state first, then demo
    const local = localStorage.getItem('applications');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return normalizeList(parsed);
      } catch {}
    }
    return normalizeList(demoApplications);
  },

  async getPendingCount() {
    const apps = await this.getApplications();
    return apps.filter(a => a.status === 'pending').length;
  },

  async approveApplication(id, meta = {}) {
    try {
      await apiService.init();
      const resp = await fetch(`${apiService.API_URL}/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', ...meta })
      });
      if (resp.ok) {
        const { application } = await resp.json();
        // server write succeeded, prefer server again
        try {
          localStorage.removeItem('applications_mode');
          localStorage.removeItem('applications');
        } catch {}
        return application;
      }
    } catch (e) {
      // ignore and fallback
    }
    // Local fallback: update in localStorage
    const apps = await this.getApplications();
    const updated = apps.map(a => a.id === id ? { ...a, status: 'approved', processedAt: new Date().toISOString(), ...meta } : a);
    localStorage.setItem('applications', JSON.stringify(updated));
    localStorage.setItem('applications_mode', 'local');
    return updated.find(a => a.id === id);
  },

  async rejectApplication(id, reason) {
    try {
      await apiService.init();
      const resp = await fetch(`${apiService.API_URL}/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
      });
      if (resp.ok) {
        const { application } = await resp.json();
        // server write succeeded, prefer server again
        try {
          localStorage.removeItem('applications_mode');
          localStorage.removeItem('applications');
        } catch {}
        return application;
      }
    } catch (e) {
      // ignore and fallback
    }
    const apps = await this.getApplications();
    const updated = apps.map(a => a.id === id ? { ...a, status: 'rejected', processedAt: new Date().toISOString(), rejectionReason: reason } : a);
    localStorage.setItem('applications', JSON.stringify(updated));
    localStorage.setItem('applications_mode', 'local');
    return updated.find(a => a.id === id);
  },

  async deleteApplication(id) {
    try {
      await apiService.init();
      const resp = await fetch(`${apiService.API_URL}/applications/${id}`, {
        method: 'DELETE'
      });
      if (resp.status === 204) {
        try {
          localStorage.removeItem('applications_mode');
          localStorage.removeItem('applications');
        } catch {}
        return true;
      }
    } catch (e) {
      // ignore and fallback
    }
    const apps = await this.getApplications();
    const updated = apps.filter(a => a.id !== id);
    localStorage.setItem('applications', JSON.stringify(updated));
    localStorage.setItem('applications_mode', 'local');
    return true;
  },

  // Create a user account from an application using backend /auth/register
  async registerUserFromApplication(app, { username, password }) {
    await apiService.init();
    const payload = {
      fullName: app.fullName || app.applicantName || '',
      email: app.email,
      username,
      password, // backend hashes it
      position: app.position || '',
      address: app.address || '',
      phone: app.phone || ''
    };
    const api = apiService.API_URL;
    // Try a few username variants if conflict
    let attempt = 0;
    let maxAttempts = 3;
    let lastError;
    let baseUsername = username;
    while (attempt < maxAttempts) {
      const tryUsername = attempt === 0 ? baseUsername : `${baseUsername}_${Math.floor(Math.random()*1000)}`;
      const res = await fetch(`${api}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, username: tryUsername })
      });
      if (res.ok) {
        const data = await res.json();
        return { user: data.user, username: tryUsername };
      }
      // if conflict => try again, else break
      if (res.status === 409) {
        attempt++;
        lastError = new Error('Username or email already exists');
        continue;
      } else {
        try { lastError = new Error((await res.json()).error || res.statusText); } catch { lastError = new Error(res.statusText); }
        break;
      }
    }
    throw lastError || new Error('Registration failed');
  },

  // Orchestrate: create user then approve application; returns {application, user}
  async approveAndRegister(application, { username, password }) {
    try {
      const { user, username: finalUsername } = await this.registerUserFromApplication(application, { username, password });
      const updatedApp = await this.approveApplication(application.id, { username: finalUsername });
      return { application: updatedApp, user };
    } catch (e) {
      // Fallback: local-only (AdminDashboard server users list won't reflect this)
      const apps = await this.getApplications();
      const updated = apps.map(a => a.id === application.id ? { ...a, status: 'approved', processedAt: new Date().toISOString(), username } : a);
      localStorage.setItem('applications', JSON.stringify(updated));
      localStorage.setItem('applications_mode', 'local');
      // Also store a local users list so the UI could use it later if needed
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        localUsers.push({
          id: `local_${Date.now()}`,
          fullName: application.fullName,
          email: application.email,
          username,
          position: application.position || '',
          address: application.address || '',
          phone: application.phone || '',
          status: 'active',
          role: 'user',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(localUsers));
      } catch {}
      return { application: updated.find(a => a.id === application.id), user: null };
    }
  }
};

export default ApplicationService;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor to attach auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('fincheck_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Health
  getHealth: () => client.get('/api/health'),

  // Auth
  login: (data) => client.post('/api/auth/session', data),
  getMe: () => client.get('/api/auth/me'),

  // Dashboard
  getDashboardStats: (companyId = 'company_001') =>
    client.get('/api/dashboard/stats', { params: { companyId } }),

  // Documents
  getDocuments: (companyId = 'company_001') =>
    client.get('/api/documents', { params: { companyId } }),
  getDocument: (id) => client.get(`/api/documents/${id}`),
  uploadDocument: (formData, onUploadProgress) =>
    client.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  analyzeDocument: (id) => client.post(`/api/documents/${id}/analyze`),
  deleteDocument: (id, companyId = 'company_001') => client.delete(`/api/documents/${id}`, { params: { companyId } }),
  getDocumentFacts: (id) => client.get(`/api/documents/${id}/facts`),

  // Financial Facts
  getFacts: (params = {}) => client.get('/api/facts', { params }),
  getFactById: (id) => client.get(`/api/facts/${id}`),

  // Findings
  getFindings: (params = {}) => client.get('/api/findings', { params }),
  getFindingById: (id) => client.get(`/api/findings/${id}`),
  updateFinding: (id, data) => client.patch(`/api/findings/${id}`, data),
  addFindingComment: (id, data) => client.post(`/api/findings/${id}/comments`, data),

  // Evidence
  getAllEvidence: () => client.get('/api/evidence'),
  getEvidenceById: (id) => client.get(`/api/evidence/${id}`),

  // Analysis Pipeline
  runFullAnalysis: (data = {}) => client.post('/api/analysis/run', data),
  getAnalysisRun: (runId) => client.get(`/api/analysis/${runId}`),

  // AI Auditor Chat
  sendChatQuery: (data) => client.post('/api/chat', data),
  getChatHistory: (sessionId = 'default_session') =>
    client.get('/api/chat/history', { params: { sessionId } }),

  // Reports
  generateReport: (data) => client.post('/api/reports/generate', data),
  getReportById: (id) => client.get(`/api/reports/${id}`),
};

export default api;

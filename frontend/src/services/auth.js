import api from './api';

const DEFAULT_USER = {
  uid: 'usr_auditor_01',
  email: 'auditor@fincheck.ai',
  displayName: 'Alex Mercer, CPA',
  companyId: 'company_001',
  companyName: 'Acme Industries',
  role: 'Lead Audit Partner',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
};

export const authService = {
  getCurrentUser() {
    const raw = localStorage.getItem('fincheck_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  },

  async login(email, password) {
    try {
      const res = await api.login({ email, password });
      const { user, token } = res.data;
      localStorage.setItem('fincheck_user', JSON.stringify(user));
      localStorage.setItem('fincheck_token', token);
      return user;
    } catch (e) {
      // Local fallback for offline demo experience
      const user = {
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
        displayName: (email ? email.split('@')[0] : 'Lead Senior Auditor').replace('.', ' ')
      };
      localStorage.setItem('fincheck_user', JSON.stringify(user));
      localStorage.setItem('fincheck_token', 'local_demo_session_token');
      return user;
    }
  },

  logout() {
    localStorage.removeItem('fincheck_user');
    localStorage.removeItem('fincheck_token');
  },

  isAuthenticated() {
    return true; // Allows demo access, user can switch or logout
  }
};

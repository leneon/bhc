import api from './api';

export const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/auth/signin', {
        username,
        password,
      });
      
      const { accessToken, id, username: userName, email, roles } = response.data;
      
      const user = {
        id,
        username: userName,
        email,
        name: userName,
        token: accessToken,
        roles,
      };
      
      localStorage.setItem('atikoUser', JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion',
      };
    }
  },

  async register(username, email, password, additionalData = {}) {
    try {
      const response = await api.post('/auth/signup', {
        username,
        email,
        password,
        role: ['ROLE_USER'],
        ...additionalData,
      });
      
      if (response.data.message) {
        return { success: true, message: response.data.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'inscription',
      };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/api/user');
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, error: 'Impossible de récupérer l\'utilisateur' };
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', null, {
        params: { email },
      });
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la réinitialisation',
      };
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', null, {
        params: { token, newPassword },
      });
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la réinitialisation',
      };
    }
  },

  logout() {
    localStorage.removeItem('atikoUser');
  },

  isAuthenticated() {
    const user = localStorage.getItem('atikoUser');
    return !!user;
  },

  getStoredUser() {
    const user = localStorage.getItem('atikoUser');
    return user ? JSON.parse(user) : null;
  },
};

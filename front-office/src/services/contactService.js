import api from './api';

export const contactService = {
  async sendContactMessage(contactData) {
    try {
      const response = await api.post('/unauth/contact', contactData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Send contact message error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'envoi du message',
      };
    }
  },

  async subscribeNewsletter(email) {
    try {
      const response = await api.post('/unauth/newsletter', { email });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Subscribe newsletter error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'inscription',
      };
    }
  },

  async getStructureInfo() {
    try {
      const response = await api.get('/unauth/structure');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get structure info error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération',
      };
    }
  },
};

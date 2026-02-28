import api from './api';

export const voitureService = {
  async getAllVoitures() {
    try {
      const response = await api.get('/api/voitures');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get all voitures error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des voitures',
      };
    }
  },

  async getVoitureById(id) {
    try {
      const response = await api.get(`/api/voitures/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get voiture by id error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de la voiture',
      };
    }
  },

  async searchVoitures(searchTerm) {
    try {
      const response = await api.get(`/api/voitures/search/${searchTerm}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Search voitures error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche',
      };
    }
  },

  async getVoituresByModele(modeleId) {
    try {
      const response = await api.get(`/api/voitures/modele/${modeleId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get voitures by modele error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération',
      };
    }
  },

  transformVoitureForDisplay(voiture) {
    return {
      id: voiture.id,
      name: voiture.nom,
      image: voiture.image ? `http://localhost:8081${voiture.image}` : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500',
      price: voiture.prix || 0,
      category: voiture.modele?.marque?.nom || 'Standard',
      city: voiture.modele?.nom || 'Dakar',
      rating: 4.5,
      transmission: voiture.automatique ? 'Automatique' : 'Manuelle',
      seats: voiture.siege || 5,
      fuel: 'Essence',
      description: `${voiture.nom} - ${voiture.modele?.nom || ''}`,
      features: [
        voiture.climatisation && 'Climatisation',
        voiture.automatique && 'Boîte automatique',
        `${voiture.siege} places`,
        `${voiture.portiere} portes`,
      ].filter(Boolean),
      disponibilite: voiture.disponibilite,
      statut: voiture.statut,
      acompte: voiture.acompte,
      immatriculation: voiture.immatriculation,
      modeleId: voiture.modeleId,
      modeleName: voiture.modeleName,
    };
  },
};

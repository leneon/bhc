import api from './api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop';

const resolveImage = (img) => {
  if (!img) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(img)) return img;
  return `${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
};

const resolveGalleryImages = (voiture) => {
  const fromGallery = (voiture.images || [])
    .map((imgObj) => imgObj?.url || imgObj?.image || imgObj?.path || imgObj?.nom || imgObj)
    .filter(Boolean)
    .map(resolveImage);
  const mainImage = resolveImage(voiture.image);
  return Array.from(new Set([mainImage, ...fromGallery]));
};

export const voitureService = {
  async getAllVoitures() {
    try {
      const response = await api.get('/api/voitures');
            console.log('Get all voitures response:', response.data);

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
      image: resolveImage(voiture.image),
      images: resolveGalleryImages(voiture),
      price: voiture.prix || 0,
      category: voiture.modele?.marque?.nom || voiture.modeleName || 'Standard',
      city: voiture.modele?.nom || voiture.modeleName || 'Dakar',
      rating: 4.5,
      transmission: voiture.automatique ? 'Automatique' : 'Manuelle',
      seats: voiture.siege || 5,
      fuel: 'Essence',
      description: `${voiture.nom || ''} - ${voiture.modele?.nom || voiture.modeleName || ''}`,
      features: [
        voiture.climatisation && 'Climatisation',
        voiture.automatique && 'Boîte automatique',
        voiture.siege ? `${voiture.siege} places` : null,
        voiture.portiere ? `${voiture.portiere} portes` : null,
      ].filter(Boolean),
      disponibilite: voiture.disponibilite,
      statut: voiture.statut,
      acompte: voiture.acompte,
      immatriculation: voiture.immatriculation,
      modeleId: voiture.modeleId,
      modeleName: voiture.modeleName || voiture.modele?.nom,
    };
  },
};

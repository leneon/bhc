import api from './api';

export const reservationService = {
  async createReservation(reservationData) {
    try {
      const response = await api.post('/api/reservations', reservationData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Create reservation error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la création de la réservation',
      };
    }
  },

  async updateReservation(id, reservationData) {
    try {
      const response = await api.put(`/api/reservations/${id}`, reservationData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update reservation error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la mise à jour',
      };
    }
  },

  async getReservation(id) {
    try {
      const response = await api.get(`/api/reservations/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get reservation error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération',
      };
    }
  },

  async getAllReservations(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.clientId) params.append('clientId', filters.clientId);
      if (filters.vehiculeId) params.append('vehiculeId', filters.vehiculeId);
      if (filters.etat) params.append('etat', filters.etat);

      const response = await api.get('/api/reservations', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get all reservations error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération',
      };
    }
  },

  async getReservationsByClient(clientId) {
    try {
      const response = await api.get('/api/reservations', {
        params: { clientId },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get reservations by client error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération',
      };
    }
  },

  async checkAvailability(vehiculeId, dateDebut, dateFin) {
    try {
      const response = await api.get('/api/reservations/check-availability', {
        params: {
          vehiculeId,
          dateDebut: dateDebut.toISOString(),
          dateFin: dateFin.toISOString(),
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Check availability error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la vérification',
      };
    }
  },

  async deleteReservation(id) {
    try {
      await api.delete(`/api/reservations/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Delete reservation error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la suppression',
      };
    }
  },

  transformReservationForDisplay(reservation) {
    return {
      id: reservation.reservationId,
      type: 'Voiture',
      date: reservation.dateReservation,
      status: reservation.etatReservation || 'Confirmé',
      totalPrice: Number(reservation.montantTotal) || 0,
      details: {
        carName: reservation.voitureNom,
        city: reservation.lieuDepart,
        startDate: new Date(reservation.dateDebutPrevue).toLocaleDateString('fr-FR'),
        endDate: new Date(reservation.dateFinPrevue).toLocaleDateString('fr-FR'),
        days: reservation.nombreJours || this.calculateDays(reservation.dateDebutPrevue, reservation.dateFinPrevue),
        immatriculation: reservation.voitureImmatriculation,
        modePaiement: reservation.modePaiement,
        acompte: Number(reservation.acompte) || 0,
      },
    };
  },

  calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  },
};

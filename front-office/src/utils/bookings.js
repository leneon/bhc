import { reservationService } from '@/services/reservationService';
import { getCurrentUser } from './auth';

export const saveBooking = async (booking) => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const reservationData = {
    clientId: user.id,
    vehiculeId: booking.vehicleId || booking.details?.vehicleId,
    dateDebutPrevue: booking.startDate || booking.details?.startDate,
    dateFinPrevue: booking.endDate || booking.details?.endDate,
    lieuDepart: booking.details?.city || 'Dakar',
    lieuRetour: booking.details?.city || 'Dakar',
    etatReservation: 'EN_ATTENTE',
    modePaiement: booking.paymentMethod || 'CARTE',
    montantTotal: booking.totalPrice,
    acompte: booking.details?.acompte || 0,
    notes: booking.notes || '',
  };

  const result = await reservationService.createReservation(reservationData);
  
  if (result.success) {
    return reservationService.transformReservationForDisplay(result.data);
  } else {
    throw new Error(result.error);
  }
};

export const getBookings = async () => {
  const user = getCurrentUser();
  if (!user) {
    return [];
  }

  const result = await reservationService.getReservationsByClient(user.id);
  
  if (result.success) {
    return result.data.map(r => reservationService.transformReservationForDisplay(r));
  }
  
  return [];
};

export const getBookingById = async (id) => {
  const result = await reservationService.getReservation(id);
  
  if (result.success) {
    return reservationService.transformReservationForDisplay(result.data);
  }
  
  return null;
};

export const cancelBooking = async (id) => {
  const result = await reservationService.updateReservation(id, {
    etatReservation: 'ANNULE',
  });
  
  if (!result.success) {
    throw new Error(result.error);
  }
};
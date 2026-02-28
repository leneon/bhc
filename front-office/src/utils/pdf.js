import jsPDF from 'jspdf';

export const generateTicketPDF = (booking) => {
  const doc = new jsPDF();
  
  doc.setFillColor(56, 189, 248);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text('ATIKO', 20, 25);
  
  doc.setFontSize(12);
  doc.text('Votre partenaire de voyage', 20, 32);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text('Ticket de Réservation', 20, 55);
  
  doc.setFontSize(11);
  let y = 75;
  
  doc.setFont(undefined, 'bold');
  doc.text('Numéro de réservation:', 20, y);
  doc.setFont(undefined, 'normal');
  doc.text(`#${booking.id}`, 90, y);
  
  y += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Type:', 20, y);
  doc.setFont(undefined, 'normal');
  doc.text(booking.type || 'Réservation', 90, y);
  
  y += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Date de réservation:', 20, y);
  doc.setFont(undefined, 'normal');
  doc.text(new Date(booking.date).toLocaleDateString('fr-FR'), 90, y);
  
  y += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Statut:', 20, y);
  doc.setFont(undefined, 'normal');
  doc.text(booking.status, 90, y);
  
  y += 15;
  doc.setDrawColor(56, 189, 248);
  doc.line(20, y, 190, y);
  y += 10;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Détails de la réservation', 20, y);
  
  y += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  if (booking.type === 'Voiture') {
    doc.text(`Véhicule: ${booking.details.carName}`, 20, y);
    y += 8;
    doc.text(`Ville: ${booking.details.city}`, 20, y);
    y += 8;
    doc.text(`Du: ${booking.details.startDate}`, 20, y);
    y += 8;
    doc.text(`Au: ${booking.details.endDate}`, 20, y);
  } else if (booking.type === 'Bus') {
    doc.text(`Compagnie: ${booking.details.company}`, 20, y);
    y += 8;
    doc.text(`De: ${booking.details.from} à ${booking.details.to}`, 20, y);
    y += 8;
    doc.text(`Départ: ${booking.details.departure}`, 20, y);
    y += 8;
    doc.text(`Siège: ${booking.details.seat || 'Non spécifié'}`, 20, y);
  } else if (booking.type === 'Avion') {
    doc.text(`Compagnie: ${booking.details.airline}`, 20, y);
    y += 8;
    doc.text(`Vol: ${booking.details.from} → ${booking.details.to}`, 20, y);
    y += 8;
    doc.text(`Départ: ${booking.details.departure}`, 20, y);
    y += 8;
    doc.text(`Classe: ${booking.details.class}`, 20, y);
  }
  
  y += 15;
  doc.setDrawColor(56, 189, 248);
  doc.line(20, y, 190, y);
  y += 10;
  
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(56, 189, 248);
  doc.text(`Total: ${booking.totalPrice?.toLocaleString('fr-FR')} FCFA`, 20, y);
  
  y += 20;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Merci d\'avoir choisi Atiko pour votre voyage!', 20, y);
  y += 6;
  doc.text('Pour toute question, contactez-nous: contact@atiko.sn | +221 33 123 45 67', 20, y);
  
  doc.save(`atiko-ticket-${booking.id}.pdf`);
};
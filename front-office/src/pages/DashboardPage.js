import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, Bus, Plane, Download, Calendar, CreditCard, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUser, logout } from '@/utils/auth';
import { getBookings, cancelBooking } from '@/utils/bookings';
import { generateTicketPDF } from '@/utils/pdf';

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [bookings, setBookings] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('bookings');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const bookingsData = await getBookings();
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDownloadTicket = (booking) => {
    generateTicketPDF(booking);
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await cancelBooking(id);
        await loadBookings();
      } catch (error) {
        console.error('Error canceling booking:', error);
        alert('Erreur lors de l\'annulation de la réservation');
      }
    }
  };

  const getBookingIcon = (type) => {
    switch(type) {
      case 'Voiture': return <Car className="h-5 w-5" />;
      case 'Bus': return <Bus className="h-5 w-5" />;
      case 'Avion': return <Plane className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8" data-testid="dashboard-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Work Sans' }}>
                Bonjour, {user?.name || 'Voyageur'} !
              </h1>
              <p className="text-gray-600">Gérez vos réservations et votre profil</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
              data-testid="logout-btn"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6" data-testid="stat-total">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total réservations</p>
                <p className="text-3xl font-bold text-gray-800">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#38BDF8]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6" data-testid="stat-active">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Réservations actives</p>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'Confirmé').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6" data-testid="stat-cancelled">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Réservations annulées</p>
                <p className="text-3xl font-bold text-red-600">
                  {bookings.filter(b => b.status === 'Annulé').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="bookings" data-testid="bookings-tab">Mes réservations</TabsTrigger>
              <TabsTrigger value="profile" data-testid="profile-tab">Mon profil</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#38BDF8] mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des réservations...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-20" data-testid="no-bookings">
                    <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucune réservation</h3>
                    <p className="text-gray-500 mb-6">Commencez votre aventure maintenant !</p>
                    <Button 
                      onClick={() => navigate('/')}
                      className="bg-[#38BDF8] hover:bg-[#0EA5E9]"
                      data-testid="discover-offers-btn"
                    >
                      Découvrir nos offres
                    </Button>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-xl p-6 hover-lift" data-testid={`booking-${booking.id}`}>
                      <div className="grid md:grid-cols-12 gap-4 items-center">
                        {/* Icon & Type */}
                        <div className="md:col-span-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center text-[#38BDF8]">
                              {getBookingIcon(booking.type)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800">{booking.type}</div>
                              <div className="text-xs text-gray-500">#{booking.id}</div>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="md:col-span-5">
                          {booking.type === 'Voiture' && (
                            <div className="space-y-1 text-sm">
                              <div className="font-medium text-gray-800">{booking.details.carName}</div>
                              <div className="text-gray-600">{booking.details.city}</div>
                              <div className="text-gray-500">
                                {booking.details.startDate} → {booking.details.endDate}
                              </div>
                            </div>
                          )}
                          {booking.type === 'Bus' && (
                            <div className="space-y-1 text-sm">
                              <div className="font-medium text-gray-800">{booking.details.company}</div>
                              <div className="text-gray-600">
                                {booking.details.from} → {booking.details.to}
                              </div>
                              <div className="text-gray-500">Départ: {booking.details.departure}</div>
                            </div>
                          )}
                          {booking.type === 'Avion' && (
                            <div className="space-y-1 text-sm">
                              <div className="font-medium text-gray-800">{booking.details.airline}</div>
                              <div className="text-gray-600">
                                {booking.details.fromCity} → {booking.details.toCity}
                              </div>
                              <div className="text-gray-500">Classe {booking.details.class}</div>
                            </div>
                          )}
                        </div>

                        {/* Date & Status */}
                        <div className="md:col-span-2 text-center">
                          <div className="text-sm text-gray-600 mb-1">
                            {new Date(booking.date).toLocaleDateString('fr-FR')}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'Confirmé' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        {/* Price & Actions */}
                        <div className="md:col-span-3 text-right space-y-2">
                          <div className="text-2xl font-bold text-[#38BDF8]">
                            {booking.totalPrice?.toLocaleString()} FCFA
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button 
                              onClick={() => handleDownloadTicket(booking)}
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                              data-testid={`download-ticket-${booking.id}-btn`}
                            >
                              <Download className="h-4 w-4" />
                              PDF
                            </Button>
                            {booking.status === 'Confirmé' && (
                              <Button 
                                onClick={() => handleCancelBooking(booking.id)}
                                size="sm"
                                variant="destructive"
                                data-testid={`cancel-booking-${booking.id}-btn`}
                              >
                                Annuler
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <div className="max-w-2xl" data-testid="profile-section">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations personnelles</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Nom</label>
                      <input 
                        type="text" 
                        value={user?.name || ''} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                      <input 
                        type="email" 
                        value={user?.email || ''} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Téléphone</label>
                    <input 
                      type="tel" 
                      placeholder="+221 77 123 45 67" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Adresse</label>
                    <input 
                      type="text" 
                      placeholder="Votre adresse" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <Button className="bg-[#38BDF8] hover:bg-[#0EA5E9]" data-testid="save-profile-btn">
                    Enregistrer les modifications
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
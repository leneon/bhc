import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Car,
  Bus,
  Plane,
  Download,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Search,
  Filter,
  Save,
  Mail,
  Phone,
  Home,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getCurrentUser, logout } from '@/utils/auth';
import { getBookings, cancelBooking } from '@/utils/bookings';
import { generateTicketPDF } from '@/utils/pdf';
import { toast } from 'sonner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [bookings, setBookings] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('bookings');
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cancelTarget, setCancelTarget] = React.useState(null);
  const [profileForm, setProfileForm] = React.useState({
    phone: '',
    address: '',
  });
  const [savingProfile, setSavingProfile] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/dashboard' } });
      return;
    }
    loadBookings();
  }, [user?.id]);

  React.useEffect(() => {
    if (location.state?.bookingId) {
      toast.success(`Réservation #${location.state.bookingId} ajoutée à votre espace`);
    }
  }, [location.state]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const bookingsData = await getBookings();
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('À bientôt !');
    navigate('/');
  };

  const handleDownloadTicket = (booking) => {
    try {
      generateTicketPDF(booking);
      toast.success('Billet téléchargé');
    } catch (e) {
      toast.error("Erreur lors du téléchargement du billet");
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelBooking(cancelTarget.id);
      toast.success('Réservation annulée');
      await loadBookings();
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    } finally {
      setCancelTarget(null);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      toast.success('Profil mis à jour');
    }, 600);
  };

  const getBookingIcon = (type) => {
    switch (type) {
      case 'Voiture':
        return Car;
      case 'Bus':
        return Bus;
      case 'Avion':
        return Plane;
      default:
        return Calendar;
    }
  };

  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (typeFilter !== 'all' && b.type !== typeFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const haystack = JSON.stringify(b).toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, typeFilter, searchTerm]);

  const totalBookings = bookings.length;
  const activeCount = bookings.filter((b) => b.status === 'Confirmé').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Annulé').length;

  const getInitials = (name, email) => {
    const source = (name || email || 'U').trim();
    const parts = source.split(/\s+/);
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return source.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div
          className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] rounded-2xl shadow-lg p-5 sm:p-7 md:p-8 mb-6 text-white"
          data-testid="dashboard-header"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl sm:text-2xl font-bold backdrop-blur">
                {getInitials(user?.name, user?.email)}
              </div>
              <div>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: 'Work Sans' }}
                >
                  Bonjour, {user?.name || 'Voyageur'}
                </h1>
                <p className="text-white/90 text-sm sm:text-base">
                  Gérez vos réservations et votre profil
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur self-start md:self-auto"
              data-testid="logout-btn"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6">
          <StatCard
            label="Total réservations"
            value={totalBookings}
            icon={Calendar}
            gradient="from-sky-400 to-sky-500"
            testId="stat-total"
          />
          <StatCard
            label="Réservations actives"
            value={activeCount}
            icon={CreditCard}
            gradient="from-green-400 to-green-500"
            testId="stat-active"
          />
          <StatCard
            label="Réservations annulées"
            value={cancelledCount}
            icon={XCircle}
            gradient="from-red-400 to-red-500"
            testId="stat-cancelled"
          />
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-5">
              <TabsTrigger value="bookings" data-testid="bookings-tab">
                Mes réservations
              </TabsTrigger>
              <TabsTrigger value="profile" data-testid="profile-tab">
                Mon profil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              {/* Filters */}
              {!loading && bookings.length > 0 && (
                <div className="flex flex-col lg:flex-row gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une réservation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-10"
                      data-testid="booking-search"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-10 w-full sm:w-[160px]" data-testid="type-filter">
                        <div className="flex items-center gap-1.5">
                          <Filter className="h-3.5 w-3.5" />
                          <SelectValue placeholder="Type" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="Voiture">Voiture</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Avion">Avion</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-10 w-full sm:w-[160px]" data-testid="status-filter">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="Confirmé">Confirmé</SelectItem>
                        <SelectItem value="Annulé">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {loading ? (
                  Array(3)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        className="border rounded-xl p-5 space-y-3 border-gray-100"
                      >
                        <div className="h-5 skeleton w-1/3" />
                        <div className="h-4 skeleton w-1/2" />
                        <div className="h-4 skeleton w-1/4" />
                      </div>
                    ))
                ) : bookings.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="Aucune réservation pour le moment"
                    description="Commencez votre aventure et réservez votre premier voyage avec Atiko."
                    cta={
                      <Button
                        onClick={() => navigate('/')}
                        className="bg-[#38BDF8] hover:bg-[#0EA5E9]"
                        data-testid="discover-offers-btn"
                      >
                        Découvrir nos offres
                      </Button>
                    }
                    testId="no-bookings"
                  />
                ) : filteredBookings.length === 0 ? (
                  <EmptyState
                    icon={Search}
                    title="Aucun résultat"
                    description="Aucune réservation ne correspond à vos filtres."
                    cta={
                      <Button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setTypeFilter('all');
                        }}
                        variant="outline"
                      >
                        Réinitialiser les filtres
                      </Button>
                    }
                  />
                ) : (
                  filteredBookings.map((booking) => {
                    const Icon = getBookingIcon(booking.type);
                    const isConfirmed = booking.status === 'Confirmé';
                    return (
                      <article
                        key={booking.id}
                        className="border rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow border-gray-100 bg-white"
                        data-testid={`booking-${booking.id}`}
                      >
                        <div className="grid md:grid-cols-12 gap-4 items-start md:items-center">
                          <div className="md:col-span-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                  isConfirmed ? 'bg-sky-50 text-[#0EA5E9]' : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-gray-800">{booking.type}</div>
                                <div className="text-xs text-gray-500">#{booking.id}</div>
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-4 text-sm space-y-1">
                            {booking.type === 'Voiture' && (
                              <>
                                <div className="font-medium text-gray-800 truncate">
                                  {booking.details.carName}
                                </div>
                                <div className="text-gray-600">{booking.details.city}</div>
                                <div className="text-gray-500 text-xs">
                                  {booking.details.startDate} → {booking.details.endDate}
                                </div>
                              </>
                            )}
                            {booking.type === 'Bus' && (
                              <>
                                <div className="font-medium text-gray-800 truncate">
                                  {booking.details.company}
                                </div>
                                <div className="text-gray-600">
                                  {booking.details.from} → {booking.details.to}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Départ : {booking.details.departure}
                                </div>
                              </>
                            )}
                            {booking.type === 'Avion' && (
                              <>
                                <div className="font-medium text-gray-800 truncate">
                                  {booking.details.airline}
                                </div>
                                <div className="text-gray-600">
                                  {booking.details.fromCity} → {booking.details.toCity}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Classe {booking.details.class}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="md:col-span-2 flex md:flex-col items-center md:items-center gap-2 md:gap-1">
                            <div className="text-xs text-gray-500">
                              {new Date(booking.date).toLocaleDateString('fr-FR')}
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                                isConfirmed
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {isConfirmed ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {booking.status}
                            </span>
                          </div>

                          <div className="md:col-span-3 md:text-right">
                            <div className="text-xl sm:text-2xl font-bold text-[#0EA5E9] mb-2">
                              {booking.totalPrice?.toLocaleString()} FCFA
                            </div>
                            <div className="flex flex-wrap md:justify-end gap-2">
                              <Button
                                onClick={() => handleDownloadTicket(booking)}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                                data-testid={`download-ticket-${booking.id}-btn`}
                              >
                                <Download className="h-3.5 w-3.5" />
                                Billet
                              </Button>
                              {isConfirmed && (
                                <Button
                                  onClick={() => setCancelTarget(booking)}
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
                      </article>
                    );
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <div className="max-w-2xl" data-testid="profile-section">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
                  Informations personnelles
                </h2>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <User className="h-3.5 w-3.5 mr-1.5" />
                        Nom
                      </Label>
                      <Input
                        type="text"
                        value={user?.name || ''}
                        className="h-11 bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-3.5 w-3.5 mr-1.5" />
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={user?.email || ''}
                        className="h-11 bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-3.5 w-3.5 mr-1.5" />
                      Téléphone
                    </Label>
                    <Input
                      type="tel"
                      placeholder="+221 77 123 45 67"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Home className="h-3.5 w-3.5 mr-1.5" />
                      Adresse
                    </Label>
                    <Input
                      type="text"
                      placeholder="Votre adresse"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#38BDF8] hover:bg-[#0EA5E9]"
                    data-testid="save-profile-btn"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. Vous ne pourrez plus récupérer cette réservation
              {cancelTarget?.id ? ` (#${cancelTarget.id})` : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, gradient, testId }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow"
      data-testid={testId}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, cta, testId }) {
  return (
    <div className="text-center py-12 md:py-16" data-testid={testId}>
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {cta}
    </div>
  );
}

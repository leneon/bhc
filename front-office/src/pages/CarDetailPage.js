import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Car,
  Users,
  Fuel,
  Settings,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Shield,
  Sparkles,
  ArrowLeft,
  Info,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Breadcrumbs from '@/components/Breadcrumbs';
import { voitureService } from '@/services/voitureService';
import { reservationService } from '@/services/reservationService';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'sonner';

const today = () => new Date().toISOString().split('T')[0];
const addDays = (d, n) => {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date.toISOString().split('T')[0];
};

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [startDate, setStartDate] = React.useState(today());
  const [endDate, setEndDate] = React.useState(addDays(today(), 1));
  const [checkingAvailability, setCheckingAvailability] = React.useState(false);
  const [availability, setAvailability] = React.useState(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  React.useEffect(() => {
    loadCarDetails();
  }, [id]);

  React.useEffect(() => {
    if (startDate && endDate && car) {
      checkAvailability();
    }
  }, [startDate, endDate]);

  const loadCarDetails = async () => {
    setLoading(true);
    try {
      const result = await voitureService.getVoitureById(id);
      if (result.success) {
        const mappedCar = voitureService.transformVoitureForDisplay(result.data);
        setCar(mappedCar);
        setCurrentImageIndex(0);
      } else {
        toast.error(result.error || 'Véhicule non trouvé');
        navigate('/cars');
      }
    } catch (error) {
      console.error('Error loading car details:', error);
      toast.error('Erreur de connexion au serveur');
      navigate('/cars');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!car || !startDate || !endDate) return;
    setCheckingAvailability(true);
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const result = await reservationService.checkAvailability(car.id, start, end);
      if (result.success) {
        setAvailability(result.data.available);
        if (!result.data.available) {
          toast.warning("Ce véhicule n'est pas disponible pour ces dates");
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-5 w-48 skeleton mb-6" />
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-80 sm:h-96 skeleton rounded-2xl" />
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 border border-gray-100">
                <div className="h-8 skeleton w-2/3" />
                <div className="h-4 skeleton w-1/3" />
                <div className="grid grid-cols-4 gap-3">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="h-20 skeleton rounded-lg" />
                    ))}
                </div>
                <div className="h-4 skeleton" />
                <div className="h-4 skeleton w-3/4" />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-4">
              <div className="h-96 skeleton rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) return null;
  const galleryImages = car.images?.length ? car.images : [car.image];
  const currentImage = galleryImages[currentImageIndex] || car.image;
  const goPrevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  const goNextImage = () =>
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));

  const days =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
        )
      : 0;
  const subTotal = car.price * days;
  const deposit = car.acompte || 0;
  const total = subTotal;

  const handleBooking = () => {
    if (!isAuthenticated()) {
      toast.info('Connectez-vous pour réserver ce véhicule');
      navigate('/auth', { state: { from: `/cars/${id}` } });
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Veuillez sélectionner les dates de location');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      toast.error('La date de fin doit être après la date de début');
      return;
    }

    navigate('/checkout', {
      state: {
        type: 'Voiture',
        vehicleId: car.id,
        details: {
          carName: car.name,
          city: car.city,
          startDate,
          endDate,
          days,
          vehicleId: car.id,
          acompte: deposit,
        },
        totalPrice: total,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
    });
  };

  const features = car.features?.length
    ? car.features
    : ['Climatisation', 'Direction assistée', 'ABS', 'Airbags'];

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <Breadcrumbs
          items={[
            { label: 'Location de voitures', to: '/cars' },
            { label: car.name },
          ]}
        />

        <Button
          onClick={() => navigate('/cars')}
          variant="ghost"
          className="mb-4 sm:mb-6 -ml-3 text-gray-600 hover:text-gray-900"
          data-testid="back-to-cars-btn"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux véhicules
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative group"
              data-testid="car-image-gallery"
            >
              <img
                src={currentImage}
                alt={car.name}
                className="w-full h-[52vh] min-h-[340px] sm:h-[60vh] object-cover"
              />
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/65 transition-colors"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/65 transition-colors"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setFullscreenOpen(true)}
                className="absolute top-4 right-4 bg-black/45 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow hover:bg-black/65 transition-colors flex items-center gap-1.5"
                aria-label="Ouvrir l'image en plein écran"
              >
                <Expand className="h-3.5 w-3.5" />
                Plein écran
              </button>
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-white/95 backdrop-blur text-[#0EA5E9] text-sm font-semibold px-3 py-1.5 rounded-full shadow">
                  {car.category}
                </span>
                <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Disponible
                </span>
              </div>
            </div>
            {galleryImages.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    type="button"
                    key={`${img}-${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? 'border-[#0EA5E9] shadow-md'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    aria-label={`Afficher image ${idx + 1}`}
                  >
                    <img src={img} alt={`${car.name} ${idx + 1}`} className="w-24 h-16 object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Info */}
            <div
              className="bg-white rounded-2xl shadow-sm p-5 sm:p-7 md:p-8 border border-gray-100"
              data-testid="car-details-section"
            >
              <div className="flex items-start justify-between gap-4 mb-5 md:mb-6 flex-wrap">
                <div className="min-w-0">
                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 truncate"
                    style={{ fontFamily: 'Work Sans' }}
                  >
                    {car.name}
                  </h1>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-[#0EA5E9]" />
                    {car.city}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-bold text-gray-800 ml-1.5">
                      {car.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({car.reviews || 0} avis)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                  { icon: Settings, label: 'Transmission', value: car.transmission },
                  { icon: Users, label: 'Places', value: car.seats },
                  { icon: Fuel, label: 'Carburant', value: car.fuel },
                  { icon: Car, label: 'Catégorie', value: car.category },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-sky-50 rounded-xl border border-slate-100"
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#0EA5E9] mb-2" />
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="font-bold text-gray-800 text-sm sm:text-base text-center">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Le {car.name} est parfait pour vos déplacements. Véhicule bien entretenu,
                  confortable et fiable. Idéal pour les trajets en ville comme pour les longues
                  distances. Assurance tous risques incluse.
                </p>

                <h3 className="text-lg font-bold text-gray-800 mb-3">Équipements inclus</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs sm:text-sm px-3 py-1.5 rounded-full">
                    <Shield className="h-4 w-4" />
                    Assurance incluse
                  </div>
                  <div className="flex items-center gap-2 bg-sky-50 text-sky-700 text-xs sm:text-sm px-3 py-1.5 rounded-full">
                    <Sparkles className="h-4 w-4" />
                    Désinfecté avant livraison
                  </div>
                  <div className="flex items-center gap-2 bg-orange-50 text-orange-700 text-xs sm:text-sm px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="h-4 w-4" />
                    Annulation gratuite 24h
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-20 border border-gray-100"
              data-testid="booking-card"
            >
              <div className="text-center mb-5 pb-5 border-b">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-[#0EA5E9]">
                    {car.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 font-medium">FCFA</span>
                </div>
                <span className="text-gray-500 text-sm block mt-1">par jour</span>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-[#0EA5E9]" />
                    Date de début
                  </Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (!endDate || endDate <= e.target.value) {
                        setEndDate(addDays(e.target.value, 1));
                      }
                    }}
                    min={today()}
                    className="h-11"
                    data-testid="start-date-input"
                  />
                </div>

                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-[#0EA5E9]" />
                    Date de fin
                  </Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || today()}
                    className="h-11"
                    data-testid="end-date-input"
                  />
                </div>

                {startDate && endDate && (
                  <div
                    className="bg-gradient-to-br from-sky-50 to-slate-50 p-4 rounded-xl border border-sky-100"
                    data-testid="price-summary"
                  >
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-600">
                        {car.price.toLocaleString()} × {days} jour{days > 1 ? 's' : ''}
                      </span>
                      <span className="font-medium">{subTotal.toLocaleString()} FCFA</span>
                    </div>
                    {deposit > 0 && (
                      <div className="flex justify-between mb-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          Acompte demandé
                        </span>
                        <span>{deposit.toLocaleString()} FCFA</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-[#0EA5E9] pt-3 border-t border-sky-200">
                      <span>Total</span>
                      <span>{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                )}

                {availability === false && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>Non disponible pour ces dates. Essayez une autre période.</p>
                  </div>
                )}
                {availability === true && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>Disponible pour ces dates</p>
                  </div>
                )}

                <Button
                  onClick={handleBooking}
                  disabled={!startDate || !endDate || checkingAvailability || availability === false}
                  className="w-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] h-12 text-base font-semibold shadow-md disabled:opacity-60"
                  data-testid="book-now-btn"
                >
                  {checkingAvailability ? 'Vérification...' : 'Réserver maintenant'}
                </Button>

                <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" />
                  Annulation gratuite jusqu'à 24h avant la prise en charge
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie en plein écran"
        >
          <button
            type="button"
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
            aria-label="Fermer le plein écran"
          >
            <X className="h-5 w-5" />
          </button>
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={goNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={currentImage}
            alt={car.name}
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
}

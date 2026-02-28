import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, Users, Fuel, Settings, Star, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { voitureService } from '@/services/voitureService';
import { reservationService } from '@/services/reservationService';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'sonner';

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [checkingAvailability, setCheckingAvailability] = React.useState(false);

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
        const transformedCar = voitureService.transformVoitureForDisplay(result.data);
        setCar(transformedCar);
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
      
      if (result.success && !result.data.available) {
        toast.warning('Ce véhicule n\'est pas disponible pour ces dates');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#38BDF8] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Véhicule non trouvé</h2>
          <Button onClick={() => navigate('/cars')} className="mt-4">Retour</Button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!isAuthenticated()) {
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

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = car.price * days;

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
          acompte: car.acompte || 0,
        },
        totalPrice,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button 
          onClick={() => navigate('/cars')} 
          variant="outline" 
          className="mb-6"
          data-testid="back-to-cars-btn"
        >
          ← Retour
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-testid="car-image-gallery">
              <img src={car.image} alt={car.name} className="w-full h-96 object-cover" />
            </div>

            {/* Car Info */}
            <div className="bg-white rounded-xl shadow-lg p-8" data-testid="car-details-section">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Work Sans' }}>
                    {car.name}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {car.city}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-bold text-gray-800 ml-2">{car.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({car.reviews} avis)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                  <Settings className="h-6 w-6 text-[#38BDF8] mb-2" />
                  <span className="text-sm text-gray-600">Transmission</span>
                  <span className="font-bold text-gray-800">{car.transmission}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                  <Users className="h-6 w-6 text-[#38BDF8] mb-2" />
                  <span className="text-sm text-gray-600">Places</span>
                  <span className="font-bold text-gray-800">{car.seats}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                  <Fuel className="h-6 w-6 text-[#38BDF8] mb-2" />
                  <span className="text-sm text-gray-600">Carburant</span>
                  <span className="font-bold text-gray-800">{car.fuel}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                  <Car className="h-6 w-6 text-[#38BDF8] mb-2" />
                  <span className="text-sm text-gray-600">Catégorie</span>
                  <span className="font-bold text-gray-800">{car.category}</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  Ce {car.name} est parfait pour vos déplacements. Véhicule bien entretenu, confortable et fiable. 
                  Idéal pour les trajets en ville comme pour les longues distances. Assurance tous risques incluse.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4" data-testid="booking-card">
              <div className="text-center mb-6 pb-6 border-b">
                <span className="text-5xl font-bold text-[#38BDF8]">{car.price.toLocaleString()}</span>
                <span className="text-gray-600 block mt-2">FCFA / jour</span>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date de début
                  </Label>
                  <Input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    data-testid="start-date-input"
                  />
                </div>

                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date de fin
                  </Label>
                  <Input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    data-testid="end-date-input"
                  />
                </div>

                {startDate && endDate && (
                  <div className="bg-slate-50 p-4 rounded-lg" data-testid="price-summary">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-bold">
                        {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} jours
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-[#38BDF8] pt-2 border-t">
                      <span>Total</span>
                      <span>
                        {(car.price * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  disabled={!startDate || !endDate || checkingAvailability}
                  className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] h-12 text-lg font-semibold"
                  data-testid="book-now-btn"
                >
                  {checkingAvailability ? 'Vérification...' : 'Réserver maintenant'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Annulation gratuite jusqu'à 24h avant la prise en charge
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import {
  Car,
  Bus,
  Plane,
  Shield,
  Clock,
  Headphones,
  Search,
  MapPin,
  ArrowRight,
  Users,
  Fuel,
  Settings,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { voitureService } from '@/services/voitureService';
import { cities, airports } from '@/utils/mockData';

const today = () => new Date().toISOString().split('T')[0];
const addDays = (d, n) => {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date.toISOString().split('T')[0];
};

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('car');
  const [popularCars, setPopularCars] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [carSearch, setCarSearch] = React.useState({
    city: '',
    category: '',
    start: today(),
    end: addDays(today(), 1),
  });
  const [busSearch, setBusSearch] = React.useState({
    from: '',
    to: '',
    date: today(),
  });
  const [flightSearch, setFlightSearch] = React.useState({
    from: '',
    to: '',
    depart: today(),
    returnDate: '',
  });

  React.useEffect(() => {
    loadPopularCars();
  }, []);

  const loadPopularCars = async () => {
    try {
      const result = await voitureService.getAllVoitures();
      if (result.success) {
        const transformedCars = result.data
          .map((v) => voitureService.transformVoitureForDisplay(v))
          .slice(0, 3);
        setPopularCars(transformedCars);
      }
    } catch (error) {
      console.error('Error loading popular cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildQuery = (obj) => {
    const params = new URLSearchParams();
    Object.entries(obj).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  const handleSearch = (type) => {
    if (type === 'car') {
      navigate(`/cars${buildQuery(carSearch)}`);
    } else if (type === 'bus') {
      navigate(`/bus${buildQuery(busSearch)}`);
    } else if (type === 'flight') {
      navigate(`/flights${buildQuery(flightSearch)}`);
    }
  };

  const trustBadges = [
    { label: 'Paiement 100% sécurisé', icon: Shield },
    { label: 'Annulation gratuite 24h', icon: CheckCircle2 },
    { label: 'Support 24/7', icon: Headphones },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[560px] md:h-[640px] flex items-center justify-center overflow-hidden py-10 md:py-0">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/70 via-sky-800/55 to-orange-700/40" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 md:mb-8 animate-fade-in">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/95 text-xs md:text-sm font-medium mb-4 border border-white/20">
              N°1 du transport au Sénégal
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 md:mb-4 px-2 drop-shadow-sm"
              style={{ fontFamily: 'Work Sans' }}
            >
              Voyagez avec Atiko
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 px-4 max-w-2xl mx-auto">
              Réservez une voiture, un bus ou un vol en quelques secondes.
            </p>
          </div>

          <div
            className="glass-dark rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl max-w-4xl mx-auto"
            data-testid="search-box"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6 bg-white/60 h-auto p-1">
                <TabsTrigger
                  value="car"
                  className="flex items-center gap-2 text-xs sm:text-sm py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  data-testid="tab-car"
                >
                  <Car className="h-4 w-4" />
                  <span>Voiture</span>
                </TabsTrigger>
                <TabsTrigger
                  value="bus"
                  className="flex items-center gap-2 text-xs sm:text-sm py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  data-testid="tab-bus"
                >
                  <Bus className="h-4 w-4" />
                  Bus
                </TabsTrigger>
                <TabsTrigger
                  value="flight"
                  className="flex items-center gap-2 text-xs sm:text-sm py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  data-testid="tab-flight"
                >
                  <Plane className="h-4 w-4" />
                  Avion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="car" className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Ville
                    </Label>
                    <Input
                      list="home-cities"
                      placeholder="Ex : Dakar"
                      value={carSearch.city}
                      onChange={(e) =>
                        setCarSearch({ ...carSearch, city: e.target.value })
                      }
                      className="mt-1 h-11"
                      data-testid="car-city-input"
                    />
                    <datalist id="home-cities">
                      {cities.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5" /> Type de véhicule
                    </Label>
                    <Input
                      list="home-categories"
                      placeholder="Berline, SUV, Luxe..."
                      value={carSearch.category}
                      onChange={(e) =>
                        setCarSearch({ ...carSearch, category: e.target.value })
                      }
                      className="mt-1 h-11"
                      data-testid="car-type-input"
                    />
                    <datalist id="home-categories">
                      <option value="Berline" />
                      <option value="SUV" />
                      <option value="Économique" />
                      <option value="Luxe" />
                    </datalist>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Date de début</Label>
                    <Input
                      type="date"
                      min={today()}
                      value={carSearch.start}
                      onChange={(e) => {
                        const next = { ...carSearch, start: e.target.value };
                        if (!next.end || next.end <= e.target.value) {
                          next.end = addDays(e.target.value, 1);
                        }
                        setCarSearch(next);
                      }}
                      className="mt-1 h-11"
                      data-testid="car-start-date"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Date de fin</Label>
                    <Input
                      type="date"
                      min={carSearch.start || today()}
                      value={carSearch.end}
                      onChange={(e) => setCarSearch({ ...carSearch, end: e.target.value })}
                      className="mt-1 h-11"
                      data-testid="car-end-date"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSearch('car')}
                  className="w-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] text-white h-12 text-base md:text-lg font-semibold shadow-lg"
                  data-testid="search-car-btn"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Rechercher des voitures
                </Button>
              </TabsContent>

              <TabsContent value="bus" className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Ville de départ</Label>
                    <Input
                      list="home-cities"
                      placeholder="Dakar"
                      value={busSearch.from}
                      onChange={(e) => setBusSearch({ ...busSearch, from: e.target.value })}
                      className="mt-1 h-11"
                      data-testid="bus-from-input"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Ville d'arrivée</Label>
                    <Input
                      list="home-cities"
                      placeholder="Thiès"
                      value={busSearch.to}
                      onChange={(e) => setBusSearch({ ...busSearch, to: e.target.value })}
                      className="mt-1 h-11"
                      data-testid="bus-to-input"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium text-sm">Date de voyage</Label>
                  <Input
                    type="date"
                    min={today()}
                    value={busSearch.date}
                    onChange={(e) => setBusSearch({ ...busSearch, date: e.target.value })}
                    className="mt-1 h-11"
                    data-testid="bus-date-input"
                  />
                </div>
                <Button
                  onClick={() => handleSearch('bus')}
                  className="w-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] text-white h-12 text-base md:text-lg font-semibold shadow-lg"
                  data-testid="search-bus-btn"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Rechercher des bus
                </Button>
              </TabsContent>

              <TabsContent value="flight" className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Aéroport de départ</Label>
                    <Input
                      list="home-airports"
                      placeholder="DSS - Dakar"
                      value={flightSearch.from}
                      onChange={(e) =>
                        setFlightSearch({ ...flightSearch, from: e.target.value })
                      }
                      className="mt-1 h-11"
                      data-testid="flight-from-input"
                    />
                    <datalist id="home-airports">
                      {airports.map((a) => (
                        <option key={a.code} value={`${a.code} - ${a.city}`} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Aéroport d'arrivée</Label>
                    <Input
                      list="home-airports"
                      placeholder="CDG - Paris"
                      value={flightSearch.to}
                      onChange={(e) =>
                        setFlightSearch({ ...flightSearch, to: e.target.value })
                      }
                      className="mt-1 h-11"
                      data-testid="flight-to-input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Date de départ</Label>
                    <Input
                      type="date"
                      min={today()}
                      value={flightSearch.depart}
                      onChange={(e) =>
                        setFlightSearch({ ...flightSearch, depart: e.target.value })
                      }
                      className="mt-1 h-11"
                      data-testid="flight-depart-date"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Date de retour</Label>
                    <Input
                      type="date"
                      min={flightSearch.depart || today()}
                      value={flightSearch.returnDate}
                      onChange={(e) =>
                        setFlightSearch({ ...flightSearch, returnDate: e.target.value })
                      }
                      className="mt-1 h-11"
                      data-testid="flight-return-date"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSearch('flight')}
                  className="w-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] text-white h-12 text-base md:text-lg font-semibold shadow-lg"
                  data-testid="search-flight-btn"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Rechercher des vols
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-6 text-white/95 text-xs sm:text-sm">
            {trustBadges.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-[#FDE68A]" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: 'Work Sans' }}
            >
              Pourquoi choisir Atiko ?
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Une expérience pensée pour simplifier vos voyages
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover-lift text-center"
              data-testid="feature-payment"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#6EE7B7] to-[#34D399] rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md">
                <Shield className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">
                Paiement sécurisé
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Transactions 100% sécurisées avec Stripe et Mobile Money
              </p>
            </div>
            <div
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover-lift text-center"
              data-testid="feature-speed"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FDBA74] to-[#FB923C] rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md">
                <Clock className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">
                Réservation rapide
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Réservez en quelques clics seulement, où que vous soyez.
              </p>
            </div>
            <div
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover-lift text-center sm:col-span-2 md:col-span-1"
              data-testid="feature-support"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md">
                <Headphones className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">
                Support 24/7
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Une équipe disponible à tout moment pour vous aider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
            <div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800"
                style={{ fontFamily: 'Work Sans' }}
              >
                Véhicules populaires
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Les véhicules les plus plébiscités par nos utilisateurs
              </p>
            </div>
            <Button
              onClick={() => navigate('/cars')}
              variant="outline"
              className="border-[#38BDF8] text-[#0EA5E9] hover:bg-[#38BDF8] hover:text-white w-full sm:w-auto"
              data-testid="view-all-cars-btn"
            >
              Voir tout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="w-full h-44 sm:h-48 skeleton rounded-none"></div>
                    <div className="p-4 sm:p-5 md:p-6 space-y-3">
                      <div className="h-6 skeleton"></div>
                      <div className="h-4 skeleton w-2/3"></div>
                      <div className="h-8 skeleton"></div>
                      <div className="h-10 skeleton"></div>
                    </div>
                  </div>
                ))
            ) : popularCars.length > 0 ? (
              popularCars.map((car) => (
                <article
                  key={car.id}
                  onClick={() => navigate(`/cars/${car.id}`)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift car-card card-clickable group"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigate(`/cars/${car.id}`);
                  }}
                  data-testid={`popular-car-${car.id}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 text-xs sm:text-sm bg-white/95 backdrop-blur text-[#0EA5E9] px-3 py-1 rounded-full font-semibold shadow">
                      {car.category}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                        {car.name}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium text-gray-700">{car.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {car.city}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Settings className="h-3.5 w-3.5" />
                        {car.transmission}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {car.seats}
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5" />
                        {car.fuel}
                      </span>
                    </div>
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#0EA5E9]">
                          {car.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">FCFA/jour</span>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/cars/${car.id}`);
                      }}
                      className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] h-10"
                      data-testid={`book-car-${car.id}-btn`}
                    >
                      Réserver
                    </Button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-sm">
                <Car className="h-14 w-14 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucun véhicule disponible pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: 'Work Sans' }}
            >
              Destinations populaires
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Découvrez les destinations les plus demandées
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              {
                name: 'Dakar',
                image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500',
              },
              {
                name: 'Saint-Louis',
                image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=500',
              },
              {
                name: 'Thiès',
                image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=500',
              },
              {
                name: 'Saly',
                image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500',
              },
            ].map((dest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(`/cars?city=${encodeURIComponent(dest.name)}`)}
                className="relative h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden hover-lift cursor-pointer group text-left focus:outline-none focus:ring-4 focus:ring-[#38BDF8]/40"
                data-testid={`destination-${idx}`}
                aria-label={`Voir les véhicules à ${dest.name}`}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5 md:p-6">
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                    {dest.name}
                  </h3>
                  <span className="text-white/80 text-xs md:text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorer <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: 'Work Sans' }}
            >
              Ils nous font confiance
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              +5000 voyageurs ont choisi Atiko cette année
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                name: 'Fatou Diop',
                role: 'Cliente à Dakar',
                text: "Service excellent ! J'ai réservé une voiture en quelques minutes, tout s'est passé sans accroc.",
                rating: 5,
              },
              {
                name: 'Moussa Sall',
                role: 'Voyageur régulier',
                text: "Très pratique pour mes voyages d'affaires. Le support est réactif, je recommande !",
                rating: 5,
              },
              {
                name: 'Awa Ndiaye',
                role: 'Étudiante',
                text: 'Prix compétitifs et plateforme intuitive. Je réserve mes bus uniquement sur Atiko maintenant.',
                rating: 5,
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                data-testid={`testimonial-${idx}`}
              >
                <div className="flex mb-3 md:mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm sm:text-base mb-4 italic leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-white font-semibold text-sm">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm sm:text-base">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

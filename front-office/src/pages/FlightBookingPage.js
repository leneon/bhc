import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plane,
  Search,
  Calendar,
  ArrowUpDown,
  ArrowRight,
  RefreshCw,
  MapPin,
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
import Breadcrumbs from '@/components/Breadcrumbs';
import { mockFlights, airports } from '@/utils/mockData';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'sonner';

const today = () => new Date().toISOString().split('T')[0];

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommandé' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'departure', label: 'Départ le plus tôt' },
];

export default function FlightBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tripType, setTripType] = React.useState('one-way');
  const [search, setSearch] = React.useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    departDate: searchParams.get('depart') || today(),
    returnDate: searchParams.get('returnDate') || '',
  });
  const [sortBy, setSortBy] = React.useState('recommended');
  const [classFilter, setClassFilter] = React.useState('all');

  const filteredFlights = React.useMemo(() => {
    let result = mockFlights.filter((flight) => {
      if (
        search.from &&
        !`${flight.from} ${flight.fromCity}`.toLowerCase().includes(search.from.toLowerCase())
      )
        return false;
      if (
        search.to &&
        !`${flight.to} ${flight.toCity}`.toLowerCase().includes(search.to.toLowerCase())
      )
        return false;
      if (classFilter !== 'all' && flight.class !== classFilter) return false;
      return true;
    });

    switch (sortBy) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'departure':
        result = [...result].sort(
          (a, b) =>
            Number(a.departure.replace(':', '')) - Number(b.departure.replace(':', ''))
        );
        break;
      default:
        break;
    }
    return result;
  }, [search, sortBy, classFilter]);

  const classes = [...new Set(mockFlights.map((f) => f.class))];

  const handleBooking = (flight) => {
    if (!isAuthenticated()) {
      toast.info('Connectez-vous pour réserver');
      navigate('/auth', { state: { from: '/flights' } });
      return;
    }
    navigate('/checkout', {
      state: {
        type: 'Avion',
        details: {
          airline: flight.airline,
          from: flight.from,
          to: flight.to,
          fromCity: flight.fromCity,
          toCity: flight.toCity,
          departure: flight.departure,
          arrival: flight.arrival,
          duration: flight.duration,
          stops: flight.stops,
          class: flight.class,
          date: search.departDate || today(),
        },
        totalPrice: flight.price,
      },
    });
  };

  const resetSearch = () => {
    setSearch({ from: '', to: '', departDate: today(), returnDate: '' });
    setClassFilter('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <Breadcrumbs items={[{ label: 'Réservation de vols' }]} />

        <div className="mb-5 md:mb-7">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800"
            style={{ fontFamily: 'Work Sans' }}
            data-testid="flight-booking-title"
          >
            Réservation de vols
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Envolez-vous vers vos destinations préférées
          </p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 mb-6"
          data-testid="flight-search-form"
        >
          <Tabs value={tripType} onValueChange={setTripType} className="mb-5">
            <TabsList className="p-1">
              <TabsTrigger value="one-way" className="px-4" data-testid="one-way-tab">
                Aller simple
              </TabsTrigger>
              <TabsTrigger value="round-trip" className="px-4" data-testid="round-trip-tab">
                Aller-retour
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div>
              <Label className="text-gray-700 font-medium mb-1.5 block text-sm flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Départ
              </Label>
              <Input
                list="airports-list"
                placeholder="DSS - Dakar"
                value={search.from}
                onChange={(e) => setSearch({ ...search, from: e.target.value })}
                className="h-11"
                data-testid="flight-from-input"
              />
              <datalist id="airports-list">
                {airports.map((a) => (
                  <option key={a.code} value={`${a.code} - ${a.city}`} />
                ))}
              </datalist>
            </div>
            <div>
              <Label className="text-gray-700 font-medium mb-1.5 block text-sm flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Arrivée
              </Label>
              <Input
                list="airports-list"
                placeholder="CDG - Paris"
                value={search.to}
                onChange={(e) => setSearch({ ...search, to: e.target.value })}
                className="h-11"
                data-testid="flight-to-input"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium mb-1.5 block text-sm flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Départ
              </Label>
              <Input
                type="date"
                min={today()}
                value={search.departDate}
                onChange={(e) => setSearch({ ...search, departDate: e.target.value })}
                className="h-11"
                data-testid="flight-depart-date"
              />
            </div>
            {tripType === 'round-trip' ? (
              <div>
                <Label className="text-gray-700 font-medium mb-1.5 block text-sm flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Retour
                </Label>
                <Input
                  type="date"
                  min={search.departDate || today()}
                  value={search.returnDate}
                  onChange={(e) => setSearch({ ...search, returnDate: e.target.value })}
                  className="h-11"
                  data-testid="flight-return-date"
                />
              </div>
            ) : (
              <div>
                <Label className="text-gray-700 font-medium mb-1.5 block text-sm">Classe</Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="h-11" data-testid="flight-class-filter">
                    <SelectValue placeholder="Toutes classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes classes</SelectItem>
                    {classes.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button
            onClick={() => toast.success(`${filteredFlights.length} vols trouvés`)}
            className="w-full mt-5 bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] h-12 text-base font-semibold shadow-md"
            data-testid="search-flights-btn"
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher des vols
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <p className="text-gray-600 text-sm sm:text-base" data-testid="flight-results-count">
            <span className="font-semibold text-gray-800">{filteredFlights.length}</span> vol
            {filteredFlights.length > 1 ? 's' : ''} disponible
            {filteredFlights.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400 hidden sm:block" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-full sm:w-[200px]" data-testid="sort-flights">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 hover-lift border border-gray-100"
              data-testid={`flight-card-${flight.id}`}
            >
              <div className="grid md:grid-cols-12 gap-5 md:gap-6 items-center">
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl flex items-center justify-center">
                      <Plane className="h-6 w-6 text-[#0EA5E9]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{flight.airline}</h3>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">
                        {flight.departure}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{flight.from}</div>
                      <div className="text-xs text-gray-500">{flight.fromCity}</div>
                    </div>
                    <div className="flex-1 px-3 sm:px-4">
                      <div className="border-t-2 border-dashed border-gray-300 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                          <Plane className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {flight.duration}
                      </div>
                      <div
                        className={`text-xs text-center ${
                          flight.stops === 'Direct' ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        {flight.stops}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">
                        {flight.arrival}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{flight.to}</div>
                      <div className="text-xs text-gray-500">{flight.toCity}</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 md:text-center">
                  <div className="text-xs text-gray-500 mb-1">Classe</div>
                  <div
                    className={`inline-block font-bold text-sm px-2 py-0.5 rounded-full ${
                      flight.class === 'Business'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {flight.class}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {flight.seats} sièges restants
                  </div>
                </div>

                <div className="md:col-span-3 md:text-right">
                  <div className="mb-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#0EA5E9]">
                      {flight.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 block text-xs sm:text-sm">FCFA</span>
                  </div>
                  <Button
                    onClick={() => handleBooking(flight)}
                    className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9]"
                    data-testid={`book-flight-${flight.id}-btn`}
                  >
                    Réserver
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredFlights.length === 0 && (
            <div
              className="text-center py-16 bg-white rounded-2xl border border-gray-100"
              data-testid="no-flight-results"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Plane className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun vol trouvé</h3>
              <p className="text-gray-500 mb-5 max-w-md mx-auto">
                Essayez de modifier les dates ou la destination.
              </p>
              <Button
                onClick={resetSearch}
                variant="outline"
                className="border-[#38BDF8] text-[#0EA5E9] hover:bg-[#38BDF8] hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

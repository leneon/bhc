import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Bus,
  Clock,
  Users,
  Wifi,
  Search,
  ArrowUpDown,
  Calendar,
  MapPin,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Breadcrumbs from '@/components/Breadcrumbs';
import { mockBuses, cities } from '@/utils/mockData';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'sonner';

const today = () => new Date().toISOString().split('T')[0];

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommandé' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'departure', label: 'Départ le plus tôt' },
  { value: 'duration', label: 'Trajet le plus court' },
];

const toMinutes = (d) => {
  if (!d) return 0;
  const [h, m] = d.replace(/[^\d]/g, ' ').trim().split(/\s+/).map(Number);
  return (h || 0) * 60 + (m || 0);
};

export default function BusBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = React.useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || today(),
  });
  const [sortBy, setSortBy] = React.useState('recommended');

  const filteredBuses = React.useMemo(() => {
    let result = mockBuses.filter((bus) => {
      if (search.from && !bus.from.toLowerCase().includes(search.from.toLowerCase()))
        return false;
      if (search.to && !bus.to.toLowerCase().includes(search.to.toLowerCase())) return false;
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
      case 'duration':
        result = [...result].sort((a, b) => toMinutes(a.duration) - toMinutes(b.duration));
        break;
      default:
        break;
    }
    return result;
  }, [search, sortBy]);

  const handleBooking = (bus) => {
    if (!isAuthenticated()) {
      toast.info('Connectez-vous pour réserver');
      navigate('/auth', { state: { from: '/bus' } });
      return;
    }
    navigate('/checkout', {
      state: {
        type: 'Bus',
        details: {
          company: bus.company,
          from: bus.from,
          to: bus.to,
          departure: bus.departure,
          arrival: bus.arrival,
          duration: bus.duration,
          seat: 'Non sélectionné',
          date: search.date || today(),
        },
        totalPrice: bus.price,
      },
    });
  };

  const resetSearch = () =>
    setSearch({ from: '', to: '', date: today() });

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <Breadcrumbs items={[{ label: 'Réservation de bus' }]} />

        <div className="mb-5 md:mb-7">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800"
            style={{ fontFamily: 'Work Sans' }}
            data-testid="bus-booking-title"
          >
            Réservation de bus
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Voyagez à travers le Sénégal en toute sérénité
          </p>
        </div>

        {/* Search */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 mb-6"
          data-testid="bus-search-form"
        >
          <div className="grid md:grid-cols-4 gap-3 md:gap-4">
            <div>
              <Label className="text-gray-700 font-medium mb-1.5 block text-sm flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Départ
              </Label>
              <Input
                list="bus-cities"
                placeholder="Dakar"
                value={search.from}
                onChange={(e) => setSearch({ ...search, from: e.target.value })}
                className="h-11"
                data-testid="bus-from-input"
              />
              <datalist id="bus-cities">
                {cities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <Label className="text-gray-700 font-medium mb-1.5 block text-sm flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Arrivée
              </Label>
              <Input
                list="bus-cities"
                placeholder="Thiès"
                value={search.to}
                onChange={(e) => setSearch({ ...search, to: e.target.value })}
                className="h-11"
                data-testid="bus-to-input"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium mb-1.5 block text-sm flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Date
              </Label>
              <Input
                type="date"
                min={today()}
                value={search.date}
                onChange={(e) => setSearch({ ...search, date: e.target.value })}
                className="h-11"
                data-testid="bus-date-input"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => toast.success(`${filteredBuses.length} trajets trouvés`)}
                className="w-full h-11 bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] shadow-md"
                data-testid="search-bus-btn"
              >
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <p className="text-gray-600 text-sm sm:text-base" data-testid="bus-results-count">
            <span className="font-semibold text-gray-800">{filteredBuses.length}</span> bus
            disponible{filteredBuses.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400 hidden sm:block" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-full sm:w-[200px]" data-testid="sort-buses">
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
          {filteredBuses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 hover-lift border border-gray-100"
              data-testid={`bus-card-${bus.id}`}
            >
              <div className="grid md:grid-cols-12 gap-5 md:gap-6 items-center">
                <div className="md:col-span-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl flex items-center justify-center">
                      <Bus className="h-6 w-6 text-[#0EA5E9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{bus.company}</h3>
                      <span
                        className={`text-xs font-medium inline-block px-2 py-0.5 rounded-full ${
                          bus.type === 'VIP'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {bus.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">
                        {bus.departure}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{bus.from}</div>
                    </div>
                    <div className="flex-1 px-3 sm:px-4">
                      <div className="border-t-2 border-dashed border-gray-300 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {bus.duration}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gray-800">
                        {bus.arrival}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{bus.to}</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {bus.availableSeats} sièges libres
                    </div>
                    {bus.amenities.includes('WiFi') && (
                      <div className="flex items-center gap-1.5">
                        <Wifi className="h-4 w-4" />
                        WiFi inclus
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3 md:text-right">
                  <div className="mb-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#0EA5E9]">
                      {bus.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm ml-1.5">FCFA</span>
                  </div>
                  <Button
                    onClick={() => handleBooking(bus)}
                    className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9]"
                    data-testid={`book-bus-${bus.id}-btn`}
                  >
                    Réserver
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex flex-wrap gap-2">
                {bus.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-50 text-gray-700 text-xs rounded-full border border-slate-100"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredBuses.length === 0 && (
            <div
              className="text-center py-16 bg-white rounded-2xl border border-gray-100"
              data-testid="no-bus-results"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Bus className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun bus trouvé</h3>
              <p className="text-gray-500 mb-5 max-w-md mx-auto">
                Modifiez vos critères de recherche ou essayez une autre destination.
              </p>
              <Button
                onClick={resetSearch}
                variant="outline"
                className="border-[#38BDF8] text-[#0EA5E9] hover:bg-[#38BDF8] hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser la recherche
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

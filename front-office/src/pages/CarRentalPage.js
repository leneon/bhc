import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Car,
  Users,
  Fuel,
  Settings,
  Search,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  ArrowUpDown,
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
import { Slider } from '@/components/ui/slider';
import Breadcrumbs from '@/components/Breadcrumbs';
import { voitureService } from '@/services/voitureService';
import { toast } from 'sonner';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommandé' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rating_desc', label: 'Mieux notés' },
  { value: 'name_asc', label: 'Nom (A-Z)' },
];

const DEFAULT_FILTERS = {
  city: 'all',
  category: 'all',
  priceRange: [20000, 150000],
};

export default function CarRentalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = React.useState(() => ({
    ...DEFAULT_FILTERS,
    city: searchParams.get('city') || 'all',
    category: searchParams.get('category') || 'all',
  }));
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('recommended');
  const [cars, setCars] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  React.useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const result = await voitureService.getAllVoitures();
      if (result.success) {
        const transformedCars = (result.data || [])
          .filter((v) => v.statut !== false)
          .map((v) => voitureService.transformVoitureForDisplay(v));
        setCars(transformedCars);
      } else {
        toast.error(result.error || 'Erreur lors du chargement des véhicules');
        setCars([]);
      }
    } catch (error) {
      console.error('Error loading cars:', error);
      toast.error('Erreur de connexion au serveur');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = React.useMemo(() => {
    let result = cars.filter((car) => {
      if (filters.city !== 'all' && car.city !== filters.city) return false;
      if (filters.category !== 'all' && car.category !== filters.category) return false;
      if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const hay = `${car.name} ${car.category} ${car.city}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });

    switch (sortBy) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name_asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return result;
  }, [cars, filters, sortBy, searchTerm]);

  const cities = React.useMemo(() => [...new Set(cars.map((c) => c.city))], [cars]);
  const categories = React.useMemo(() => [...new Set(cars.map((c) => c.category))], [cars]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
    setSortBy('recommended');
  };

  const activeFilterCount =
    (filters.city !== 'all' ? 1 : 0) +
    (filters.category !== 'all' ? 1 : 0) +
    (filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
    filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]
      ? 1
      : 0) +
    (searchTerm ? 1 : 0);

  const Filters = () => (
    <>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Filtres</h2>
        {activeFilterCount > 0 && (
          <span className="text-xs bg-[#0EA5E9] text-white px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-700 font-medium mb-2 block text-sm">Ville</Label>
          <Select
            value={filters.city}
            onValueChange={(value) => setFilters({ ...filters, city: value })}
          >
            <SelectTrigger data-testid="city-filter" className="h-10 text-sm">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-700 font-medium mb-2 block text-sm">Catégorie</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
          >
            <SelectTrigger data-testid="category-filter" className="h-10 text-sm">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-700 font-medium mb-3 block text-sm">Prix (FCFA/jour)</Label>
          <div className="px-1">
            <Slider
              min={20000}
              max={150000}
              step={5000}
              value={filters.priceRange}
              onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
              className="mb-3"
              data-testid="price-range-slider"
            />
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span className="font-medium bg-gray-100 px-2 py-1 rounded">
                {filters.priceRange[0].toLocaleString()}
              </span>
              <span className="text-gray-400">—</span>
              <span className="font-medium bg-gray-100 px-2 py-1 rounded">
                {filters.priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={resetFilters}
          variant="outline"
          className="w-full h-10 text-sm"
          data-testid="reset-filters-btn"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <Breadcrumbs items={[{ label: 'Location de voitures' }]} />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800"
              style={{ fontFamily: 'Work Sans' }}
              data-testid="car-rental-title"
            >
              Location de voitures
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Trouvez le véhicule parfait pour votre prochain voyage
            </p>
          </div>
        </div>

        {/* Search + Sort bar */}
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 mb-5 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un véhicule, une marque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 border-gray-200"
                data-testid="search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="lg:hidden h-11"
                onClick={() => setMobileFiltersOpen(true)}
                data-testid="open-filters-btn"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-[#0EA5E9] text-white text-xs rounded-full px-1.5">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger
                    className="h-11 w-full sm:w-[180px]"
                    data-testid="sort-select"
                  >
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
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {/* Filters Sidebar (desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div
              className="bg-white rounded-xl shadow-sm p-5 md:p-6 lg:sticky lg:top-20 border border-gray-100"
              data-testid="filters-sidebar"
            >
              <Filters />
            </div>
          </aside>

          {/* Mobile filters drawer */}
          {mobileFiltersOpen && (
            <div
              className="fixed inset-0 z-50 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filtres"
            >
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Filtres</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <Filters />
                <Button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full mt-5 bg-[#38BDF8] hover:bg-[#0EA5E9] h-11"
                >
                  Voir {filteredCars.length} résultat{filteredCars.length > 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          )}

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 sm:mb-5 flex items-center justify-between">
              <p className="text-gray-600 text-sm sm:text-base" data-testid="results-count">
                {loading
                  ? 'Recherche en cours...'
                  : `${filteredCars.length} véhicule${
                      filteredCars.length > 1 ? 's' : ''
                    } disponible${filteredCars.length > 1 ? 's' : ''}`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {Array(4)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                    >
                      <div className="w-full h-48 skeleton rounded-none" />
                      <div className="p-5 space-y-3">
                        <div className="h-6 skeleton w-2/3" />
                        <div className="h-4 skeleton w-1/3" />
                        <div className="h-4 skeleton" />
                        <div className="h-10 skeleton" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {filteredCars.map((car) => (
                  <article
                    key={car.id}
                    onClick={() => navigate(`/cars/${car.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') navigate(`/cars/${car.id}`);
                    }}
                    tabIndex={0}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover-lift car-card card-clickable group border border-gray-100"
                    data-testid={`car-card-${car.id}`}
                  >
                    <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow">
                        <span className="text-xs sm:text-sm font-bold text-[#0EA5E9]">
                          {car.category}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Disponible
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate pr-2">
                          {car.name}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">{car.rating}</span>
                        </div>
                      </div>

                      <p className="text-gray-500 mb-4 flex items-center text-sm">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        {car.city}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mb-4 text-xs sm:text-sm">
                        <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
                          <Settings className="h-4 w-4 text-[#0EA5E9] mb-1" />
                          <span className="text-gray-600 text-[11px] sm:text-xs truncate w-full text-center">
                            {car.transmission}
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
                          <Users className="h-4 w-4 text-[#0EA5E9] mb-1" />
                          <span className="text-gray-600 text-[11px] sm:text-xs">
                            {car.seats} places
                          </span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
                          <Fuel className="h-4 w-4 text-[#0EA5E9] mb-1" />
                          <span className="text-gray-600 text-[11px] sm:text-xs truncate w-full text-center">
                            {car.fuel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between border-t pt-4 gap-3">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-bold text-[#0EA5E9]">
                              {car.price.toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm">FCFA/j</span>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/cars/${car.id}`);
                          }}
                          className="bg-[#38BDF8] hover:bg-[#0EA5E9] h-10 px-5"
                          data-testid={`view-car-${car.id}-btn`}
                        >
                          Détails
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading && filteredCars.length === 0 && (
              <div
                className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
                data-testid="no-results"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Car className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Aucun véhicule ne correspond à votre recherche
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Essayez d'élargir vos critères de recherche ou réinitialisez les filtres.
                </p>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="border-[#38BDF8] text-[#0EA5E9] hover:bg-[#38BDF8] hover:text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

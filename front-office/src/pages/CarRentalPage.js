import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Users, Fuel, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { voitureService } from '@/services/voitureService';
import { toast } from 'sonner';

export default function CarRentalPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState({
    city: '',
    category: '',
    priceRange: [20000, 150000]
  });
  const [cars, setCars] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const result = await voitureService.getAllVoitures();
      
      console.log('🚗 [CarRentalPage] Chargement des véhicules');
      console.log('✅ Success:', result.success);
      console.log('📊 Total véhicules reçus:', result.data?.length || 0);
      
      if (result.success && result.data) {
        console.log('📋 Données brutes:', result.data);
        
        // Afficher chaque véhicule et son statut
        result.data.forEach((v, index) => {
          console.log(`Véhicule ${index + 1}:`, {
            id: v.id,
            nom: v.nom,
            statut: v.statut,
            disponibilite: v.disponibilite,
            'Passe le filtre?': v.statut && v.disponibilite === 'disponible'
          });
        });
        
        const filtered = result.data.filter(v => v.statut && v.disponibilite === 'disponible');
        console.log('✔️ Véhicules après filtre:', filtered.length);
        
        const transformedCars = filtered.map(v => voitureService.transformVoitureForDisplay(v));
        console.log('🎨 Véhicules transformés:', transformedCars);
        
        setCars(transformedCars);
      } else {
        console.error('❌ Erreur API:', result.error);
        toast.error(result.error || 'Erreur lors du chargement des voitures');
        setCars([]);
      }
    } catch (error) {
      console.error('💥 Error loading cars:', error);
      toast.error('Erreur de connexion au serveur');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter(car => {
    if (filters.city && car.city !== filters.city) return false;
    if (filters.category && car.category !== filters.category) return false;
    if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false;
    return true;
  });

  const cities = [...new Set(cars.map(car => car.city))];
  const categories = [...new Set(cars.map(car => car.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#38BDF8] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des véhicules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8" style={{ fontFamily: 'Work Sans' }} data-testid="car-rental-title">
          Location de voitures
        </h1>

        <div className="grid lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 lg:sticky lg:top-4" data-testid="filters-sidebar">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800">Filtres</h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block text-sm">Ville</Label>
                  <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
                    <SelectTrigger data-testid="city-filter" className="h-10 text-sm">
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block text-sm">Catégorie</Label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                    <SelectTrigger data-testid="category-filter" className="h-10 text-sm">
                      <SelectValue placeholder="Toutes catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-3 block text-sm">
                    Prix (FCFA/jour)
                  </Label>
                  <div className="px-2">
                    <Slider
                      min={20000}
                      max={150000}
                      step={5000}
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters({...filters, priceRange: value})}
                      className="mb-3"
                      data-testid="price-range-slider"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                      <span className="font-medium">{filters.priceRange[0].toLocaleString()}</span>
                      <span className="text-gray-400">—</span>
                      <span className="font-medium">{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setFilters({ city: '', category: '', priceRange: [20000, 150000] })} 
                  variant="outline" 
                  className="w-full h-10 text-sm"
                  data-testid="reset-filters-btn"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-600 text-sm sm:text-base" data-testid="results-count">
                {filteredCars.length} véhicule{filteredCars.length > 1 ? 's' : ''} disponible{filteredCars.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {filteredCars.map((car) => (
                <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift car-card" data-testid={`car-card-${car.id}`}>
                  <div className="relative h-48 sm:h-52 md:h-56">
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white px-2 sm:px-3 py-1 rounded-full shadow-lg">
                      <span className="text-xs sm:text-sm font-bold text-[#38BDF8]">{car.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{car.name}</h3>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{car.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-500 mb-3 sm:mb-4 flex items-center text-sm">
                      <Car className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      {car.city}
                    </p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm">
                      <div className="flex items-center text-gray-600">
                        <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="truncate">{car.transmission}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {car.seats}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Fuel className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="truncate">{car.fuel}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3 sm:pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-2xl sm:text-3xl font-bold text-[#38BDF8]">{car.price.toLocaleString()}</span>
                        <span className="text-gray-500 ml-2 text-xs sm:text-sm">FCFA/j</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => navigate(`/cars/${car.id}`)} 
                      className="w-full mt-3 sm:mt-4 bg-[#38BDF8] hover:bg-[#0EA5E9] h-10 sm:h-11 text-sm sm:text-base"
                      data-testid={`view-car-${car.id}-btn`}
                    >
                      Voir les détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-20" data-testid="no-results">
                <Car className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucun véhicule trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
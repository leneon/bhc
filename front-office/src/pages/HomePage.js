import React from 'react';
import { Car, Bus, Plane, Shield, Clock, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { voitureService } from '@/services/voitureService';

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('car');
  const [popularCars, setPopularCars] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadPopularCars();
  }, []);

  const loadPopularCars = async () => {
    try {
      const result = await voitureService.getAllVoitures();
      
      console.log('🚗 [HomePage] Chargement des véhicules');
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
        
        const transformedCars = filtered
          .map(v => voitureService.transformVoitureForDisplay(v))
          .slice(0, 3);
        
        console.log('🎨 Véhicules transformés:', transformedCars);
        setPopularCars(transformedCars);
      } else {
        console.error('❌ Erreur API:', result.error);
      }
    } catch (error) {
      console.error('💥 Error loading popular cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (type) => {
    if (type === 'car') navigate('/cars');
    else if (type === 'bus') navigate('/bus');
    else if (type === 'flight') navigate('/flights');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden py-12 md:py-0">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#38BDF8]/40 via-[#0EA5E9]/35 to-[#FDBA74]/30"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 md:mb-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 md:mb-4 px-2" style={{ fontFamily: 'Work Sans' }}>
              Voyagez avec Atiko
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 px-4">
              Votre partenaire de confiance pour tous vos déplacements
            </p>
          </div>

          {/* Search Box */}
          <div className="glass-dark rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl max-w-4xl mx-auto" data-testid="search-box">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6 bg-white/50 h-auto">
                <TabsTrigger value="car" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2" data-testid="tab-car">
                  <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Voiture</span>
                  <span className="xs:hidden">Auto</span>
                </TabsTrigger>
                <TabsTrigger value="bus" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2" data-testid="tab-bus">
                  <Bus className="h-3 w-3 sm:h-4 sm:w-4" />
                  Bus
                </TabsTrigger>
                <TabsTrigger value="flight" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2" data-testid="tab-flight">
                  <Plane className="h-3 w-3 sm:h-4 sm:w-4" />
                  Avion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="car" className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Ville</Label>
                    <Input placeholder="Où souhaitez-vous louer ?" className="mt-1 h-10 md:h-auto" data-testid="car-city-input" />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Type de véhicule</Label>
                    <Input placeholder="Berline, SUV..." className="mt-1 h-10 md:h-auto" data-testid="car-type-input" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Date de début</Label>
                    <Input type="date" className="mt-1 h-10 md:h-auto" data-testid="car-start-date" />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Date de fin</Label>
                    <Input type="date" className="mt-1 h-10 md:h-auto" data-testid="car-end-date" />
                  </div>
                </div>
                <Button 
                  onClick={() => handleSearch('car')} 
                  className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white h-11 md:h-12 text-base md:text-lg font-semibold"
                  data-testid="search-car-btn"
                >
                  Rechercher des voitures
                </Button>
              </TabsContent>

              <TabsContent value="bus" className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Ville de départ</Label>
                    <Input placeholder="Dakar" className="mt-1 h-10 md:h-auto" data-testid="bus-from-input" />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Ville d'arrivée</Label>
                    <Input placeholder="Thiès" className="mt-1 h-10 md:h-auto" data-testid="bus-to-input" />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium text-sm">Date de voyage</Label>
                  <Input type="date" className="mt-1 h-10 md:h-auto" data-testid="bus-date-input" />
                </div>
                <Button 
                  onClick={() => handleSearch('bus')} 
                  className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white h-11 md:h-12 text-base md:text-lg font-semibold"
                  data-testid="search-bus-btn"
                >
                  Rechercher des bus
                </Button>
              </TabsContent>

              <TabsContent value="flight" className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Aéroport de départ</Label>
                    <Input placeholder="DSS - Dakar" className="mt-1 h-10 md:h-auto" data-testid="flight-from-input" />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Aéroport d'arrivée</Label>
                    <Input placeholder="CDG - Paris" className="mt-1 h-10 md:h-auto" data-testid="flight-to-input" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Date de départ</Label>
                    <Input type="date" className="mt-1 h-10 md:h-auto" data-testid="flight-depart-date" />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium text-sm">Date de retour</Label>
                    <Input type="date" className="mt-1 h-10 md:h-auto" data-testid="flight-return-date" />
                  </div>
                </div>
                <Button 
                  onClick={() => handleSearch('flight')} 
                  className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white h-11 md:h-12 text-base md:text-lg font-semibold"
                  data-testid="search-flight-btn"
                >
                  Rechercher des vols
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800 px-4" style={{ fontFamily: 'Work Sans' }}>
            Pourquoi choisir Atiko ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover-lift text-center" data-testid="feature-payment">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#6EE7B7] to-[#34D399] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Shield className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">Paiement sécurisé</h3>
              <p className="text-sm md:text-base text-gray-600">Transactions 100% sécurisées avec Stripe et Mobile Money</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover-lift text-center" data-testid="feature-speed">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FDBA74] to-[#FB923C] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Clock className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">Réservation rapide</h3>
              <p className="text-sm md:text-base text-gray-600">Réservez en quelques clics seulement</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover-lift text-center sm:col-span-2 md:col-span-1" data-testid="feature-support">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Headphones className="h-7 w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">Support 24/7</h3>
              <p className="text-sm md:text-base text-gray-600">Équipe disponible à tout moment pour vous aider</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800" style={{ fontFamily: 'Work Sans' }}>
              Véhicules populaires
            </h2>
            <Button 
              onClick={() => navigate('/cars')} 
              variant="outline" 
              className="border-[#38BDF8] text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white w-full sm:w-auto"
              data-testid="view-all-cars-btn"
            >
              Voir tout
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {loading ? (
              Array(3).fill(0).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-44 sm:h-48 bg-gray-200"></div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded mb-3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : popularCars.length > 0 ? (
              popularCars.map((car) => (
                <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift car-card" data-testid={`popular-car-${car.id}`}>
                  <img src={car.image} alt={car.name} className="w-full h-44 sm:h-48 object-cover" />
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">{car.name}</h3>
                      <span className="text-xs sm:text-sm bg-[#38BDF8]/10 text-[#38BDF8] px-2 sm:px-3 py-1 rounded-full font-medium">
                        {car.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 md:mb-4">{car.city}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl sm:text-2xl font-bold text-[#38BDF8]">{car.price.toLocaleString()}</span>
                      <span className="text-xs sm:text-sm text-gray-500">FCFA/jour</span>
                    </div>
                    <Button 
                      onClick={() => navigate(`/cars/${car.id}`)} 
                      className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] h-10 sm:h-auto"
                      data-testid={`book-car-${car.id}-btn`}
                    >
                      Réserver
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Aucun véhicule disponible pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800 px-4" style={{ fontFamily: 'Work Sans' }}>
            Destinations populaires
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { name: 'Dakar', image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500' },
              { name: 'Saint-Louis', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=500' },
              { name: 'Thiès', image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=500' },
              { name: 'Saly', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500' }
            ].map((dest, idx) => (
              <div key={idx} className="relative h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden hover-lift cursor-pointer group" data-testid={`destination-${idx}`}>
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 sm:p-5 md:p-6">
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">{dest.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800 px-4" style={{ fontFamily: 'Work Sans' }}>
            Ce que disent nos clients
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              { name: 'Fatou Diop', text: 'Service excellent ! J\'ai réservé une voiture en quelques minutes.', rating: 5 },
              { name: 'Moussa Sall', text: 'Très pratique pour mes voyages d\'affaires. Je recommande !', rating: 5 },
              { name: 'Awa Ndiaye', text: 'Prix compétitifs et support client réactif. Parfait !', rating: 5 }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-5 sm:p-6 rounded-xl shadow-lg" data-testid={`testimonial-${idx}`}>
                <div className="flex mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg sm:text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm sm:text-base mb-3 md:mb-4 italic">"{testimonial.text}"</p>
                <p className="font-bold text-gray-800 text-sm sm:text-base">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
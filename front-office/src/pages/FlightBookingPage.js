import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockFlights, airports } from '@/utils/mockData';
import { isAuthenticated } from '@/utils/auth';

export default function FlightBookingPage() {
  const navigate = useNavigate();
  const [tripType, setTripType] = React.useState('one-way');
  const [search, setSearch] = React.useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: ''
  });

  const filteredFlights = mockFlights.filter(flight => {
    if (search.from && !flight.from.toLowerCase().includes(search.from.toLowerCase())) return false;
    if (search.to && !flight.to.toLowerCase().includes(search.to.toLowerCase())) return false;
    return true;
  });

  const handleBooking = (flight) => {
    if (!isAuthenticated()) {
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
          date: search.departDate || new Date().toISOString().split('T')[0]
        },
        totalPrice: flight.price
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8" style={{ fontFamily: 'Work Sans' }} data-testid="flight-booking-title">
          Réservation de vols
        </h1>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-testid="flight-search-form">
          <Tabs value={tripType} onValueChange={setTripType} className="mb-6">
            <TabsList>
              <TabsTrigger value="one-way" data-testid="one-way-tab">Aller simple</TabsTrigger>
              <TabsTrigger value="round-trip" data-testid="round-trip-tab">Aller-retour</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">Aéroport de départ</Label>
              <Input 
                placeholder="DSS - Dakar" 
                value={search.from}
                onChange={(e) => setSearch({...search, from: e.target.value})}
                data-testid="flight-from-input"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">Aéroport d'arrivée</Label>
              <Input 
                placeholder="CDG - Paris" 
                value={search.to}
                onChange={(e) => setSearch({...search, to: e.target.value})}
                data-testid="flight-to-input"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">Date de départ</Label>
              <Input 
                type="date" 
                value={search.departDate}
                onChange={(e) => setSearch({...search, departDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                data-testid="flight-depart-date"
              />
            </div>
            {tripType === 'round-trip' && (
              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Date de retour</Label>
                <Input 
                  type="date" 
                  value={search.returnDate}
                  onChange={(e) => setSearch({...search, returnDate: e.target.value})}
                  min={search.departDate || new Date().toISOString().split('T')[0]}
                  data-testid="flight-return-date"
                />
              </div>
            )}
          </div>

          <Button 
            onClick={() => {}} 
            className="w-full mt-6 bg-[#38BDF8] hover:bg-[#0EA5E9] h-12"
            data-testid="search-flights-btn"
          >
            Rechercher des vols
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <p className="text-gray-600 mb-4" data-testid="flight-results-count">
            {filteredFlights.length} vol{filteredFlights.length > 1 ? 's' : ''} disponible{filteredFlights.length > 1 ? 's' : ''}
          </p>

          {filteredFlights.map((flight) => (
            <div key={flight.id} className="bg-white rounded-xl shadow-lg p-6 hover-lift" data-testid={`flight-card-${flight.id}`}>
              <div className="grid md:grid-cols-12 gap-6 items-center">
                {/* Airline */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center">
                      <Plane className="h-6 w-6 text-[#38BDF8]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{flight.airline}</h3>
                    </div>
                  </div>
                </div>

                {/* Flight Info */}
                <div className="md:col-span-5">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{flight.departure}</div>
                      <div className="text-sm text-gray-600">{flight.from}</div>
                      <div className="text-xs text-gray-500">{flight.fromCity}</div>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="border-t-2 border-dashed border-gray-300 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                          <Plane className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">{flight.duration}</div>
                      <div className="text-xs text-[#38BDF8] text-center">{flight.stops}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{flight.arrival}</div>
                      <div className="text-sm text-gray-600">{flight.to}</div>
                      <div className="text-xs text-gray-500">{flight.toCity}</div>
                    </div>
                  </div>
                </div>

                {/* Class */}
                <div className="md:col-span-2">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Classe</div>
                    <div className="font-bold text-gray-800">{flight.class}</div>
                    <div className="text-xs text-gray-500 mt-1">{flight.seats} sièges restants</div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="md:col-span-3 text-right">
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-[#38BDF8]">{flight.price.toLocaleString()}</span>
                    <span className="text-gray-600 block text-sm">FCFA</span>
                  </div>
                  <Button 
                    onClick={() => handleBooking(flight)}
                    className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9]"
                    data-testid={`book-flight-${flight.id}-btn`}
                  >
                    Réserver
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredFlights.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl" data-testid="no-flight-results">
              <Plane className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucun vol trouvé</h3>
              <p className="text-gray-500">Essayez une autre recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
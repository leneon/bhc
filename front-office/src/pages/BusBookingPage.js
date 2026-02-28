import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Clock, Users, Wifi, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockBuses, cities } from '@/utils/mockData';
import { isAuthenticated } from '@/utils/auth';

export default function BusBookingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState({
    from: '',
    to: '',
    date: ''
  });
  const [selectedBus, setSelectedBus] = React.useState(null);
  const [selectedSeat, setSelectedSeat] = React.useState(null);

  const filteredBuses = mockBuses.filter(bus => {
    if (search.from && bus.from !== search.from) return false;
    if (search.to && bus.to !== search.to) return false;
    return true;
  });

  const handleBooking = (bus) => {
    if (!isAuthenticated()) {
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
          seat: selectedSeat || 'Non sélectionné',
          date: search.date || new Date().toISOString().split('T')[0]
        },
        totalPrice: bus.price
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8" style={{ fontFamily: 'Work Sans' }} data-testid="bus-booking-title">
          Réservation de bus
        </h1>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-testid="bus-search-form">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">Ville de départ</Label>
              <Input 
                placeholder="Dakar" 
                value={search.from}
                onChange={(e) => setSearch({...search, from: e.target.value})}
                data-testid="bus-from-input"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">Ville d'arrivée</Label>
              <Input 
                placeholder="Thiès" 
                value={search.to}
                onChange={(e) => setSearch({...search, to: e.target.value})}
                data-testid="bus-to-input"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">Date de voyage</Label>
              <Input 
                type="date" 
                value={search.date}
                onChange={(e) => setSearch({...search, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                data-testid="bus-date-input"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {}} 
                className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9]"
                data-testid="search-bus-btn"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <p className="text-gray-600 mb-4" data-testid="bus-results-count">
            {filteredBuses.length} bus disponible{filteredBuses.length > 1 ? 's' : ''}
          </p>

          {filteredBuses.map((bus) => (
            <div key={bus.id} className="bg-white rounded-xl shadow-lg p-6 hover-lift" data-testid={`bus-card-${bus.id}`}>
              <div className="grid md:grid-cols-12 gap-6 items-center">
                {/* Company */}
                <div className="md:col-span-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-full flex items-center justify-center">
                      <Bus className="h-6 w-6 text-[#38BDF8]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{bus.company}</h3>
                      <span className="text-xs text-gray-500">{bus.type}</span>
                    </div>
                  </div>
                </div>

                {/* Route & Time */}
                <div className="md:col-span-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{bus.departure}</div>
                      <div className="text-sm text-gray-600">{bus.from}</div>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="border-t-2 border-dashed border-gray-300 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">{bus.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{bus.arrival}</div>
                      <div className="text-sm text-gray-600">{bus.to}</div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="md:col-span-2">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {bus.availableSeats} sièges libres
                    </div>
                    {bus.amenities.includes('WiFi') && (
                      <div className="flex items-center">
                        <Wifi className="h-4 w-4 mr-2" />
                        WiFi gratuit
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="md:col-span-3 text-right">
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-[#38BDF8]">{bus.price.toLocaleString()}</span>
                    <span className="text-gray-600 ml-2">FCFA</span>
                  </div>
                  <Button 
                    onClick={() => handleBooking(bus)}
                    className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9]"
                    data-testid={`book-bus-${bus.id}-btn`}
                  >
                    Réserver
                  </Button>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                {bus.amenities.map((amenity, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-gray-700 text-xs rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredBuses.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl" data-testid="no-bus-results">
              <Bus className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucun bus trouvé</h3>
              <p className="text-gray-500">Essayez une autre recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
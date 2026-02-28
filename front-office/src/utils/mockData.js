export const mockCars = [
  {
    id: 1,
    name: 'Toyota Camry',
    category: 'Berline',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    city: 'Dakar',
    transmission: 'Automatique',
    seats: 5,
    fuel: 'Essence',
    available: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'Honda CR-V',
    category: 'SUV',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    city: 'Dakar',
    transmission: 'Automatique',
    seats: 7,
    fuel: 'Diesel',
    available: true,
    rating: 4.9,
    reviews: 98
  },
  {
    id: 3,
    name: 'Renault Clio',
    category: 'Économique',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    city: 'Thiès',
    transmission: 'Manuelle',
    seats: 5,
    fuel: 'Essence',
    available: true,
    rating: 4.5,
    reviews: 156
  },
  {
    id: 4,
    name: 'Mercedes GLE',
    category: 'Luxe',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    city: 'Dakar',
    transmission: 'Automatique',
    seats: 5,
    fuel: 'Diesel',
    available: true,
    rating: 5.0,
    reviews: 87
  },
  {
    id: 5,
    name: 'Hyundai Tucson',
    category: 'SUV',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
    city: 'Saint-Louis',
    transmission: 'Automatique',
    seats: 5,
    fuel: 'Essence',
    available: true,
    rating: 4.7,
    reviews: 112
  },
  {
    id: 6,
    name: 'Peugeot 208',
    category: 'Économique',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    city: 'Thiès',
    transmission: 'Manuelle',
    seats: 5,
    fuel: 'Essence',
    available: true,
    rating: 4.6,
    reviews: 143
  }
];

export const mockBuses = [
  {
    id: 1,
    company: 'Ndiaga Ndiaye Express',
    from: 'Dakar',
    to: 'Thiès',
    departure: '08:00',
    arrival: '09:30',
    duration: '1h 30min',
    price: 3500,
    seats: 45,
    availableSeats: 12,
    type: 'Standard',
    amenities: ['AC', 'WiFi']
  },
  {
    id: 2,
    company: 'Senegal Dem Dikk',
    from: 'Dakar',
    to: 'Saint-Louis',
    departure: '10:00',
    arrival: '13:30',
    duration: '3h 30min',
    price: 8000,
    seats: 40,
    availableSeats: 8,
    type: 'VIP',
    amenities: ['AC', 'WiFi', 'Snacks']
  },
  {
    id: 3,
    company: 'Alham Transport',
    from: 'Dakar',
    to: 'Kaolack',
    departure: '14:00',
    arrival: '17:00',
    duration: '3h',
    price: 6500,
    seats: 50,
    availableSeats: 20,
    type: 'Standard',
    amenities: ['AC']
  },
  {
    id: 4,
    company: 'Ndiaga Ndiaye Express',
    from: 'Thiès',
    to: 'Dakar',
    departure: '15:00',
    arrival: '16:30',
    duration: '1h 30min',
    price: 3500,
    seats: 45,
    availableSeats: 15,
    type: 'Standard',
    amenities: ['AC', 'WiFi']
  },
  {
    id: 5,
    company: 'Senegal Dem Dikk',
    from: 'Saint-Louis',
    to: 'Dakar',
    departure: '07:00',
    arrival: '10:30',
    duration: '3h 30min',
    price: 8000,
    seats: 40,
    availableSeats: 5,
    type: 'VIP',
    amenities: ['AC', 'WiFi', 'Snacks', 'TV']
  }
];

export const mockFlights = [
  {
    id: 1,
    airline: 'Air Sénégal',
    from: 'DSS',
    fromCity: 'Dakar',
    to: 'CDG',
    toCity: 'Paris',
    departure: '23:55',
    arrival: '07:10+1',
    duration: '5h 15min',
    stops: 'Direct',
    price: 450000,
    class: 'Économique',
    seats: 20
  },
  {
    id: 2,
    airline: 'Turkish Airlines',
    from: 'DSS',
    fromCity: 'Dakar',
    to: 'IST',
    toCity: 'Istanbul',
    departure: '02:30',
    arrival: '14:45',
    duration: '10h 15min',
    stops: '1 escale',
    price: 380000,
    class: 'Économique',
    seats: 15
  },
  {
    id: 3,
    airline: 'Air France',
    from: 'DSS',
    fromCity: 'Dakar',
    to: 'CDG',
    toCity: 'Paris',
    departure: '10:30',
    arrival: '17:45',
    duration: '5h 15min',
    price: 520000,
    stops: 'Direct',
    class: 'Business',
    seats: 8
  },
  {
    id: 4,
    airline: 'Royal Air Maroc',
    from: 'DSS',
    fromCity: 'Dakar',
    to: 'CMN',
    toCity: 'Casablanca',
    departure: '16:00',
    arrival: '20:15',
    duration: '4h 15min',
    stops: 'Direct',
    price: 280000,
    class: 'Économique',
    seats: 25
  },
  {
    id: 5,
    airline: 'Brussels Airlines',
    from: 'DSS',
    fromCity: 'Dakar',
    to: 'BRU',
    toCity: 'Bruxelles',
    departure: '01:15',
    arrival: '08:30',
    duration: '5h 15min',
    stops: 'Direct',
    price: 410000,
    class: 'Économique',
    seats: 18
  },
  {
    id: 6,
    airline: 'Air Sénégal',
    from: 'DSS',
    fromCity: 'Dakar',
    to: 'ABJ',
    toCity: 'Abidjan',
    departure: '14:30',
    arrival: '16:15',
    duration: '1h 45min',
    stops: 'Direct',
    price: 180000,
    class: 'Économique',
    seats: 30
  }
];

export const cities = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Mbour', 'Tambacounda'
];

export const airports = [
  { code: 'DSS', city: 'Dakar', name: 'Blaise Diagne' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport' },
  { code: 'CMN', city: 'Casablanca', name: 'Mohammed V' },
  { code: 'BRU', city: 'Bruxelles', name: 'Brussels Airport' },
  { code: 'ABJ', city: 'Abidjan', name: 'Félix-Houphouët-Boigny' },
  { code: 'ACC', city: 'Accra', name: 'Kotoka' }
];
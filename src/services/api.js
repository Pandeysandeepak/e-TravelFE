// Mock API layer - Replace BASE_URL with actual Spring Boot backend URL later
const BASE_URL = 'http://localhost:8080/api'; // Change this when connecting to backend

// Simulated delay for API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const ROUTES = [
  {
    id: 'BUS001',
    busNumber: 'KA01FA1234',
    ownerId: 2,
    ownerName: 'Bus Owner',
    source: 'Bangalore',
    destination: 'Mysore',
    route: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9279, lng: 77.6276 },
      { lat: 12.8937, lng: 77.6583 },
      { lat: 12.8529, lng: 77.6861 },
      { lat: 12.7984, lng: 77.7001 },
      { lat: 12.2958, lng: 76.6394 },
    ],
    stops: [
      { name: 'Majestic', lat: 12.9762, lng: 77.5715 },
      { name: 'Silk Board', lat: 12.9176, lng: 77.6224 },
      { name: 'Electronic City', lat: 12.8456, lng: 77.6603 },
      { name: 'Mysore Junction', lat: 12.3052, lng: 76.6551 },
    ],
    currentLocation: { lat: 12.9279, lng: 77.6276 },
    status: 'ACTIVE',
    delay: 5,
    eta: '2h 15m',
    speed: 45,
    capacity: 45,
    busType: 'AC Sleeper',
    price: 450,
    departureTime: '08:00 AM',
    arrivalTime: '10:15 AM',
  },
  {
    id: 'BUS002',
    busNumber: 'KA05MB5678',
    ownerId: 2,
    ownerName: 'Bus Owner',
    source: 'Bangalore',
    destination: 'Chennai',
    route: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 13.0827, lng: 77.5643 },
      { lat: 13.2156, lng: 77.4864 },
      { lat: 13.3409, lng: 77.1082 },
      { lat: 13.6288, lng: 77.2190 },
      { lat: 13.0827, lng: 80.2707 },
    ],
    stops: [
      { name: 'Majestic', lat: 12.9762, lng: 77.5715 },
      { name: 'Hoskote', lat: 13.0667, lng: 77.7833 },
      { name: 'Kolar', lat: 13.1367, lng: 78.1292 },
      { name: 'Chennai Central', lat: 13.0827, lng: 80.2707 },
    ],
    currentLocation: { lat: 13.2156, lng: 77.4864 },
    status: 'ACTIVE',
    delay: 0,
    eta: '5h 30m',
    speed: 60,
    capacity: 52,
    busType: 'Non-AC',
    price: 650,
    departureTime: '06:00 AM',
    arrivalTime: '11:30 AM',
  },
  {
    id: 'BUS003',
    busNumber: 'TN07AB9012',
    ownerId: 3,
    ownerName: 'Another Owner',
    source: 'Mysore',
    destination: 'Coorg',
    route: [
      { lat: 12.2958, lng: 76.6394 },
      { lat: 12.3375, lng: 76.6246 },
      { lat: 12.4578, lng: 76.1358 },
      { lat: 12.3375, lng: 75.9275 },
      { lat: 12.4406, lng: 75.7804 },
    ],
    stops: [
      { name: 'Mysore Zoo', lat: 12.3100, lng: 76.6500 },
      { name: 'Hunsur', lat: 12.3100, lng: 76.2900 },
      { name: 'Madikeri', lat: 12.4200, lng: 75.7300 },
    ],
    currentLocation: { lat: 12.4578, lng: 76.1358 },
    status: 'INACTIVE',
    delay: 10,
    eta: '4h 00m',
    speed: 35,
    capacity: 40,
    busType: 'AC Seater',
    price: 380,
    departureTime: '09:00 AM',
    arrivalTime: '01:00 PM',
  },
  {
    id: 'BUS004',
    busNumber: 'KA01AB3456',
    ownerId: 2,
    ownerName: 'Bus Owner',
    source: 'Bangalore',
    destination: 'Pune',
    route: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 13.0580, lng: 77.4500 },
      { lat: 13.2900, lng: 77.0000 },
      { lat: 14.1500, lng: 76.4000 },
      { lat: 15.8500, lng: 75.7000 },
      { lat: 18.5204, lng: 73.8567 },
    ],
    stops: [
      { name: 'Majestic', lat: 12.9762, lng: 77.5715 },
      { name: 'Davanagere', lat: 14.4600, lng: 75.9200 },
      { name: 'Belgaum', lat: 15.8500, lng: 74.5000 },
      { name: 'Pune Station', lat: 18.5289, lng: 73.8744 },
    ],
    currentLocation: { lat: 14.1500, lng: 76.4000 },
    status: 'ACTIVE',
    delay: 15,
    eta: '12h 00m',
    speed: 55,
    capacity: 48,
    busType: 'Volvo AC',
    price: 1200,
    departureTime: '10:00 PM',
    arrivalTime: '10:00 AM',
  },
  {
    id: 'BUS005',
    busNumber: 'MH12CD7890',
    ownerId: 4,
    ownerName: 'Travel King',
    source: 'Mumbai',
    destination: 'Bangalore',
    route: [
      { lat: 19.0760, lng: 72.8777 },
      { lat: 18.5204, lng: 73.8567 },
      { lat: 16.8500, lng: 74.6000 },
      { lat: 15.8500, lng: 75.7000 },
      { lat: 14.1500, lng: 76.4000 },
      { lat: 12.9716, lng: 77.5946 },
    ],
    stops: [
      { name: 'Dadar', lat: 19.0176, lng: 72.8420 },
      { name: 'Pune', lat: 18.5204, lng: 73.8567 },
      { name: 'Kolhapur', lat: 16.8500, lng: 74.6000 },
      { name: 'Belgaum', lat: 15.8500, lng: 75.7000 },
      { name: 'Majestic', lat: 12.9762, lng: 77.5715 },
    ],
    currentLocation: { lat: 16.8500, lng: 74.6000 },
    status: 'ACTIVE',
    delay: 0,
    eta: '14h 00m',
    speed: 50,
    capacity: 44,
    busType: 'Volvo Sleeper',
    price: 1500,
    departureTime: '06:00 PM',
    arrivalTime: '08:00 AM',
  },
];

// API Methods - All return mock data, ready for real backend connection

export const login = async (email, password) => {
  await delay(500);
  return {
    success: true,
    data: {
      token: 'mock-jwt-token-' + Date.now(),
      user: { id: 1, email, role: 'USER', name: 'Test User' },
    },
  };
};

export const register = async (userData) => {
  await delay(500);
  return {
    success: true,
    data: {
      token: 'mock-jwt-token-' + Date.now(),
      user: { id: 1, ...userData, role: 'USER' },
    },
  };
};

export const getBusesBetweenStops = async (source, destination) => {
  await delay(300);
  const filtered = ROUTES.filter(
    bus =>
      bus.source.toLowerCase().includes(source.toLowerCase()) ||
      bus.destination.toLowerCase().includes(destination.toLowerCase())
  );
  return filtered.length > 0 ? filtered : ROUTES;
};

export const getBusLiveLocation = async (busId) => {
  await delay(200);
  const bus = ROUTES.find(b => b.id === busId);
  if (!bus) return null;

  // Simulate slight movement
  const routeIndex = Math.floor(Math.random() * (bus.route.length - 1));
  const point = bus.route[routeIndex];

  return {
    busId,
    lat: point.lat + (Math.random() - 0.5) * 0.01,
    lng: point.lng + (Math.random() - 0.5) * 0.01,
    speed: 40 + Math.random() * 30,
    timestamp: new Date().toISOString(),
  };
};

export const getAllBuses = async () => {
  await delay(300);
  return ROUTES;
};

export const getOwnerBuses = async (ownerId) => {
  await delay(300);
  return ROUTES.filter(bus => bus.ownerId === ownerId);
};

export const addBus = async (busData) => {
  await delay(500);
  const newBus = {
    id: 'BUS' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    ...busData,
    currentLocation: busData.route?.[0] || { lat: 0, lng: 0 },
    status: 'ACTIVE',
    delay: 0,
    speed: 0,
  };
  ROUTES.push(newBus);
  return newBus;
};

export const updateBusStatus = async (busId, status) => {
  await delay(300);
  const bus = ROUTES.find(b => b.id === busId);
  if (bus) {
    bus.status = status;
  }
  return bus;
};

export const deleteBus = async (busId) => {
  await delay(300);
  const index = ROUTES.findIndex(b => b.id === busId);
  if (index > -1) {
    ROUTES.splice(index, 1);
  }
  return { success: true };
};

export default {
  login,
  register,
  getBusesBetweenStops,
  getBusLiveLocation,
  getAllBuses,
  getOwnerBuses,
  addBus,
  updateBusStatus,
  deleteBus,
};
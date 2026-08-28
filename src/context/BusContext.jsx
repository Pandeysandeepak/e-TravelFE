import { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as api from '../services/api';

const BusContext = createContext(null);

// Mock bus data store
const MOCK_BUSES = [
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
  },
];

export function BusProvider({ children }) {
  const [buses, setBuses] = useState(MOCK_BUSES);
  const [liveLocations, setLiveLocations] = useState({});
  const trackingIntervals = useRef({});

  // Get bus route polyline for display
  const getBusRoute = useCallback((busId) => {
    const bus = buses.find(b => b.id === busId);
    return bus?.route || [];
  }, [buses]);

  // Get bus stops
  const getBusStops = useCallback((busId) => {
    const bus = buses.find(b => b.id === busId);
    return bus?.stops || [];
  }, [buses]);

  // Search buses between source and destination
  const searchBuses = useCallback(async (source, destination) => {
    const results = await api.getBusesBetweenStops(source, destination);
    return results;
  }, []);

  // Get bus by ID
  const getBusById = useCallback((busId) => {
    return buses.find(b => b.id === busId);
  }, [buses]);

  // Get all buses
  const getAllBuses = useCallback(async () => {
    return await api.getAllBuses();
  }, []);

  // Get owner buses
  const getOwnerBuses = useCallback(async (ownerId) => {
    const ownerBuses = buses.filter(b => b.ownerId === ownerId);
    return ownerBuses;
  }, [buses]);

  // Add new bus
  const addBus = useCallback(async (busData) => {
    const newBus = await api.addBus(busData);
    setBuses(prev => [...prev, newBus]);
    return newBus;
  }, []);

  // Remove bus
  const removeBus = useCallback((busId) => {
    setBuses(prev => prev.filter(b => b.id !== busId));
    stopTrackingBus(busId);
  }, []);

  // Activate/Deactivate bus
  const toggleBusStatus = useCallback((busId) => {
    setBuses(prev => prev.map(b => {
      if (b.id === busId) {
        return { ...b, status: b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
      }
      return b;
    }));
  }, []);

  // Start live tracking
  const startTrackingBus = useCallback((busId) => {
    if (trackingIntervals.current[busId]) return;

    const bus = buses.find(b => b.id === busId);
    if (!bus || bus.route.length === 0) return;

    // Initialize current route index
    const routeIndex = Math.floor(Math.random() * (bus.route.length - 1));
    trackingIntervals.current[busId] = {
      index: routeIndex,
      interval: setInterval(() => {
        setLiveLocations(prev => {
          const current = prev[busId] || bus.route[routeIndex];
          const nextIndex = (prev[busId]?.index || routeIndex + 1) % bus.route.length;
          const nextPoint = bus.route[nextIndex];

          // Simulate movement towards next point
          const progress = 0.3 + Math.random() * 0.4;
          const newLat = current.lat + (nextPoint.lat - current.lat) * progress;
          const newLng = current.lng + (nextPoint.lng - current.lng) * progress;

          return {
            ...prev,
            [busId]: {
              lat: newLat,
              lng: newLng,
              index: nextIndex,
              speed: 30 + Math.random() * 40,
              timestamp: new Date().toISOString(),
            },
          };
        });
      }, 3000),
    };

    // Set initial location
    setLiveLocations(prev => ({
      ...prev,
      [busId]: { ...bus.route[routeIndex], index: routeIndex, speed: 45 },
    }));
  }, [buses]);

  // Stop live tracking
  const stopTrackingBus = useCallback((busId) => {
    if (trackingIntervals.current[busId]) {
      clearInterval(trackingIntervals.current[busId].interval);
      delete trackingIntervals.current[busId];
    }
    setLiveLocations(prev => {
      const newLocations = { ...prev };
      delete newLocations[busId];
      return newLocations;
    });
  }, []);

  // Get live location for a bus
  const getLiveLocation = useCallback((busId) => {
    return liveLocations[busId] || null;
  }, [liveLocations]);

  const value = {
    buses,
    liveLocations,
    getBusRoute,
    getBusStops,
    searchBuses,
    getBusById,
    getAllBuses,
    getOwnerBuses,
    addBus,
    removeBus,
    toggleBusStatus,
    startTrackingBus,
    stopTrackingBus,
    getLiveLocation,
  };

  return <BusContext.Provider value={value}>{children}</BusContext.Provider>;
}

export function useBus() {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error('useBus must be used within a BusProvider');
  }
  return context;
}
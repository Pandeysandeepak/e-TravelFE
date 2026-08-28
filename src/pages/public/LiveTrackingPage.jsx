import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import MapView from '../../components/MapView';
import { useBus } from '../../context/BusContext';
import * as api from '../../services/api';

export default function LiveTrackingPage() {
  const { busId } = useParams();
  const { getBusById, getBusRoute, getBusStops, startTrackingBus, stopTrackingBus, getLiveLocation } = useBus();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const updateIntervalRef = useRef(null);

  useEffect(() => {
    const loadBus = async () => {
      setLoading(true);
      try {
        const busData = getBusById(busId);
        setBus(busData);
        if (busData?.currentLocation) {
          setCurrentLocation(busData.currentLocation);
        }
      } catch (error) {
        console.error('Failed to load bus:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBus();
  }, [busId, getBusById]);

  // Start tracking when bus is loaded
  useEffect(() => {
    if (bus) {
      startTrackingBus(busId);

      // Update location every 3 seconds from context
      updateIntervalRef.current = setInterval(() => {
        const location = getLiveLocation(busId);
        if (location) {
          setCurrentLocation(location);
        }
      }, 3000);

      return () => {
        stopTrackingBus(busId);
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
        }
      };
    }
  }, [bus, busId, startTrackingBus, stopTrackingBus, getLiveLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bus details...</p>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bus Not Found</h2>
          <p className="text-gray-600 mb-4">The bus you're looking for doesn't exist.</p>
          <Link to="/search" className="text-blue-600 hover:text-blue-700">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const route = getBusRoute(busId);
  const stops = getBusStops(busId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/search"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{bus.busNumber}</h1>
                <p className="text-sm text-gray-500">{bus.source} → {bus.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-600">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <MapView
              route={route}
              stops={stops}
              currentLocation={currentLocation}
              center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [12.9716, 77.5946]}
              zoom={12}
              height="500px"
            />
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Bus Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Bus Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bus Type</span>
                  <span className="font-medium">{bus.busType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-medium">{bus.capacity} seats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium text-green-600">₹{bus.price}</span>
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Live Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {currentLocation?.speed ? Math.round(currentLocation.speed) : bus.speed}
                  </p>
                  <p className="text-xs text-gray-500">km/h</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {bus.delay > 0 ? `+${bus.delay}m` : 'On Time'}
                  </p>
                  <p className="text-xs text-gray-500">Delay</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">ETA</span>
                  <span className="font-semibold text-gray-900">{bus.eta}</span>
                </div>
              </div>
            </div>

            {/* Stops List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Stops ({stops.length})</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">{stop.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Track Button */}
            <button
              onClick={() => {
                // Refresh location
                api.getBusLiveLocation(busId).then(location => {
                  if (location) {
                    setCurrentLocation(location);
                  }
                });
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
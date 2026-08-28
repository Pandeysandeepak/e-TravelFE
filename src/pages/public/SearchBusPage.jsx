import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusCard from '../../components/BusCard';
import * as api from '../../services/api';

const POPULAR_ROUTES = [
  { from: 'Bangalore', to: 'Mysore' },
  { from: 'Bangalore', to: 'Chennai' },
  { from: 'Mumbai', to: 'Pune' },
  { from: 'Delhi', to: 'Jaipur' },
];

export default function SearchBusPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const results = await api.getBusesBetweenStops(source, destination);
      setBuses(results);
    } catch (error) {
      console.error('Search failed:', error);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (from, to) => {
    setSource(from);
    setDestination(to);
    setLoading(true);
    setSearched(true);

    api.getBusesBetweenStops(from, to).then(results => {
      setBuses(results);
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Buses</h1>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter source city"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination city"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Popular Routes */}
          {!searched && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Popular Routes:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROUTES.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(route.from, route.to)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {route.from} → {route.to}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {searched && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {buses.length} buses found
              </h2>
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Register for more features
              </button>
            </div>

            {buses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buses.map((bus) => (
                  <BusCard key={bus.id} bus={bus} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No buses found</h3>
                <p className="text-gray-500">Try searching for a different route or check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
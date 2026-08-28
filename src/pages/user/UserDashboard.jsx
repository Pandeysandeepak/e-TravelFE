import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import BusCard from '../../components/BusCard';
import * as api from '../../services/api';

export default function UserDashboard() {
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedBuses, setSavedBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load saved buses
        const buses = await api.getAllBuses();
        setSavedBuses(buses.slice(0, 3));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const quickSearches = [
    { from: 'Bangalore', to: 'Mysore' },
    { from: 'Bangalore', to: 'Chennai' },
    { from: 'Mumbai', to: 'Pune' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Search and track your buses.</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/search"
              className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold">Search Buses</h3>
              <p className="text-blue-100 text-sm mt-1">Find buses between stops</p>
            </Link>

            <Link
              to="/search"
              className="bg-green-600 text-white rounded-xl p-6 hover:bg-green-700 transition-colors"
            >
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <h3 className="text-lg font-semibold">Track Live Bus</h3>
              <p className="text-green-100 text-sm mt-1">Monitor bus location</p>
            </Link>

            <div className="bg-purple-600 text-white rounded-xl p-6">
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold">On-Time Rate</h3>
              <p className="text-2xl font-bold mt-2">94%</p>
              <p className="text-purple-100 text-sm mt-1">Based on recent trips</p>
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Link
                    key={index}
                    to={`/search?from=${search.from}&to=${search.to}`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {search.from} → {search.to}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Search */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickSearches.map((route, index) => (
                <Link
                  key={index}
                  to={`/search?from=${route.from}&to=${route.to}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{route.from}</p>
                      <p className="text-sm text-gray-500">to {route.to}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Saved Buses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Available Buses</h2>
              <Link to="/search" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedBuses.map((bus) => (
                  <BusCard key={bus.id} bus={bus} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
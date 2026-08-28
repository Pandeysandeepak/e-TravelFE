import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useBus } from '../../context/BusContext';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { buses, getOwnerBuses, startTrackingBus, stopTrackingBus, liveLocations } = useBus();
  const [ownerBuses, setOwnerBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingBus, setTrackingBus] = useState(null);

  useEffect(() => {
    const loadBuses = async () => {
      setLoading(true);
      try {
        const ownerBusList = await getOwnerBuses(user?.id || 2);
        // For demo, show all buses
        setOwnerBuses(buses);
      } catch (error) {
        console.error('Failed to load buses:', error);
        setOwnerBuses(buses);
      } finally {
        setLoading(false);
      }
    };

    loadBuses();
  }, [user, getOwnerBuses, buses]);

  const stats = {
    total: ownerBuses.length,
    active: ownerBuses.filter(b => b.status === 'ACTIVE').length,
    inactive: ownerBuses.filter(b => b.status === 'INACTIVE').length,
    totalPassengers: ownerBuses.reduce((acc, b) => acc + (b.capacity || 0), 0),
  };

  const handleTrackBus = (busId) => {
    if (trackingBus === busId) {
      stopTrackingBus(busId);
      setTrackingBus(null);
    } else {
      if (trackingBus) stopTrackingBus(trackingBus);
      startTrackingBus(busId);
      setTrackingBus(busId);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your fleet and monitor live locations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Buses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Buses</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Inactive Buses</p>
                  <p className="text-3xl font-bold text-gray-600 mt-1">{stats.inactive}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Capacity</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalPassengers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/owner/add-bus"
              className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Add New Bus</h3>
                <p className="text-blue-100 text-sm">Register a new bus to your fleet</p>
              </div>
            </Link>

            <Link
              to="/owner/manage-buses"
              className="bg-green-600 text-white rounded-xl p-6 hover:bg-green-700 transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Manage Buses</h3>
                <p className="text-green-100 text-sm">View and edit your fleet</p>
              </div>
            </Link>
          </div>

          {/* Buses Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Fleet</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ownerBuses.slice(0, 5).map((bus) => (
                    <tr key={bus.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{bus.busNumber}</p>
                          <p className="text-sm text-gray-500">{bus.busType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{bus.source}</p>
                        <p className="text-sm text-gray-500">to {bus.destination}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          bus.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {bus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {liveLocations[bus.id]?.speed ? `${Math.round(liveLocations[bus.id].speed)} km/h` : `${bus.speed} km/h`}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTrackBus(bus.id)}
                          className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                            trackingBus === bus.id
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {trackingBus === bus.id ? 'Stop Tracking' : 'Track Live'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200">
              <Link
                to="/owner/manage-buses"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all buses →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
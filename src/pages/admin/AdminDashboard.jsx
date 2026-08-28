import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useBus } from '../../context/BusContext';

export default function AdminDashboard() {
  const { buses, toggleBusStatus, startTrackingBus, stopTrackingBus, liveLocations } = useBus();
  const [trackingBus, setTrackingBus] = useState(null);

  const stats = {
    totalBuses: buses.length,
    activeBuses: buses.filter(b => b.status === 'ACTIVE').length,
    inactiveBuses: buses.filter(b => b.status === 'INACTIVE').length,
    totalOwners: new Set(buses.map(b => b.ownerId)).size,
    totalRoutes: new Set(buses.map(b => `${b.source}-${b.destination}`)).size,
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
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Monitor all buses and manage the platform</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Total Buses</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalBuses}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.activeBuses}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-3xl font-bold text-gray-600 mt-1">{stats.inactiveBuses}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Bus Owners</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalOwners}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Routes</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalRoutes}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/admin/buses"
              className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <h3 className="text-lg font-semibold">View All Buses</h3>
              <p className="text-blue-100 text-sm mt-1">Monitor entire fleet</p>
            </Link>

            <div className="bg-green-600 text-white rounded-xl p-6">
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold">System Status</h3>
              <p className="text-green-100 text-sm mt-1">All systems operational</p>
            </div>

            <div className="bg-purple-600 text-white rounded-xl p-6">
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-semibold">Bus Owners</h3>
              <p className="text-purple-100 text-sm mt-1">{stats.totalOwners} registered</p>
            </div>
          </div>

          {/* Recent Buses Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bus Activity</h2>
                <Link to="/admin/buses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {buses.slice(0, 5).map((bus) => (
                    <tr key={bus.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{bus.busNumber}</td>
                      <td className="px-6 py-4 text-gray-600">{bus.ownerName}</td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{bus.source}</p>
                        <p className="text-sm text-gray-500">to {bus.destination}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleBusStatus(bus.id)}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            bus.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {bus.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {liveLocations[bus.id]?.speed ? (
                          <span className="text-green-600">{Math.round(liveLocations[bus.id].speed)} km/h</span>
                        ) : (
                          <span className="text-gray-500">{bus.speed} km/h</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTrackBus(bus.id)}
                          className={`px-3 py-1 text-sm font-medium rounded-lg ${
                            trackingBus === bus.id
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {trackingBus === bus.id ? 'Stop' : 'Track'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
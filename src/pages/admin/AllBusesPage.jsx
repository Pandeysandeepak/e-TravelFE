import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useBus } from '../../context/BusContext';

export default function AllBusesPage() {
  const { buses, toggleBusStatus, startTrackingBus, stopTrackingBus, liveLocations } = useBus();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trackingBus, setTrackingBus] = useState(null);

  const filteredBuses = buses.filter(bus => {
    const matchesSearch =
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || bus.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-2xl font-bold text-gray-900">All Buses</h1>
            <p className="text-gray-500 mt-1">View and manage all buses across the platform</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by bus number or route..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buses Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Showing {filteredBuses.length} of {buses.length} buses
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                  <span className="flex items-center gap-1 ml-4">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    Inactive
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBuses.map((bus) => (
                    <tr key={bus.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{bus.busNumber}</p>
                          <p className="text-sm text-gray-500">{bus.busType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{bus.ownerName}</td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{bus.source}</p>
                        <p className="text-sm text-gray-500">to {bus.destination}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{bus.busType}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleBusStatus(bus.id)}
                          className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                            bus.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {bus.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {bus.delay > 0 ? (
                          <span className="text-red-600">+{bus.delay}min</span>
                        ) : (
                          <span className="text-green-600">On Time</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {liveLocations[bus.id]?.speed ? (
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-gray-900">{Math.round(liveLocations[bus.id].speed)} km/h</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">{bus.speed} km/h</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTrackBus(bus.id)}
                            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                              trackingBus === bus.id
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {trackingBus === bus.id ? 'Stop' : 'Track'}
                          </button>
                          <Link
                            to={`/tracking/${bus.id}`}
                            className="px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBuses.length === 0 && (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No buses found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
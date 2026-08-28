import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useBus } from '../../context/BusContext';

export default function ManageBusesPage() {
  const { buses, removeBus, toggleBusStatus, startTrackingBus, stopTrackingBus, liveLocations } = useBus();
  const [loading, setLoading] = useState(true);
  const [trackingBus, setTrackingBus] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleDelete = (busId) => {
    if (window.confirm('Are you sure you want to remove this bus?')) {
      removeBus(busId);
    }
  };

  const handleToggleStatus = (busId) => {
    toggleBusStatus(busId);
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Buses</h1>
              <p className="text-gray-500 mt-1">View and manage your fleet</p>
            </div>
            <Link
              to="/owner/add-bus"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Bus
            </Link>
          </div>

          {/* Buses Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">All Buses ({buses.length})</h2>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : buses.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No buses yet</h3>
                <p className="text-gray-500 mb-4">Add your first bus to get started.</p>
                <Link
                  to="/owner/add-bus"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Bus
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bus Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Live Speed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {buses.map((bus) => (
                      <tr key={bus.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{bus.busNumber}</p>
                            <p className="text-sm text-gray-500">{bus.capacity} seats</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{bus.source}</p>
                          <p className="text-sm text-gray-500">to {bus.destination}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{bus.busType}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(bus.id)}
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
                          <div className="flex items-center gap-2">
                            {liveLocations[bus.id]?.speed ? (
                              <>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-gray-900">
                                  {Math.round(liveLocations[bus.id].speed)} km/h
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-500">{bus.speed} km/h</span>
                            )}
                          </div>
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
                            <button
                              onClick={() => handleDelete(bus.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
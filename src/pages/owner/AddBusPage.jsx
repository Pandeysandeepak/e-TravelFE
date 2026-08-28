import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useBus } from '../../context/BusContext';

const initialFormData = {
  busNumber: '',
  busType: 'AC',
  source: '',
  destination: '',
  capacity: 40,
  price: 0,
  departureTime: '08:00',
  arrivalTime: '12:00',
  stops: '',
};

export default function AddBusPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { addBus } = useBus();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Generate mock route between source and destination
      const stopsList = formData.stops.split(',').map(s => s.trim()).filter(Boolean);
      const route = generateMockRoute(formData.source, formData.destination, stopsList);

      const busData = {
        ...formData,
        stops: stopsList.map((name, i) => ({
          name,
          lat: 12.9716 + i * 0.1,
          lng: 77.5946 + i * 0.1,
        })),
        route,
        ownerId: 2,
        ownerName: 'Bus Owner',
      };

      await addBus(busData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/owner/manage-buses');
      }, 1500);
    } catch (err) {
      setError('Failed to add bus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate a simple mock route
  const generateMockRoute = (source, destination, stops) => {
    const baseRoute = [
      { lat: 12.9716, lng: 77.5946 }, // Bangalore
      { lat: 13.0827, lng: 77.5414 },
      { lat: 12.2958, lng: 76.6394 }, // Mysore
    ];
    return baseRoute;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Add New Bus</h1>
            <p className="text-gray-500 mt-1">Register a new bus to your fleet</p>
          </div>

          <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                  Bus added successfully! Redirecting...
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bus Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bus Number *
                    </label>
                    <input
                      type="text"
                      name="busNumber"
                      value={formData.busNumber}
                      onChange={handleChange}
                      placeholder="KA01AB1234"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bus Type *
                    </label>
                    <select
                      name="busType"
                      value={formData.busType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                      <option value="AC Sleeper">AC Sleeper</option>
                      <option value="Volvo AC">Volvo AC</option>
                      <option value="Volvo Sleeper">Volvo Sleeper</option>
                    </select>
                  </div>
                </div>

                {/* Route */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source City *
                    </label>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder="Bangalore"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination City *
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Mysore"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Stops */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stops (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="stops"
                    value={formData.stops}
                    onChange={handleChange}
                    placeholder="Silk Board, Electronic City, Mysore Junction"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Capacity & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="10"
                      max="100"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Time *
                    </label>
                    <input
                      type="time"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrival Time *
                    </label>
                    <input
                      type="time"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/owner')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {loading ? 'Adding Bus...' : 'Add Bus'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
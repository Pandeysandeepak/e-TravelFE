import { Link } from 'react-router-dom';

export default function BusCard({ bus, showTrackButton = true }) {
  const isActive = bus.status === 'ACTIVE';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{bus.busNumber}</h3>
            <p className="text-sm text-gray-500">{bus.busType}</p>
          </div>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {bus.status}
          </span>
        </div>
      </div>

      {/* Route Info */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-0.5 h-8 bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="font-medium text-gray-900">{bus.source}</p>
              <p className="text-sm text-gray-500">{bus.departureTime}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">To</p>
              <p className="font-medium text-gray-900">{bus.destination}</p>
              <p className="text-sm text-gray-500">{bus.arrivalTime}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500">Price</p>
            <p className="font-semibold text-gray-900">₹{bus.price}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">ETA</p>
            <p className="font-semibold text-gray-900">{bus.eta}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Delay</p>
            <p className={`font-semibold ${bus.delay > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {bus.delay > 0 ? `+${bus.delay}min` : 'On Time'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showTrackButton && (
        <div className="px-4 pb-4">
          <Link
            to={`/tracking/${bus.id}`}
            className="block w-full py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Track Bus
          </Link>
        </div>
      )}
    </div>
  );
}
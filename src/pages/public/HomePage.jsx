import { Link } from 'react-router-dom';
import MapView from '../../components/MapView';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Track Your Bus in Real-Time
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Never miss a bus again. Track live locations, get accurate ETAs, and plan your journey with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/search"
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Search Buses
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <MapView
                height="350px"
                center={[13.0827, 77.5414]}
                zoom={8}
                showControls={false}
                route={[
                  { lat: 12.9716, lng: 77.5946 },
                  { lat: 13.0827, lng: 77.5414 },
                  { lat: 12.2958, lng: 76.6394 },
                ]}
                stops={[
                  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
                  { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
                ]}
                currentLocation={{ lat: 13.0827, lng: 77.5414, speed: 55 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BusTrack?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
              <p className="text-gray-600">
                Track your bus location in real-time with updates every 3 seconds.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accurate ETAs</h3>
              <p className="text-gray-600">
                Get precise estimated arrival times based on real traffic conditions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Route Planning</h3>
              <p className="text-gray-600">
                View complete bus routes with all stops along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-400">50+</p>
              <p className="text-gray-400">Active Buses</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400">1000+</p>
              <p className="text-gray-400">Daily Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400">20+</p>
              <p className="text-gray-400">Bus Owners</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400">99%</p>
              <p className="text-gray-400">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of commuters who trust BusTrack for their daily travel.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
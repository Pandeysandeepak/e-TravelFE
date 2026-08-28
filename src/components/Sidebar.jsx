import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
  ADMIN: [
    { path: '/admin', label: 'Dashboard', icon: 'home' },
    { path: '/admin/buses', label: 'All Buses', icon: 'bus' },
  ],
  OWNER: [
    { path: '/owner', label: 'Dashboard', icon: 'home' },
    { path: '/owner/add-bus', label: 'Add Bus', icon: 'plus' },
    { path: '/owner/manage-buses', label: 'Manage Buses', icon: 'bus' },
  ],
  USER: [
    { path: '/user', label: 'Dashboard', icon: 'home' },
    { path: '/search', label: 'Search Buses', icon: 'search' },
  ],
};

const icons = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  bus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const items = navItems[user?.role] || [];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span className="text-xl font-bold">BusTrack</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {icons[item.icon]}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="px-4 py-3 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300">Signed in as</p>
          <p className="font-medium truncate">{user?.name || user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-blue-600">
            {user?.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="w-full mt-4 flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
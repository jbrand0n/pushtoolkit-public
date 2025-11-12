import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useSiteStore from '../stores/siteStore';
import useSites from '../hooks/useSites';

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { currentSite, sites } = useSiteStore();
  // Default to closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // Load sites when component mounts
  useSites();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Notifications', path: '/notifications', icon: '🔔' },
    { name: 'Subscribers', path: '/subscribers', icon: '👥' },
    { name: 'Campaigns', path: '/campaigns', icon: '📨' },
    { name: 'Segments', path: '/segments', icon: '🎯' },
    { name: 'RSS Feeds', path: '/rss-feeds', icon: '📡' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
    { name: 'Help', path: '/help', icon: '❓' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col fixed lg:relative inset-y-0 left-0 z-30 ${
          !sidebarOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold">Push Platform</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded hover:bg-gray-800"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Site Selector */}
        {sidebarOpen && sites && sites.length > 0 && (
          <div className="p-4 border-b border-gray-800">
            <select
              className="w-full bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentSite?.id || ''}
              onChange={(e) => {
                const site = sites.find(s => s.id === e.target.value);
                if (site) useSiteStore.getState().setCurrentSite(site);
              }}
            >
              {!currentSite && <option value="">Select a site...</option>}
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* New Notification Button */}
        <div className="p-4 border-b border-gray-800">
          <Link
            to="/notifications/new"
            className={`flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
              !sidebarOpen ? 'px-2' : ''
            }`}
          >
            {sidebarOpen ? (
              <>
                <span className="text-lg mr-2">+</span>
                <span className="font-medium">New Notification</span>
              </>
            ) : (
              <span className="text-xl">+</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="border-t border-gray-800 p-4">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white"
                title="Logout"
              >
                🚪
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-center text-2xl hover:bg-gray-800 rounded py-2"
              title="Logout"
            >
              🚪
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentSite?.name || (sites?.length === 0 ? 'No sites yet' : 'Select a site')}
                </h2>
                {currentSite ? (
                  <p className="text-sm text-gray-600">{currentSite.url}</p>
                ) : sites?.length === 0 ? (
                  <p className="text-sm text-gray-600">Create your first site to get started</p>
                ) : null}
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  to="/sites/new"
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">+ New Site</span>
                  <span className="sm:hidden">+</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

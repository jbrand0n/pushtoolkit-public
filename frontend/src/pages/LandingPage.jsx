import { Link } from 'react-router-dom';
import { useState } from 'react';

// Simple icon components
function BellIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function ChartIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function UsersIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function LightningIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ShieldIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function RocketIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function CheckIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function RSSIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );
}

function TargetIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  );
}

function ClockIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BellIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">PushToolkit</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
              <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition">Benefits</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition">Login</Link>
              <button className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed" disabled title="Coming Soon - Payment Integration Required">
                Get Started (Coming Soon)
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:bg-gray-50">Features</a>
              <a href="#benefits" className="block px-3 py-2 text-gray-600 hover:bg-gray-50">Benefits</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:bg-gray-50">Pricing</a>
              <Link to="/login" className="block px-3 py-2 text-gray-600 hover:bg-gray-50">Login</Link>
              <button className="block px-3 py-2 bg-gray-400 text-white text-center rounded-lg m-2 cursor-not-allowed" disabled>
                Get Started (Coming Soon)
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Send Smart Push Notifications That Drive{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Repeat Visits
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Increase customer engagement and repeat purchases with automated, targeted browser notifications.
              Self-hosted, privacy-focused, and easy to set up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-gray-400 text-white px-8 py-4 rounded-lg text-lg font-semibold cursor-not-allowed shadow-lg"
                disabled
                title="Coming Soon - Payment Integration Required"
              >
                Start Free Trial (Coming Soon)
              </button>
              <a
                href="#features"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
              >
                See How It Works
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              No credit card required • Self-hosted • Open source
            </p>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl p-1">
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                  <p className="text-gray-600 text-sm mt-1">Real-time notification performance</p>
                </div>

                {/* Stats Grid */}
                <div className="p-8">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* Stat Card 1 */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">👥</span>
                        <span className="text-green-600 text-xs font-semibold">↑ 12.5%</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Total Subscribers</div>
                      <div className="text-2xl font-bold text-gray-900">2,547</div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">🔔</span>
                        <span className="text-green-600 text-xs font-semibold">↑ 8.2%</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Notifications Sent</div>
                      <div className="text-2xl font-bold text-gray-900">1,842</div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">📈</span>
                        <span className="text-green-600 text-xs font-semibold">↑ 2.1%</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Click Rate</div>
                      <div className="text-2xl font-bold text-gray-900">23.8%</div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">💰</span>
                        <span className="text-green-600 text-xs font-semibold">↑ 15.3%</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Value Generated</div>
                      <div className="text-2xl font-bold text-gray-900">$4,287</div>
                    </div>
                  </div>

                  {/* Chart Preview */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="text-gray-600">Sent</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-gray-600">Delivered</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span className="text-gray-600">Clicked</span>
                        </div>
                      </div>
                    </div>

                    {/* Simple Chart Visualization */}
                    <div className="relative h-48 flex items-end justify-between gap-2">
                      {[40, 55, 65, 50, 70, 85, 95].map((height, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-blue-500 rounded-t" style={{ height: `${height}%` }}></div>
                          <div className="w-full bg-green-500" style={{ height: `${height * 0.95}%` }}></div>
                          <div className="w-full bg-yellow-500 rounded-b" style={{ height: `${height * 0.25}%` }}></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Notifications</h4>
                      <div className="space-y-2">
                        {['New Product Launch', 'Weekend Sale Alert', 'Blog Post Update'].map((title, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-gray-700">{title}</span>
                            <span className="text-green-600 font-semibold">Active</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Performing</h4>
                      <div className="space-y-2">
                        {[
                          { title: 'Flash Sale', rate: '34.2%' },
                          { title: 'New Feature', rate: '28.7%' },
                          { title: 'Weekly Update', rate: '24.1%' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-gray-700">{item.title}</span>
                            <span className="text-blue-600 font-semibold">{item.rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Websites
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to engage your audience and drive conversions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BellIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Notifications
              </h3>
              <p className="text-gray-600">
                Send targeted, personalized push notifications to the right users at the right time with advanced scheduling.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <RSSIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                RSS Automation
              </h3>
              <p className="text-gray-600">
                Automatically notify subscribers when you publish new content. Perfect for blogs and news sites.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <TargetIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Advanced Segmentation
              </h3>
              <p className="text-gray-600">
                Create audience segments based on behavior, location, device, and custom tags for precise targeting.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ChartIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600">
                Track impressions, clicks, and conversions with detailed analytics and performance metrics.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome Campaigns
              </h3>
              <p className="text-gray-600">
                Automate onboarding sequences with drip campaigns to engage new subscribers from day one.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Self-Hosted & Secure
              </h3>
              <p className="text-gray-600">
                Full control over your data with self-hosted deployment. GDPR compliant and privacy-focused.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose PushToolkit?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Built for businesses that value control, privacy, and performance. Get all the features of expensive SaaS platforms without the monthly fees.
              </p>

              <div className="space-y-4">
                {[
                  'No monthly subscription fees - you own it',
                  'Unlimited notifications and subscribers',
                  'Complete data ownership and privacy',
                  'Easy integration with any website',
                  'Advanced targeting and segmentation',
                  'Detailed analytics and reporting',
                  'RSS feed automation included',
                  'Regular updates and improvements'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Perfect For</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <RocketIcon className="h-6 w-6 mr-2" />
                    <h4 className="font-semibold text-lg">E-commerce Sites</h4>
                  </div>
                  <p className="text-blue-100">
                    Recover abandoned carts, promote sales, and drive repeat purchases
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <UsersIcon className="h-6 w-6 mr-2" />
                    <h4 className="font-semibold text-lg">Content Creators</h4>
                  </div>
                  <p className="text-blue-100">
                    Notify readers instantly when you publish new content
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <LightningIcon className="h-6 w-6 mr-2" />
                    <h4 className="font-semibold text-lg">SaaS Platforms</h4>
                  </div>
                  <p className="text-blue-100">
                    Re-engage users, announce features, and reduce churn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Self-host for free or let us handle the infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-8 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Self-Hosted</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited subscribers</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">All features included</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Your own infrastructure</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Community support</span>
                </li>
              </ul>
              <button
                className="block w-full text-center bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                disabled
                title="Coming Soon - Payment Integration Required"
              >
                Get Started (Coming Soon)
              </button>
            </div>

            {/* Starter Plan */}
            <div className="border-2 border-blue-600 rounded-xl p-8 relative hover:shadow-xl transition">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Managed Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 10,000 subscribers</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Fully managed hosting</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">99.9% uptime SLA</span>
                </li>
              </ul>
              <button
                className="block w-full text-center bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                disabled
                title="Coming Soon - Payment Integration Required"
              >
                Start Free Trial (Coming Soon)
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-8 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Managed Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 100,000 subscribers</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated infrastructure</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">24/7 priority support</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom integration help</span>
                </li>
              </ul>
              <button
                className="block w-full text-center bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                disabled
                title="Coming Soon - Payment Integration Required"
              >
                Start Free Trial (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Boost Your Engagement?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of websites using PushToolkit to re-engage their audience and drive conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-gray-400 text-white px-8 py-4 rounded-lg text-lg font-semibold cursor-not-allowed shadow-lg"
              disabled
              title="Coming Soon - Payment Integration Required"
            >
              Start Free Trial (Coming Soon)
            </button>
            <Link
              to="/login"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition border-2 border-white"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-6 text-blue-100">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <BellIcon className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-white">PushToolkit</span>
              </div>
              <p className="text-sm">
                Self-hosted push notification platform for modern websites.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><span className="text-gray-600 cursor-not-allowed" title="Coming Soon">Sign Up (Coming Soon)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 PushToolkit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

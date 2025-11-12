import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSiteStore from '../stores/siteStore';
import { sitesService } from '../services/sites';
import ImageUpload from '../components/ImageUpload';
import { InlineTooltip } from '../components/Tooltip';
import { tooltips } from '../data/helpContent';

function Settings() {
  const queryClient = useQueryClient();
  const currentSite = useSiteStore((state) => state.currentSite);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    language: 'en',
    timezone: 'UTC',
    valueCurrency: 'USD',
    valuePerSubscriber: '',
    valuePerClick: '',
  });

  // Update form when currentSite changes
  useEffect(() => {
    if (currentSite) {
      setFormData({
        name: currentSite.name || '',
        url: currentSite.url || '',
        icon: currentSite.settings?.icon || '',
        language: currentSite.settings?.language || 'en',
        timezone: currentSite.settings?.timezone || 'UTC',
        valueCurrency: currentSite.settings?.valueCurrency || 'USD',
        valuePerSubscriber: currentSite.settings?.valuePerSubscriber || '',
        valuePerClick: currentSite.settings?.valuePerClick || '',
      });
    }
  }, [currentSite]);
  const [showCode, setShowCode] = useState(false);

  const { data: installCode } = useQuery({
    queryKey: ['install-code', currentSite?.id],
    queryFn: () => sitesService.getInstallCode(currentSite.id),
    enabled: !!currentSite && showCode,
  });

  const updateSiteMutation = useMutation({
    mutationFn: (data) => sitesService.updateSite(currentSite.id, data),
    onSuccess: (response) => {
      // Backend returns { success: true, data: { site } }
      const updatedSite = response.data.site;

      // Update the current site in the store
      useSiteStore.getState().setCurrentSite(updatedSite);

      // Invalidate and refetch
      queryClient.invalidateQueries(['sites']);
      alert('Settings updated successfully!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSiteMutation.mutate({
      name: formData.name,
      url: formData.url,
      settings: {
        icon: formData.icon,
        language: formData.language,
        timezone: formData.timezone,
        valueCurrency: formData.valueCurrency,
        valuePerSubscriber: formData.valuePerSubscriber ? parseFloat(formData.valuePerSubscriber) : 0,
        valuePerClick: formData.valuePerClick ? parseFloat(formData.valuePerClick) : 0,
      },
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!currentSite) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a site to view settings</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Site Settings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('installation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'installation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Installation
          </button>
          <button
            onClick={() => setActiveTab('vapid')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vapid'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            VAPID Keys
          </button>
        </nav>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">General Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <InlineTooltip
                label="Site Name"
                tooltip={tooltips.settings.siteName}
                required
                htmlFor="site-name"
              />
              <input
                id="site-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <InlineTooltip
                label="Website URL"
                tooltip={tooltips.settings.websiteUrl}
                required
                htmlFor="website-url"
              />
              <input
                id="website-url"
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <InlineTooltip
                label="Notification Icon"
                tooltip={tooltips.settings.notificationIcon}
                htmlFor="notification-icon"
              />
              <ImageUpload
                value={formData.icon}
                onChange={(url) => setFormData({ ...formData, icon: url })}
                label=""
                helpText="Default icon for all notifications. Recommended: 192x192px square image"
              />
            </div>

            <div>
              <InlineTooltip
                label="Primary Site Language"
                tooltip={tooltips.settings.primaryLanguage}
                htmlFor="language"
              />
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="it">Italian (Italiano)</option>
                <option value="pt">Portuguese (Português)</option>
                <option value="pt-BR">Portuguese - Brazil (Português)</option>
                <option value="nl">Dutch (Nederlands)</option>
                <option value="pl">Polish (Polski)</option>
                <option value="ru">Russian (Русский)</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="ko">Korean (한국어)</option>
                <option value="zh">Chinese - Simplified (简体中文)</option>
                <option value="zh-TW">Chinese - Traditional (繁體中文)</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="tr">Turkish (Türkçe)</option>
                <option value="vi">Vietnamese (Tiếng Việt)</option>
                <option value="th">Thai (ไทย)</option>
                <option value="id">Indonesian (Bahasa Indonesia)</option>
                <option value="ms">Malay (Bahasa Melayu)</option>
                <option value="sv">Swedish (Svenska)</option>
                <option value="da">Danish (Dansk)</option>
                <option value="no">Norwegian (Norsk)</option>
                <option value="fi">Finnish (Suomi)</option>
                <option value="cs">Czech (Čeština)</option>
                <option value="el">Greek (Ελληνικά)</option>
                <option value="he">Hebrew (עברית)</option>
                <option value="uk">Ukrainian (Українська)</option>
                <option value="ro">Romanian (Română)</option>
                <option value="hu">Hungarian (Magyar)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Default language for notifications and content
              </p>
            </div>

            <div>
              <InlineTooltip
                label="Timezone"
                tooltip={tooltips.settings.timezone}
                htmlFor="timezone"
              />
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>

            {/* Value Goals Section */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Value Goals</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track the monetary value generated by push notifications. Set values below and view total value in your dashboard.
              </p>

              <div className="space-y-4">
                <div>
                  <InlineTooltip
                    label="Value Currency"
                    tooltip={tooltips.settings.valueCurrency}
                    htmlFor="valueCurrency"
                  />
                  <select
                    id="valueCurrency"
                    name="valueCurrency"
                    value={formData.valueCurrency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">United States Dollar</option>
                    <option value="EUR">Euro</option>
                    <option value="GBP">British Pound</option>
                    <option value="JPY">Japanese Yen</option>
                    <option value="CAD">Canadian Dollar</option>
                    <option value="AUD">Australian Dollar</option>
                  </select>
                </div>

                <div>
                  <InlineTooltip
                    label="Value Per New Subscriber"
                    tooltip={tooltips.settings.valuePerSubscriber}
                    htmlFor="valuePerSubscriber"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      id="valuePerSubscriber"
                      type="number"
                      name="valuePerSubscriber"
                      value={formData.valuePerSubscriber}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="1.50"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <InlineTooltip
                    label="Value Per Notification Click"
                    tooltip={tooltips.settings.valuePerClick}
                    htmlFor="valuePerClick"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      id="valuePerClick"
                      type="number"
                      name="valuePerClick"
                      value={formData.valuePerClick}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="0.05"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateSiteMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {updateSiteMutation.isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      )}

      {/* Installation Tab */}
      {activeTab === 'installation' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Installation Code</h2>
          <p className="text-gray-600 mb-4">
            Add this code to your website's HTML, just before the closing &lt;/body&gt; tag:
          </p>

          {!showCode ? (
            <button
              onClick={() => setShowCode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Show Installation Code
            </button>
          ) : installCode ? (
            <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">{installCode.data?.installCode || installCode.installCode}</pre>
            </div>
          ) : (
            <p className="text-gray-500">Loading code...</p>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Copy the code above and paste it into your website</li>
              <li>Deploy your website changes</li>
              <li>Visit your website and allow notifications when prompted</li>
              <li>Check the Subscribers page to see your first subscriber!</li>
            </ol>
          </div>
        </div>
      )}

      {/* VAPID Keys Tab */}
      {activeTab === 'vapid' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">VAPID Keys</h2>
          <p className="text-gray-600 mb-4">
            VAPID keys are used to authenticate your push notifications. These were automatically
            generated when you created this site.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key
              </label>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
                {currentSite.vapid_public_key}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Key
              </label>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                ••••••••••••••••••••••••••••••••
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Private key is encrypted and hidden for security
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Do not share your private VAPID key. It's used to sign
              push notifications from your server.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;

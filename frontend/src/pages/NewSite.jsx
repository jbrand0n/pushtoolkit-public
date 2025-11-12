import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sitesService } from '../services/sites';
import useSiteStore from '../stores/siteStore';

function NewSite() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setSites, setCurrentSite } = useSiteStore();

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    timezone: 'UTC',
  });

  const createSiteMutation = useMutation({
    mutationFn: (data) => sitesService.createSite(data),
    onSuccess: (response) => {
      // Backend returns { success: true, data: { site } }
      const newSite = response.data.site;

      // Update sites list immediately
      queryClient.setQueryData(['sites'], (old) => {
        const sites = old?.data?.sites || [];
        return {
          ...old,
          data: {
            sites: [...sites, newSite]
          }
        };
      });

      // Set as current site
      setCurrentSite(newSite);

      alert('Site created successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      alert(error.response?.data?.error?.message || 'Failed to create site');
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for API
    const siteData = {
      name: formData.name,
      url: formData.url,
      settings: {
        icon: formData.icon || undefined,
        timezone: formData.timezone,
      },
    };

    createSiteMutation.mutate(siteData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Site</h1>
            <p className="text-gray-600 mt-2">
              Add a website to start sending push notifications
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Site Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Awesome Website"
              />
              <p className="text-xs text-gray-500 mt-1">
                A friendly name to identify your site
              </p>
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL *
              </label>
              <input
                id="url"
                name="url"
                type="url"
                required
                value={formData.url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                The full URL of your website (including https://)
              </p>
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                Notification Icon URL (Optional)
              </label>
              <input
                id="icon"
                name="icon"
                type="url"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Icon to display in notifications (recommended: 192x192px)
              </p>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                Timezone *
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Australia/Sydney">Sydney (AEDT)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Used for scheduling notifications
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createSiteMutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createSiteMutation.isPending ? 'Creating...' : 'Create Site'}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Your site will be created with unique VAPID keys</li>
              <li>You'll get installation code to add to your website</li>
              <li>Visitors can subscribe to receive push notifications</li>
              <li>You can start sending notifications right away!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewSite;

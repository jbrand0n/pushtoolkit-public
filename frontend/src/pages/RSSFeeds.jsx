import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSiteStore from '../stores/siteStore';
import { rssService } from '../services/rss';
import { segmentsService } from '../services/segments';
import ImageUpload from '../components/ImageUpload';

function RSSFeeds() {
  const queryClient = useQueryClient();
  const currentSite = useSiteStore((state) => state.currentSite);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    iconUrl: '',
    utmParams: {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
    },
    showActionButtons: false,
    createDraft: false,
    maxPushesPerDay: '',
    segmentId: '',
  });

  const { data: feedsResponse, isLoading } = useQuery({
    queryKey: ['rss-feeds', currentSite?.id],
    queryFn: () => rssService.getFeeds(currentSite.id),
    enabled: !!currentSite,
  });

  // Extract feeds array from backend response
  const feeds = feedsResponse?.data?.feeds || [];

  // Get segments for targeting
  const { data: segmentsResponse } = useQuery({
    queryKey: ['segments', currentSite?.id],
    queryFn: () => segmentsService.getSegments(currentSite.id),
    enabled: !!currentSite,
  });
  const segments = segmentsResponse?.data?.segments || [];

  const createMutation = useMutation({
    mutationFn: (data) => rssService.createFeed(currentSite.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['rss-feeds']);
      setShowForm(false);
      setFormData({
        name: '',
        url: '',
        iconUrl: '',
        utmParams: { utm_source: '', utm_medium: '', utm_campaign: '' },
        showActionButtons: false,
        createDraft: false,
        maxPushesPerDay: '',
        segmentId: '',
      });
      alert('RSS feed added successfully!');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => rssService.toggleFeed(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(['rss-feeds']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => rssService.deleteFeed(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['rss-feeds']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleToggle = (feed) => {
    toggleMutation.mutate({
      id: feed.id,
      isActive: !feed.is_active,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this RSS feed?')) {
      deleteMutation.mutate(id);
    }
  };

  if (!currentSite) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a site to view RSS feeds</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RSS Feeds</h1>
          <p className="text-gray-600 mt-1">
            Automatically send notifications for new RSS feed items
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Feed'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Create RSS Feed-to-Push</h2>
          <p className="text-sm text-gray-600 mb-6">
            Automatically send notifications when you publish new blog content
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium text-gray-700">Active</label>
              <input
                type="checkbox"
                checked={!formData.createDraft}
                onChange={(e) =>
                  setFormData({ ...formData, createDraft: !e.target.checked })
                }
                className="w-10 h-6 rounded-full"
              />
            </div>

            {/* Feed Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feed Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Blog Feed"
              />
            </div>

            {/* RSS Feed URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RSS Feed URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/feed.xml"
              />
            </div>

            {/* Feed Icon */}
            <div>
              <ImageUpload
                value={formData.iconUrl}
                onChange={(url) => setFormData({ ...formData, iconUrl: url })}
                label="Feed Icon"
                helpText="Icon for notifications from this RSS feed (192px x 192px recommended)"
              />
            </div>

            {/* UTM Parameters */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  UTM params
                </label>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  title="Add UTM tracking parameters to notification URLs"
                >
                  ⓘ
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={formData.utmParams.utm_source}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      utmParams: { ...formData.utmParams, utm_source: e.target.value },
                    })
                  }
                  placeholder="utm_source"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={formData.utmParams.utm_medium}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      utmParams: { ...formData.utmParams, utm_medium: e.target.value },
                    })
                  }
                  placeholder="utm_medium"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={formData.utmParams.utm_campaign}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      utmParams: {
                        ...formData.utmParams,
                        utm_campaign: e.target.value,
                      },
                    })
                  }
                  placeholder="utm_campaign"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* RSS Feed Format Example */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                Please make sure that you are using a{' '}
                <span className="font-semibold">RSS Feed</span> to schedule this
                notification. Below is an example item feed.
              </p>
              <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
{`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Example Feed</title>
    <link>https://www.example.com/</link>
    <description>This is an Example Feed</description>
    <item>
      <title>An Example Title</title>
      <link>https://www.example.com/signup/</link>
      <description>An Example Message</description>
      <pubDate>Mon, 28 Jun 2020 01:49:15 +0000</pubDate>
      <enclosure url="https://via.placeholder.com/150" type="image/jpeg" />
      <category><![CDATA[TAG1]]]></category>
    </item>
  </channel>
</rss>`}
              </pre>
            </div>

            {/* Show Action Buttons */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showActionButtons"
                checked={formData.showActionButtons}
                onChange={(e) =>
                  setFormData({ ...formData, showActionButtons: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="showActionButtons" className="text-sm text-gray-700">
                Show Action Buttons
              </label>
            </div>

            {/* Create Draft */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="createDraft"
                checked={formData.createDraft}
                onChange={(e) =>
                  setFormData({ ...formData, createDraft: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="createDraft" className="text-sm text-gray-700">
                Create Draft notification of each new blogpost
              </label>
            </div>

            {/* Maximum RSS Pushes Per Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum RSS Pushes Per Day
              </label>
              <input
                type="number"
                value={formData.maxPushesPerDay}
                onChange={(e) =>
                  setFormData({ ...formData, maxPushesPerDay: e.target.value })
                }
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max Pushes Per Day"
              />
            </div>

            {/* Targeting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Targeting
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="targeting"
                    checked={!formData.segmentId}
                    onChange={() => setFormData({ ...formData, segmentId: '' })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Send to all subscribers</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="targeting"
                    checked={!!formData.segmentId}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Send to new segment...</span>
                </label>
                {formData.segmentId && (
                  <select
                    value={formData.segmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, segmentId: e.target.value })
                    }
                    className="ml-6 mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a segment</option>
                    {segments.map((segment) => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Saving...' : 'Save RSS Feed'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feeds List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading RSS feeds...</div>
        ) : !feeds || feeds.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No RSS feeds yet</p>
            <p className="text-sm text-gray-400">
              Add RSS feeds to automatically notify subscribers about new content
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {feeds.map((feed) => (
              <div key={feed.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feed.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          feed.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {feed.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 break-all"
                    >
                      {feed.url}
                    </a>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      {feed.last_fetched_at ? (
                        <span>
                          Last checked: {new Date(feed.last_fetched_at).toLocaleString()}
                        </span>
                      ) : (
                        <span>Not checked yet</span>
                      )}
                      {feed.last_item_guid && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Last item: {feed.last_item_guid.substring(0, 20)}...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggle(feed)}
                      className={`px-3 py-1 text-sm rounded ${
                        feed.is_active
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {feed.is_active ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(feed.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">How RSS Feeds Work</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>System checks your RSS feeds every 15 minutes for new content</li>
          <li>When new items are detected, automatic notifications are created and sent</li>
          <li>Perfect for blogs, news sites, and content publishers</li>
          <li>Subscribers get notified instantly when you publish new content</li>
          <li>Can be paused or deleted at any time</li>
        </ul>
      </div>
    </div>
  );
}

export default RSSFeeds;

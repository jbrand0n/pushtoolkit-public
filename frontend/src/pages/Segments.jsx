import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSiteStore from '../stores/siteStore';
import { segmentsService } from '../services/segments';

function Segments() {
  const queryClient = useQueryClient();
  const currentSite = useSiteStore((state) => state.currentSite);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rules: {
      browser: '',
      os: '',
      country: '',
      subscribed_days_ago: '',
    },
  });

  const { data: segmentsResponse, isLoading } = useQuery({
    queryKey: ['segments', currentSite?.id],
    queryFn: () => segmentsService.getSegments(currentSite.id),
    enabled: !!currentSite,
  });

  // Extract segments array from backend response
  const segments = segmentsResponse?.data?.segments || [];

  const createMutation = useMutation({
    mutationFn: (data) => segmentsService.createSegment(currentSite.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['segments']);
      setShowForm(false);
      setFormData({
        name: '',
        rules: { browser: '', os: '', country: '', subscribed_days_ago: '' },
      });
      alert('Segment created successfully!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => segmentsService.deleteSegment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['segments']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out empty rules
    const cleanedRules = Object.entries(formData.rules)
      .filter(([, value]) => value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    createMutation.mutate({
      name: formData.name,
      rules: cleanedRules,
    });
  };

  const handleRuleChange = (field, value) => {
    setFormData({
      ...formData,
      rules: {
        ...formData.rules,
        [field]: value,
      },
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this segment?')) {
      deleteMutation.mutate(id);
    }
  };

  if (!currentSite) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a site to view segments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Segments</h1>
          <p className="text-gray-600 mt-1">
            Target specific groups of subscribers with custom rules
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ New Segment'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Create Segment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segment Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chrome Users"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Targeting Rules</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add one or more rules to define your segment. Leave empty to skip.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Browser
                  </label>
                  <select
                    value={formData.rules.browser}
                    onChange={(e) => handleRuleChange('browser', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Browser</option>
                    <option value="Chrome">Chrome</option>
                    <option value="Firefox">Firefox</option>
                    <option value="Safari">Safari</option>
                    <option value="Edge">Edge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating System
                  </label>
                  <select
                    value={formData.rules.os}
                    onChange={(e) => handleRuleChange('os', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any OS</option>
                    <option value="Windows">Windows</option>
                    <option value="macOS">macOS</option>
                    <option value="Linux">Linux</option>
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.rules.country}
                    onChange={(e) => handleRuleChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="US, UK, CA..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscribed Days Ago
                  </label>
                  <input
                    type="number"
                    value={formData.rules.subscribed_days_ago}
                    onChange={(e) => handleRuleChange('subscribed_days_ago', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 7 for users subscribed 7+ days ago"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Segment'}
            </button>
          </form>
        </div>
      )}

      {/* Segments List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading segments...</div>
        ) : !segments || segments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No segments yet</p>
            <p className="text-sm text-gray-400">
              Create segments to target specific groups of subscribers with your notifications
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {segments.map((segment) => (
              <div key={segment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {segment.name}
                      </h3>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {segment.estimated_count || 0} subscribers
                      </span>
                    </div>

                    {/* Display Rules */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(segment.rules || {}).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {key.replace(/_/g, ' ')}: <strong>{value}</strong>
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Updated {new Date(segment.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(segment.id)}
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
        <h3 className="font-medium text-blue-900 mb-2">Segment Targeting</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>Create custom subscriber segments based on various criteria</li>
          <li>Target notifications to specific browsers, operating systems, or countries</li>
          <li>Filter by subscription date to reach new or long-time subscribers</li>
          <li>Combine multiple rules for precise targeting</li>
        </ul>
      </div>
    </div>
  );
}

export default Segments;

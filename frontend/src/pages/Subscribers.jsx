import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSiteStore from '../stores/siteStore';
import { subscribersService } from '../services/subscribers';

function Subscribers() {
  const queryClient = useQueryClient();
  const currentSite = useSiteStore((state) => state.currentSite);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  const { data: subscribersResponse, isLoading } = useQuery({
    queryKey: ['subscribers', currentSite?.id, filterActive],
    queryFn: () => subscribersService.getSubscribers(currentSite.id, {
      is_active: filterActive === 'all' ? undefined : filterActive === 'active'
    }),
    enabled: !!currentSite,
  });

  // Extract subscribers array from backend response
  const subscribers = subscribersResponse?.data?.subscribers || [];

  const unsubscribeMutation = useMutation({
    mutationFn: (subscriberId) => subscribersService.unsubscribe(subscriberId),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers']);
      alert('Subscriber removed successfully');
    },
  });

  const handleUnsubscribe = (subscriberId) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      unsubscribeMutation.mutate(subscriberId);
    }
  };

  if (!currentSite) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a site to view subscribers</p>
      </div>
    );
  }

  const filteredSubscribers = subscribers?.filter(sub =>
    sub.metadata?.user_agent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.country?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-gray-600 mt-1">
            {subscribers?.length || 0} total subscribers
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by browser or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterActive('all')}
              className={`px-4 py-2 rounded ${
                filterActive === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterActive('active')}
              className={`px-4 py-2 rounded ${
                filterActive === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterActive('inactive')}
              className={`px-4 py-2 rounded ${
                filterActive === 'inactive'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Subscribers Table/Cards */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading subscribers...</div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {subscribers?.length === 0 ? 'No subscribers yet' : 'No subscribers match your filters'}
          </div>
        ) : (
          <>
            {/* Desktop Table View - hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Browser
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Seen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subscriber.browser || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subscriber.os || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subscriber.country || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.last_seen_at
                          ? new Date(subscriber.last_seen_at).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscriber.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleUnsubscribe(subscriber.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - visible only on mobile */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {subscriber.browser || 'Unknown'}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          subscriber.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {subscriber.os || 'Unknown'} • {subscriber.country || 'Unknown'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnsubscribe(subscriber.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Subscribed:</span>
                      <div className="text-gray-900">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Seen:</span>
                      <div className="text-gray-900">
                        {subscriber.last_seen_at
                          ? new Date(subscriber.last_seen_at).toLocaleDateString()
                          : 'Never'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Subscribers;

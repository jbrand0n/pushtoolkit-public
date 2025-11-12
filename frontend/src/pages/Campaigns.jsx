import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSiteStore from '../stores/siteStore';
import { campaignsService } from '../services/campaigns';

function Campaigns() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentSite = useSiteStore((state) => state.currentSite);

  const { data: campaignsResponse, isLoading } = useQuery({
    queryKey: ['campaigns', currentSite?.id],
    queryFn: () => campaignsService.getCampaigns(currentSite.id),
    enabled: !!currentSite,
  });

  // Extract campaigns array from backend response
  const campaigns = campaignsResponse?.data?.campaigns || [];

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => campaignsService.toggleCampaign(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => campaignsService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
    },
  });

  const handleToggle = (campaign) => {
    toggleMutation.mutate({
      id: campaign.id,
      isActive: !campaign.is_active,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteMutation.mutate(id);
    }
  };

  if (!currentSite) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a site to view campaigns</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Campaigns</h1>
          <p className="text-gray-600 mt-1">
            Automated notification sequences for new subscribers
          </p>
        </div>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Campaign
        </button>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading campaigns...</div>
        ) : !campaigns || campaigns.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No campaigns yet</p>
            <p className="text-sm text-gray-400">
              Welcome campaigns automatically send a series of notifications to new subscribers
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          campaign.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {campaign.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Created {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                    {campaign.steps_count > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {campaign.steps_count} notification{campaign.steps_count > 1 ? 's' : ''} in sequence
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(campaign)}
                      className={`px-3 py-1 text-sm rounded ${
                        campaign.is_active
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {campaign.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Edit Steps
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Campaign Steps Preview */}
                {campaign.steps && campaign.steps.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200">
                    {campaign.steps.map((step, index) => (
                      <div key={step.id} className="mb-3 last:mb-0">
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700">
                            Step {index + 1}:
                          </span>
                          <span className="ml-2 text-gray-600">
                            Send after {step.delay_minutes} minutes
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">How Welcome Campaigns Work</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>Automatically triggered when a new user subscribes</li>
          <li>Send a sequence of notifications with customizable delays</li>
          <li>Perfect for onboarding, product education, and engagement</li>
          <li>Can be activated or deactivated at any time</li>
        </ul>
      </div>
    </div>
  );
}

export default Campaigns;

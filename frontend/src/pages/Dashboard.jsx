import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import useSiteStore from '../stores/siteStore';
import { analyticsService } from '../services/analytics';
import { notificationsService } from '../services/notifications';
import { campaignsService } from '../services/campaigns';
import StatCard from '../components/StatCard';
import Tooltip from '../components/Tooltip';
import { tooltips } from '../data/helpContent';

function Dashboard() {
  const currentSite = useSiteStore((state) => state.currentSite);

  const { data: metricsResponse, isLoading } = useQuery({
    queryKey: ['dashboard-metrics', currentSite?.id],
    queryFn: () => analyticsService.getDashboardMetrics(currentSite.id),
    enabled: !!currentSite,
  });

  // Fetch recurring notifications
  const { data: recurringResponse } = useQuery({
    queryKey: ['recurring-notifications', currentSite?.id],
    queryFn: () => notificationsService.getNotifications(currentSite.id, { type: 'RECURRING' }),
    enabled: !!currentSite,
  });

  // Fetch active campaigns
  const { data: campaignsResponse } = useQuery({
    queryKey: ['dashboard-campaigns', currentSite?.id],
    queryFn: () => campaignsService.getCampaigns(currentSite.id),
    enabled: !!currentSite,
  });

  // Extract metrics from backend response
  const metrics = metricsResponse?.data;
  const recurringNotifications = recurringResponse?.data?.notifications || [];
  const campaigns = campaignsResponse?.data?.campaigns || [];

  if (!currentSite) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Site Selected
        </h2>
        <p className="text-gray-600 mb-8">
          Create or select a site to view analytics
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  const chartData = metrics?.chart || [
    { date: '2024-01-01', sent: 100, delivered: 95, clicked: 20 },
    { date: '2024-01-02', sent: 150, delivered: 140, clicked: 30 },
    { date: '2024-01-03', sent: 200, delivered: 190, clicked: 45 },
    { date: '2024-01-04', sent: 180, delivered: 175, clicked: 40 },
    { date: '2024-01-05', sent: 220, delivered: 210, clicked: 55 },
    { date: '2024-01-06', sent: 250, delivered: 240, clicked: 60 },
    { date: '2024-01-07', sent: 300, delivered: 285, clicked: 75 },
  ];

  const engagementData = metrics?.engagement || [
    { name: 'Mon', clicks: 40 },
    { name: 'Tue', clicks: 55 },
    { name: 'Wed', clicks: 65 },
    { name: 'Thu', clicks: 50 },
    { name: 'Fri', clicks: 70 },
    { name: 'Sat', clicks: 45 },
    { name: 'Sun', clicks: 35 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your notification performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Subscribers"
          value={metrics?.totalSubscribers?.toLocaleString() || '0'}
          change={12.5}
          icon="👥"
          trend="up"
          tooltip={tooltips.dashboard.totalSubscribers}
        />
        <StatCard
          title="Notifications Sent"
          value={metrics?.notificationsSent?.toLocaleString() || '0'}
          change={8.2}
          icon="🔔"
          trend="up"
          tooltip={tooltips.dashboard.notificationsSent}
        />
        <StatCard
          title="Click Rate"
          value={`${metrics?.clickRate || 0}%`}
          change={2.1}
          icon="📈"
          trend="up"
          tooltip={tooltips.dashboard.clickRate}
        />
        <StatCard
          title="Value Generated"
          value={`$${metrics?.valueGenerated?.toLocaleString() || '0'}`}
          change={15.3}
          icon="💰"
          trend="up"
          tooltip={tooltips.dashboard.valueGenerated}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications Performance
            </h3>
            <Tooltip content={tooltips.dashboard.notificationChart} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="clicked" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement by Day */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Weekly Engagement
            </h3>
            <Tooltip content={tooltips.dashboard.engagementChart} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Bar dataKey="clicks" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Notifications
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {metrics?.recentNotifications?.length > 0 ? (
              metrics.recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sent {new Date(notification.sent_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.click_rate}% CTR
                    </p>
                    <p className="text-xs text-gray-600">
                      {notification.sent_count} sent
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No notifications sent yet. Create your first notification!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recurring Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recurring Notifications
          </h3>
          <Link
            to="/notifications/new"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + New
          </Link>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recurringNotifications.length > 0 ? (
              recurringNotifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      {notification.recurringSchedule && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {notification.recurringSchedule.intervalType === 'DAILY' && `Every ${notification.recurringSchedule.intervalValue} day(s)`}
                            {notification.recurringSchedule.intervalType === 'WEEKLY' && `Every ${notification.recurringSchedule.intervalValue} week(s)`}
                            {notification.recurringSchedule.intervalType === 'MONTHLY' && `Every ${notification.recurringSchedule.intervalValue} month(s)`}
                          </span>
                          {notification.recurringSchedule.isActive ? (
                            <span className="text-xs text-green-600 font-medium">Active</span>
                          ) : (
                            <span className="text-xs text-gray-500 font-medium">Inactive</span>
                          )}
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/notifications/${notification.id}/edit`}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No recurring notifications yet</p>
                <Link
                  to="/notifications/new"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Recurring Notification
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Campaigns */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Welcome Campaigns
          </h3>
          <Link
            to="/campaigns/new"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + New
          </Link>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {campaigns.length > 0 ? (
              campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        {campaign.is_active ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {campaign.steps?.length || 0} step(s)
                      </p>
                      {campaign.created_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Created {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/campaigns`}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No campaigns yet</p>
                <Link
                  to="/campaigns/new"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Welcome Campaign
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

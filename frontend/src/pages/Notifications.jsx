import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useSiteStore from '../stores/siteStore';
import { notificationsService } from '../services/notifications';

function Notifications() {
  const queryClient = useQueryClient();
  const currentSite = useSiteStore((state) => state.currentSite);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['notifications', currentSite?.id, statusFilter],
    queryFn: () => notificationsService.getNotifications(currentSite.id, {
      status: statusFilter === 'all' ? undefined : statusFilter
    }),
    enabled: !!currentSite,
  });

  // Extract notifications array from backend response
  const notifications = notificationsResponse?.data?.notifications || [];

  const sendNotificationMutation = useMutation({
    mutationFn: (notificationId) => notificationsService.sendNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      alert('Notification sent successfully!');
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId) => notificationsService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const handleSend = (notificationId) => {
    if (window.confirm('Are you sure you want to send this notification?')) {
      sendNotificationMutation.mutate(notificationId);
    }
  };

  const handleDelete = (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      deleteNotificationMutation.mutate(notificationId);
    }
  };

  if (!currentSite) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a site to view notifications</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || styles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {notifications?.length || 0} notifications
          </p>
        </div>
        <Link
          to="/notifications/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create Notification
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'draft', 'scheduled', 'sending', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded capitalize ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading notifications...</div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No notifications yet</p>
            <Link
              to="/notifications/new"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Your First Notification
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {getStatusBadge(notification.status)}
                      {notification.type !== 'one_time' && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {notification.type}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Created {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                      {notification.scheduled_at && (
                        <span>
                          Scheduled for {new Date(notification.scheduled_at).toLocaleString()}
                        </span>
                      )}
                      {notification.sent_at && (
                        <span>
                          Sent {new Date(notification.sent_at).toLocaleString()}
                        </span>
                      )}
                      {notification.type === 'RECURRING' && notification.recurringSchedule && (
                        <span className="font-medium text-purple-600">
                          Repeats every {notification.recurringSchedule.intervalValue} {notification.recurringSchedule.intervalType.toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {notification.status === 'draft' && (
                      <button
                        onClick={() => handleSend(notification.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Send Now
                      </button>
                    )}
                    <Link
                      to={`/notifications/${notification.id}/edit`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      {['draft', 'scheduled'].includes(notification.status) ? 'Edit' : 'View'}
                    </Link>
                    {['draft', 'scheduled'].includes(notification.status) && (
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;

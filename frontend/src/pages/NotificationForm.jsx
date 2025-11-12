import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSiteStore from '../stores/siteStore';
import { notificationsService } from '../services/notifications';
import { segmentsService } from '../services/segments';
import NotificationPreview from '../components/NotificationPreview';
import ImageUpload from '../components/ImageUpload';
import { InlineTooltip } from '../components/Tooltip';
import { tooltips } from '../data/helpContent';

function NotificationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const currentSite = useSiteStore((state) => state.currentSite);
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    type: 'ONE_TIME',
    title: '',
    message: '',
    destination_url: '',
    icon_url: '',
    image_url: '',
    segment_id: null,
    scheduled_at: '',
    showLargeImage: false,
    showActionButtons: false,
    // Recurring fields
    recurring_interval_type: 'DAILY',
    recurring_interval_value: '1',
    recurring_start_date: '',
    recurring_end_date: '',
  });

  const { data: notificationResponse } = useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationsService.getNotification(id),
    enabled: isEdit,
  });

  const { data: segmentsResponse } = useQuery({
    queryKey: ['segments', currentSite?.id],
    queryFn: () => segmentsService.getSegments(currentSite.id),
    enabled: !!currentSite,
  });

  // Extract data from backend responses
  const notification = notificationResponse?.data?.notification;
  const segments = segmentsResponse?.data?.segments || [];

  useEffect(() => {
    if (notification) {
      setFormData({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        destination_url: notification.destination_url || '',
        icon_url: notification.icon_url || '',
        image_url: notification.image_url || '',
        segment_id: notification.segment_id || null,
        scheduled_at: notification.scheduled_at
          ? new Date(notification.scheduled_at).toISOString().slice(0, 16)
          : '',
        showLargeImage: !!notification.image_url,
        showActionButtons: false,
        // Recurring fields
        recurring_interval_type: notification.recurringSchedule?.intervalType || 'DAILY',
        recurring_interval_value: notification.recurringSchedule?.intervalValue?.toString() || '1',
        recurring_start_date: notification.recurringSchedule?.startDate
          ? new Date(notification.recurringSchedule.startDate).toISOString().slice(0, 16)
          : '',
        recurring_end_date: notification.recurringSchedule?.endDate
          ? new Date(notification.recurringSchedule.endDate).toISOString().slice(0, 16)
          : '',
      });
    }
  }, [notification]);

  const createMutation = useMutation({
    mutationFn: (data) => notificationsService.createNotification(currentSite.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      alert('Notification created successfully!');
      navigate('/notifications');
    },
    onError: (error) => {
      alert(error.response?.data?.error?.message || 'Failed to create notification');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => notificationsService.updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      alert('Notification updated successfully!');
      navigate('/notifications');
    },
    onError: (error) => {
      alert(error.response?.data?.error?.message || 'Failed to update notification');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      type: formData.type,
      title: formData.title,
      message: formData.message,
      destination_url: formData.destination_url,
      icon_url: formData.icon_url || null,
      image_url: formData.showLargeImage ? formData.image_url : null,
      segment_id: formData.segment_id || null,
      status: 'DRAFT',
      scheduled_at: formData.scheduled_at || null,
    };

    // Add recurring schedule data if type is RECURRING
    if (formData.type === 'RECURRING') {
      data.recurring_schedule = {
        interval_type: formData.recurring_interval_type,
        interval_value: parseInt(formData.recurring_interval_value),
        start_date: formData.recurring_start_date,
        end_date: formData.recurring_end_date || null,
      };
    }

    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (!currentSite) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a site</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Notification' : 'Create Push Notification'}
        </h1>
        <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">
          {isEdit ? 'Update your notification details' : 'Send a targeted push notification to your subscribers'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Notification Type & Segment */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InlineTooltip
                    label="Notification Type"
                    tooltip={`${tooltips.notifications.oneTime} For recurring: ${tooltips.notifications.recurring}`}
                  />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ONE_TIME">One Time</option>
                    <option value="RECURRING">Recurring</option>
                    <option value="TRIGGERED">Triggered</option>
                  </select>
                </div>

                <div>
                  <InlineTooltip
                    label="Target Segment"
                    tooltip={tooltips.notifications.targetSegment}
                  />
                  <select
                    name="segment_id"
                    value={formData.segment_id || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Subscribers</option>
                    {segments?.map((segment) => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Content */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Content</h2>

              {/* Title */}
              <div>
                <InlineTooltip
                  label="Notification Title"
                  tooltip={tooltips.notifications.title}
                  required
                  htmlFor="title"
                />
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  placeholder="Limited Time Offer!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/50 characters</p>
              </div>

              {/* Message */}
              <div>
                <InlineTooltip
                  label="Notification Message"
                  tooltip={tooltips.notifications.message}
                  required
                  htmlFor="message"
                />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  rows={3}
                  placeholder="Get 50% off on all products this weekend only!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.message.length}/150 characters</p>
              </div>

              {/* Destination URL */}
              <div>
                <InlineTooltip
                  label="Destination URL"
                  tooltip={tooltips.notifications.destinationUrl}
                  required
                  htmlFor="destination_url"
                />
                <input
                  id="destination_url"
                  type="url"
                  name="destination_url"
                  value={formData.destination_url}
                  onChange={handleChange}
                  required
                  placeholder="https://example.com/sale"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Icon */}
              <div>
                <InlineTooltip
                  label="Icon URL"
                  tooltip={tooltips.notifications.iconUrl}
                  htmlFor="icon"
                />
                <ImageUpload
                  value={formData.icon_url}
                  onChange={(url) => setFormData({ ...formData, icon_url: url })}
                  label=""
                  helpText="192x192px recommended, defaults to site icon if not set"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <InlineTooltip
                    label="Show Large Image"
                    tooltip={tooltips.notifications.largeImage}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, showLargeImage: !prev.showLargeImage }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.showLargeImage ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.showLargeImage ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.showLargeImage && (
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    label=""
                    helpText="1200x628px recommended - increases engagement by 20-40%"
                  />
                )}

                <div className="flex items-center justify-between">
                  <InlineTooltip
                    label="Show Action Buttons"
                    tooltip={tooltips.notifications.actionButtons}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, showActionButtons: !prev.showActionButtons }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.showActionButtons ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.showActionButtons ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduling</h2>

              {/* One-Time Scheduling */}
              {formData.type === 'ONE_TIME' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Send Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to save as draft, or schedule for a specific time
                  </p>
                </div>
              )}

              {/* Recurring Schedule */}
              {formData.type === 'RECURRING' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interval Type
                      </label>
                      <select
                        name="recurring_interval_type"
                        value={formData.recurring_interval_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Every X {formData.recurring_interval_type.toLowerCase()}
                      </label>
                      <input
                        type="number"
                        name="recurring_interval_value"
                        value={formData.recurring_interval_value}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="recurring_start_date"
                      value={formData.recurring_start_date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="recurring_end_date"
                      value={formData.recurring_end_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to continue indefinitely
                    </p>
                  </div>
                </div>
              )}

              {/* Triggered Notifications */}
              {formData.type === 'TRIGGERED' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    Triggered notifications are sent automatically based on user actions or events.
                    Configure triggers in the Automation section.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50"
              >
                {(createMutation.isPending || updateMutation.isPending)
                  ? 'Saving...'
                  : isEdit ? 'Update Notification' : 'Save Notification'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/notifications')}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <NotificationPreview
                notification={{
                  title: formData.title || 'Notification Title',
                  message: formData.message || 'Your notification message will appear here',
                  icon: formData.icon_url,
                  image: formData.showLargeImage ? formData.image_url : '',
                  url: formData.destination_url || currentSite?.url || 'https://your-site.com'
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NotificationForm;

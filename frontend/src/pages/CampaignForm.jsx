import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useSiteStore from '../stores/siteStore';
import { campaignsService } from '../services/campaigns';
import NotificationPreview from '../components/NotificationPreview';

function CampaignForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentSite = useSiteStore((state) => state.currentSite);

  const [isActive, setIsActive] = useState(true);
  const [campaignName, setCampaignName] = useState('');
  const [campaignIcon, setCampaignIcon] = useState('');
  const [useUTM, setUseUTM] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      delay: 0,
      delayUnit: 'immediately',
      title: '',
      message: '',
      url: '',
      icon: '',
      image: '',
      showLargeImage: false,
      showActionButtons: false
    }
  ]);

  const [previewIndex, setPreviewIndex] = useState(0);

  const createCampaignMutation = useMutation({
    mutationFn: (data) => campaignsService.createCampaign(currentSite.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns']);
      alert('Campaign created successfully!');
      navigate('/campaigns');
    },
    onError: (error) => {
      alert(error.response?.data?.error?.message || 'Failed to create campaign');
    },
  });

  const addNotification = () => {
    setNotifications([
      ...notifications,
      {
        id: Date.now(),
        delay: 1,
        delayUnit: 'hours',
        title: '',
        message: '',
        url: '',
        icon: '',
        image: '',
        showLargeImage: false,
        showActionButtons: false
      }
    ]);
  };

  const updateNotification = (index, field, value) => {
    const updated = [...notifications];
    updated[index][field] = value;
    setNotifications(updated);
  };

  const removeNotification = (index) => {
    if (notifications.length > 1) {
      setNotifications(notifications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: campaignName,
      is_active: isActive,
      steps: notifications.map((notif, index) => ({
        sequence_order: index + 1,
        delay_minutes: notif.delayUnit === 'immediately' ? 0 :
                       notif.delayUnit === 'minutes' ? notif.delay :
                       notif.delayUnit === 'hours' ? notif.delay * 60 :
                       notif.delay * 60 * 24,
        notification: {
          title: notif.title,
          message: notif.message,
          destination_url: notif.url,
          icon_url: notif.icon || campaignIcon,
          image_url: notif.showLargeImage ? notif.image : null
        }
      }))
    };

    createCampaignMutation.mutate(data);
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
        <h1 className="text-3xl font-bold text-gray-900">Create Welcome Drip Campaign</h1>
        <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">
          Schedule automatic notifications for new subscribers
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Toggle & Campaign Name */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <label className="text-sm font-medium text-gray-700">Active</label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Welcome Sequence"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Campaign Icon & UTM */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Icon
                  </label>
                  <input
                    type="url"
                    value={campaignIcon}
                    onChange={(e) => setCampaignIcon(e.target.value)}
                    placeholder="https://"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Choose Image</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UTM Params
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseUTM(!useUTM)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      useUTM ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useUTM ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    ▶
                  </div>
                  {notifications.length > 0 && (
                    <div className="w-0.5 h-full bg-blue-200 my-2" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Begin</span>{' '}
                    <span className="text-blue-600">immediately</span>{' '}
                    after user subscribes.
                  </p>
                </div>
              </div>

              {/* Notification Steps */}
              {notifications.map((notif, index) => (
                <div key={notif.id} className="relative mb-8 last:mb-0">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      {index < notifications.length - 1 && (
                        <div className="w-0.5 flex-1 bg-blue-200 my-2 min-h-[200px]" />
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      {/* Delay Selector */}
                      {index > 0 && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={notif.delay}
                            onChange={(e) => updateNotification(index, 'delay', parseInt(e.target.value) || 0)}
                            className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                          <select
                            value={notif.delayUnit}
                            onChange={(e) => updateNotification(index, 'delayUnit', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="minutes">minutes</option>
                            <option value="hours">hours</option>
                            <option value="days">days</option>
                          </select>
                          <span className="text-sm text-gray-500">after previous notification</span>
                        </div>
                      )}

                      {/* Notification Fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notification Title
                        </label>
                        <input
                          type="text"
                          value={notif.title}
                          onChange={(e) => updateNotification(index, 'title', e.target.value)}
                          placeholder="Title"
                          maxLength={50}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">{notif.title.length}/50 characters</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notification Message
                        </label>
                        <textarea
                          value={notif.message}
                          onChange={(e) => updateNotification(index, 'message', e.target.value)}
                          placeholder="Message"
                          maxLength={140}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">{notif.message.length}/140 characters</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Destination URL
                        </label>
                        <input
                          type="url"
                          value={notif.url}
                          onChange={(e) => updateNotification(index, 'url', e.target.value)}
                          placeholder="https://"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Icon
                        </label>
                        <input
                          type="url"
                          value={notif.icon}
                          onChange={(e) => updateNotification(index, 'icon', e.target.value)}
                          placeholder="https://"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Choose Image</p>
                      </div>

                      {/* Toggles */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            Show Large Image
                            <span className="text-gray-400">ⓘ</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => updateNotification(index, 'showLargeImage', !notif.showLargeImage)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notif.showLargeImage ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notif.showLargeImage ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {notif.showLargeImage && (
                          <input
                            type="url"
                            value={notif.image}
                            onChange={(e) => updateNotification(index, 'image', e.target.value)}
                            placeholder="Image URL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}

                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            Show Action Buttons
                            <span className="text-gray-400">ⓘ</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => updateNotification(index, 'showActionButtons', !notif.showActionButtons)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notif.showActionButtons ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notif.showActionButtons ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      {notifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeNotification(index)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove Notification
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Notification Button */}
              <div className="flex items-center gap-4 mt-6">
                <div className="w-8" />
                <button
                  type="button"
                  onClick={addNotification}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 text-sm font-medium"
                >
                  + Add Notification
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createCampaignMutation.isPending || !campaignName}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50"
              >
                {createCampaignMutation.isPending ? 'Saving...' : 'Save Campaign'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/campaigns')}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Preview Selector */}
              {notifications.length > 1 && (
                <div className="mb-4">
                  <select
                    value={previewIndex}
                    onChange={(e) => setPreviewIndex(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {notifications.map((_, index) => (
                      <option key={index} value={index}>
                        Step {index + 1} Preview
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <NotificationPreview
                notification={{
                  title: notifications[previewIndex]?.title || 'Notification Title',
                  message: notifications[previewIndex]?.message || 'Message',
                  icon: notifications[previewIndex]?.icon || campaignIcon,
                  image: notifications[previewIndex]?.showLargeImage ? notifications[previewIndex]?.image : '',
                  url: notifications[previewIndex]?.url || currentSite?.url || 'https://your-site.com'
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CampaignForm;

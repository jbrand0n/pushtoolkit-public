function NotificationPreview({ notification }) {
  const {
    title = 'Notification Title',
    message = 'Message',
    icon = '',
    image = '',
    url = ''
  } = notification;

  const getDomain = (urlString) => {
    try {
      const domain = new URL(urlString).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'your-site.com';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Notification Previews</h3>
        <button className="text-blue-600 text-sm hover:text-blue-700">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      </div>

      {/* Chrome on Windows */}
      <div>
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Chrome on Windows</div>
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            {icon ? (
              <img src={icon} alt="" className="w-12 h-12 rounded flex-shrink-0 bg-gray-100" />
            ) : (
              <div className="w-12 h-12 rounded flex-shrink-0 bg-gray-200" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate">{title}</div>
              <div className="text-gray-600 text-sm mt-0.5 line-clamp-2">{message}</div>
              <div className="text-blue-600 text-xs mt-1">{getDomain(url)}</div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {image && (
            <div className="mt-3">
              <img src={image} alt="" className="w-full rounded" />
            </div>
          )}
        </div>
      </div>

      {/* Chrome on Windows 10 - Dark */}
      <div>
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Chrome on Windows 10</div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            {icon ? (
              <img src={icon} alt="" className="w-12 h-12 rounded flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded flex-shrink-0 bg-gray-700" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm truncate">{title}</div>
              <div className="text-gray-300 text-sm mt-0.5 line-clamp-2">{message}</div>
              <div className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                <span className="text-blue-400">Google Chrome</span>
                <span>•</span>
                <span>{getDomain(url)}</span>
              </div>
            </div>
            <button className="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Firefox on Windows */}
      <div>
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Firefox on Windows</div>
        <div className="bg-white rounded-lg shadow-lg border border-gray-300">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="font-semibold text-gray-900 text-sm truncate flex-1">{title}</div>
            <button className="text-gray-400 hover:text-gray-600 ml-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-3">
              {icon && (
                <img src={icon} alt="" className="w-10 h-10 rounded flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="text-gray-700 text-sm">{message}</div>
                <div className="text-gray-500 text-xs mt-2">via {getDomain(url)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chrome on Mac */}
      <div>
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Chrome on Mac</div>
        <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm">{title}</div>
              <div className="text-gray-500 text-xs">{getDomain(url)}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-blue-600 bg-blue-50 text-xs rounded-md hover:bg-blue-100">
                Close
              </button>
              <button className="px-3 py-1 text-blue-600 bg-blue-50 text-xs rounded-md hover:bg-blue-100">
                Settings
              </button>
            </div>
          </div>
          <div className="text-gray-700 text-sm">{message}</div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPreview;

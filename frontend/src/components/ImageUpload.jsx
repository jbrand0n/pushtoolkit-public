import { useState } from 'react';
import api from '../lib/api';

/**
 * ImageUpload Component
 * Allows users to either paste a URL or upload an image file
 */
function ImageUpload({ value, onChange, label, helpText, required = false }) {
  const [mode, setMode] = useState('url'); // 'url' or 'upload'
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onChange(response.data.data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`text-xs px-3 py-1 rounded ${
              mode === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`text-xs px-3 py-1 rounded ${
              mode === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.png"
        />
      ) : (
        <div>
          <div className="flex items-center gap-3">
            <label className="flex-1">
              <div
                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
                  uploading
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                {uploading ? (
                  <div className="text-sm text-blue-600">
                    <div className="animate-spin inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                    <p>Uploading...</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400 mb-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p>
                      <span className="text-blue-600 hover:underline">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP (max 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
            </label>
          </div>
          {value && (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">Current:</span>{' '}
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {value}
              </a>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

      {helpText && !error && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}

      {/* Preview */}
      {value && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
          <img
            src={value}
            alt="Preview"
            className="w-24 h-24 object-cover rounded border border-gray-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

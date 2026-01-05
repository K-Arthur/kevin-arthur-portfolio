'use client';

import { useState } from 'react';

export default function RevalidatePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [accessCode, setAccessCode] = useState('');

  const handleRevalidate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/revalidate-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessCode}`
        },
        body: JSON.stringify({ source: 'admin-panel' })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to revalidate');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Media Revalidation Admin</h1>

        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Regenerate Media Metadata</h2>
          <p className="text-muted-foreground mb-6">
            This will fetch the latest media from Cloudinary and update the site's media metadata.
            Use this when you've added, removed, or modified media in Cloudinary.
          </p>

          <div className="mb-4">
            <label htmlFor="accessCode" className="block text-sm font-medium text-foreground mb-2">
              Access Code
            </label>
            <input
              type="password"
              id="accessCode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter revalidation token"
            />
          </div>
          <button
            onClick={handleRevalidate}
            disabled={loading}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Regenerating...' : 'Regenerate Media Metadata'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Success!</h3>
              <p className="text-green-700 dark:text-green-300">{result.message}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Completed at: {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How it works</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Scans all configured project folders in Cloudinary</li>
              <li>• Generates optimized thumbnails and metadata</li>
              <li>• Updates the static metadata file</li>
              <li>• Revalidates the work gallery pages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
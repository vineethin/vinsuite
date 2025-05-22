// src/pages/qa/WebDefectScanner.jsx
import React, { useState } from 'react';

const WebDefectScanner = () => {
  const [url, setUrl] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('url', url);
    if (screenshot) formData.append('screenshot', screenshot);

    try {
      const response = await fetch('/api/defect-scan', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setMessage('Defect scan completed successfully!');
      console.log(result); // Will show AI defects in next steps
    } catch (err) {
      console.error(err);
      setMessage('Error during defect scan.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">AI Web Defect Scanner</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Page URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-app.com/page"
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Screenshot (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? 'Scanning...' : 'Start Scan'}
        </button>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default WebDefectScanner;

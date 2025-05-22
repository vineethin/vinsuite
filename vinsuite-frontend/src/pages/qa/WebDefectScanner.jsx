// src/pages/qa/WebDefectScanner.jsx
import React, { useState } from 'react';
import API from '../../apiConfig';
import ToolHeader from "../../components/common/ToolHeader";

const WebDefectScanner = () => {
  const [url, setUrl] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [defectOutput, setDefectOutput] = useState('');

  console.log("✅ WebDefectScanner mounted");
  console.log("🌐 API.WEB_DEFECT_SCANNER =", API.WEB_DEFECT_SCANNER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setDefectOutput('');

    const formData = new FormData();
    formData.append('url', url);
    if (screenshot) formData.append('screenshot', screenshot);

    try {
      const response = await fetch(API.WEB_DEFECT_SCANNER, {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error:', errorText);
        setMessage('Error during defect scan.');
        return;
      }

      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        setMessage('✅ Defect scan completed successfully!');
        setDefectOutput(result);
        console.log('✅ Defect output:', result);
      } else {
        const text = await response.text();
        console.warn('⚠️ Non-JSON response:', text);
        setMessage('Unexpected response format from server.');
        setDefectOutput(text);
      }
    } catch (err) {
      console.error('❌ Client error:', err);
      setMessage('Error during defect scan.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <ToolHeader title="AI Web Defect Scanner" backTo="/dashboard" />
      
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
          className={`px-6 py-2 rounded-lg text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Scanning...' : 'Start Scan'}
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-700">
            {message}
          </p>
        )}

        {defectOutput && (
          <pre className="mt-6 p-4 bg-gray-100 text-sm overflow-x-auto whitespace-pre-wrap">
            {typeof defectOutput === 'string'
              ? defectOutput
              : JSON.stringify(defectOutput, null, 2)}
          </pre>
        )}
      </form>
    </div>
  );
};

export default WebDefectScanner;

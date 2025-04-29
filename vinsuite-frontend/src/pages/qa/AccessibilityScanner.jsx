import React, { useState } from 'react';
import axios from 'axios';
import API from '../../apiConfig';
import LogoutButton from '../../components/LogoutButton';

const AccessibilityScanner = () => {
  const [url, setUrl] = useState('');
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) {
      alert('Please enter a valid URL!');
      return;
    }
    setLoading(true);
    setViolations([]);
    try {
      const response = await axios.post(`${API.ACCESSIBILITY}/scan`, { url });
      setViolations(response.data.violations || []);
    } catch (error) {
      console.error('Accessibility scan failed:', error);
      alert('❌ Failed to scan the provided URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold text-blue-700">♿ Accessibility Scanner</h1>
        <LogoutButton />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          type="text"
          placeholder="Enter URL (https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border px-4 py-2 rounded shadow-sm"
        />

        <button
          onClick={handleScan}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow w-full"
        >
          {loading ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>

      {violations.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Accessibility Issues Found:</h2>
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Impact</th>
                <th className="py-2 px-4 border">Element</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((issue, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border text-center">{idx + 1}</td>
                  <td className="py-2 px-4 border">{issue.description}</td>
                  <td className="py-2 px-4 border">{issue.impact}</td>
                  <td className="py-2 px-4 border">{issue.nodes?.[0]?.html || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccessibilityScanner;

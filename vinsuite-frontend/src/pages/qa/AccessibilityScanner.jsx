import React, { useState } from 'react';
import axios from 'axios';
import API from '../../apiConfig';
import ToolLayout from '../../components/common/ToolLayout';

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
    <ToolLayout title="♿ Accessibility Scanner" showLogout={true}>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md space-y-4 max-w-3xl mx-auto">
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
        <div className="mt-8 overflow-x-auto max-w-5xl mx-auto">
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
    </ToolLayout>
  );
};

export default AccessibilityScanner;

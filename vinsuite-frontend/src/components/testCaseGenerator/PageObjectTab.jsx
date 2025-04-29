import React, { useState } from 'react';
import axios from 'axios';
import API from '../../apiConfig';

const PageObjectTab = () => {
  const [html, setHtml] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [selectedLang, setSelectedLang] = useState('java');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setGeneratedCode('');

    if (!html.trim()) {
      setError('❌ HTML input cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(`${API.TEST_CASES}/generate-pageobject`, {
        html,
        language: selectedLang
      });

      const data = response.data;
      if (data.code) {
        setGeneratedCode(data.code);
      } else {
        setError(data.error || '❌ Failed to generate code.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('❌ Request failed: ' + (error.response?.data?.error || 'Server error.'));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Page Object Generator</h2>

      <textarea
        className="w-full border p-2 rounded"
        rows={6}
        placeholder="Paste HTML of the screen..."
        value={html}
        onChange={(e) => setHtml(e.target.value)}
      />

      <div className="flex gap-4 items-center">
        <label className="font-medium">Language:</label>
        <select
          className="border px-2 py-1 rounded"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="python">Python</option>
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleGenerate}
        >
          Generate
        </button>
      </div>

      {error && <div className="text-red-600 font-semibold">{error}</div>}

      {generatedCode && (
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {generatedCode}
        </pre>
      )}
    </div>
  );
};

export default PageObjectTab;

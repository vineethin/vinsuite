import React, { useState } from 'react';

const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(inputJson);
      const prettyJson = JSON.stringify(parsed, null, 2);
      setFormattedJson(prettyJson);
      setErrorMessage('');
    } catch (error) {
      setFormattedJson('');
      setErrorMessage('❌ Invalid JSON. Please fix syntax errors.');
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(inputJson);
      setErrorMessage('✅ Valid JSON!');
    } catch (error) {
      setErrorMessage('❌ Invalid JSON!');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">🧹 JSON Formatter & Validator</h2>

      <textarea
        className="w-full h-48 p-2 border rounded-md text-sm font-mono"
        placeholder="Paste your JSON here..."
        value={inputJson}
        onChange={(e) => setInputJson(e.target.value)}
      />

      <div className="flex space-x-2">
        <button
          onClick={handleFormat}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Format
        </button>
        <button
          onClick={handleValidate}
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
        >
          Validate
        </button>
      </div>

      {errorMessage && (
        <div className="mt-2 text-red-600 font-medium">{errorMessage}</div>
      )}

      {formattedJson && (
        <div className="mt-4 border rounded-md bg-white shadow-sm p-4">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{formattedJson}</pre>
        </div>
      )}
    </div>
  );
};

export default JsonFormatter;

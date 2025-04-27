import React, { useState } from 'react';
import axios from 'axios';

const SchemaTracker = () => {
  const [file, setFile] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('https://vinsuite.onrender.com/api/dba/upload-schema-log', formData);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to upload schema log");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold text-blue-700 mb-4">📊 Schema Change Tracker</h2>

        <input
          type="file"
          accept=".txt,.log"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Log
        </button>

        <ul className="mt-6 list-disc pl-5 text-sm text-gray-700">
          {logs.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SchemaTracker;

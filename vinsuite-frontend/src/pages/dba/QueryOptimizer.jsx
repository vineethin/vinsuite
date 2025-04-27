import React, { useState } from 'react';
import axios from 'axios';

const QueryOptimizer = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleAnalyze = async () => {
    try {
      const res = await axios.post('https://vinsuite.onrender.com/api/dba/optimize-query', { query });
      const content = res.data.choices?.[0]?.message?.content;
      setResponse(content || 'No response received.');
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to get optimization suggestions.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold text-blue-700 mb-4">🧠 Query Optimizer</h2>
        <textarea
          rows="8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="SELECT * FROM users WHERE age > 30..."
        />
        <button
          onClick={handleAnalyze}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Analyze Query
        </button>

        {response && (
          <div className="mt-6 bg-gray-50 border border-gray-300 p-4 rounded text-sm whitespace-pre-wrap">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryOptimizer;

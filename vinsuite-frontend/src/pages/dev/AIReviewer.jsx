import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../apiConfig';

const AIReviewer = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) {
      alert("Please paste some code to review.");
      return;
    }

    setLoading(true);
    setReview('');
    try {
      const response = await fetch(API.AI_REVIEWER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const result = await response.text();

      if (response.ok) {
        setReview(result);
      } else {
        setReview(`// Error from reviewer: ${result}`);
      }
    } catch (err) {
      setReview('// Error: Unable to connect to reviewer service.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          🧠 AI Code Reviewer
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dev")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm flex items-center gap-2"
          >
            <span className="text-blue-600">⬅️</span> Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Language:</label>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setCode(""); // Clear code when language changes
          }}
          className="border p-2 rounded w-full"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="kotlin">Kotlin</option>
          <option value="swift">Swift</option>
        </select>
      </div>

      <label className="block mb-1 font-medium">Paste Your Code:</label>
      <textarea
        rows="10"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border p-2 mb-4 rounded font-mono"
        placeholder="Paste your function/class/code snippet here"
      />

      <button
        onClick={handleReview}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Reviewing...' : 'Review Code'}
      </button>

      {review && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Review Result:</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-auto border">
            {review}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AIReviewer;

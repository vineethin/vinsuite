import React, { useState } from 'react';
import ToolHeader from '../../components/common/ToolHeader';
import API from '../../apiConfig';

const AIReviewer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API.FRAMEWORK}/ai-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const result = await response.text();
      setReview(result);
    } catch (err) {
      setReview('// Error while reviewing code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <ToolHeader title="AI Code Reviewer" />
      <div className="mb-4">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border p-2">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
        </select>
      </div>
      <textarea
        rows="10"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border p-2 mb-4"
        placeholder="Paste your code here"
      />
      <button onClick={handleReview} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Reviewing...' : 'Review Code'}
      </button>
      {review && (
        <pre className="bg-gray-100 p-4 mt-4 whitespace-pre-wrap border">{review}</pre>
      )}
    </div>
  );
};

export default AIReviewer;

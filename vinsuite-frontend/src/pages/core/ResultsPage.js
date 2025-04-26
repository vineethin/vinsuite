import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResultsPage({ results = [] }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Test Case Results</h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Projects
          </button>
        </div>

        {results.length === 0 ? (
          <p className="text-gray-600 text-center">No test cases generated.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">No.</th>
                <th className="border px-4 py-2 text-left">Action</th>
                <th className="border px-4 py-2 text-left">Expected</th>
                <th className="border px-4 py-2 text-left">Actual</th>
                <th className="border px-4 py-2 text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{idx + 1}</td>
                  <td className="border px-4 py-2">{r.action}</td>
                  <td className="border px-4 py-2">{r.expectedResult}</td>
                  <td className="border px-4 py-2">{r.actualResult}</td>
                  <td className="border px-4 py-2">{r.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;

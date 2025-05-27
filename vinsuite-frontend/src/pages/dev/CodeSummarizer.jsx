import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../apiConfig";

const CodeSummarizer = () => {
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSummarize = async () => {
    if (!inputCode.trim()) return;

    setLoading(true);
    setSummary("");

    try {
      const res = await fetch(`${API.WRITER}/summarize-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: inputCode })
      });

      const data = await res.json();
      setSummary(data.summary || "No summary returned.");
    } catch (err) {
      console.error("❌ Error summarizing code", err);
      setSummary("An error occurred while processing your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          🧠 Code Summarizer & Explainer
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

      <textarea
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        rows={12}
        placeholder="Paste your code here..."
        className="w-full p-4 border rounded mb-4 font-mono"
      />
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={handleSummarize}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Summarize Code"}
      </button>

      {summary && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">🧠 Summary</h2>
          <pre className="whitespace-pre-wrap">{summary}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeSummarizer;
import React, { useState } from "react";
import ToolHeader from "../../components/common/ToolHeader";

const PerformanceScriptGenerator = () => {
  const [testUrl, setTestUrl] = useState("");
  const [users, setUsers] = useState(50);
  const [rampUp, setRampUp] = useState(30);
  const [duration, setDuration] = useState(300);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleTestPerformance = async () => {
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/qa/performance/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: testUrl, users, rampUp, duration }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Unknown error during performance test.");
        return;
      }

      const data = await response.json();
      setResult(data.summary || "// No summary returned.");
    } catch (err) {
      console.error("Error:", err);
      setError("Error connecting to performance test service.");
    }
  };

  return (
    <div className="p-6">
      <ToolHeader title="🚀 Performance Test Generator" />

      <div className="grid gap-4 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <input
          type="text"
          placeholder="Enter test URL (e.g., https://yourapi.com/login)"
          className="w-full p-3 border rounded"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label>Number of Users</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={users}
              onChange={(e) => setUsers(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label>Ramp-up Time (sec)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={rampUp}
              onChange={(e) => setRampUp(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label>Test Duration (sec)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>
        </div>

        <button
          onClick={handleTestPerformance}
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit hover:bg-blue-700"
        >
          Test Performance
        </button>

        {error && (
          <div className="text-red-600 border border-red-300 bg-red-50 p-4 rounded">
            ❌ {error}
          </div>
        )}

        {result && (
          <div>
            <label className="block font-semibold mt-4">Performance Summary:</label>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceScriptGenerator;

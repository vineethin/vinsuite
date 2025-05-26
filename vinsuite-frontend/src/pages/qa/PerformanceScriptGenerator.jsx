import React, { useState } from "react";
import ToolLayout from "../../components/common/ToolLayout";
import API from "../../apiConfig";

const PerformanceScriptGenerator = () => {
  const [testUrl, setTestUrl] = useState("");
  const [users, setUsers] = useState(50);
  const [rampUp, setRampUp] = useState(30);
  const [duration, setDuration] = useState(300);
  const [result, setResult] = useState("");
  const [script, setScript] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTestPerformance = async () => {
    setError("");
    setResult("");
    setScript("");
    setLoading(true);

    try {
      const response = await fetch(`${API.PERFORMANCE}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: testUrl.trim(), users, rampUp, duration }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Unknown error during performance test.");
        return;
      }

      const data = await response.json();
      setResult(data.summary || "// No summary returned.");
      setScript(data.script || "");
    } catch (err) {
      console.error("Error:", err);
      setError("Error connecting to performance test service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout title="🚀 Performance Test Generator">
      <div className="grid gap-4 max-w-3xl mx-auto bg-white bg-opacity-80 p-6 rounded-xl shadow">
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
              min={1}
              className="w-full p-2 border rounded"
              value={users}
              onChange={(e) => setUsers(Math.max(1, parseInt(e.target.value)))}
            />
          </div>

          <div>
            <label>Ramp-up Time (sec)</label>
            <input
              type="number"
              min={1}
              className="w-full p-2 border rounded"
              value={rampUp}
              onChange={(e) => setRampUp(Math.max(1, parseInt(e.target.value)))}
            />
          </div>

          <div>
            <label>Test Duration (sec)</label>
            <input
              type="number"
              min={1}
              className="w-full p-2 border rounded"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value)))}
            />
          </div>
        </div>

        <button
          onClick={handleTestPerformance}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded w-fit hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Running..." : "Test Performance"}
        </button>

        {loading && (
          <div className="text-blue-600 mt-2">⏳ Running test, please wait...</div>
        )}

        {error && (
          <div className="text-red-600 border border-red-300 bg-red-50 p-4 rounded mt-2">
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

        {script && (
          <div className="mt-6">
            <label className="block font-semibold mb-1">Generated Test Script:</label>
            <pre className="bg-gray-900 text-green-200 p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap text-sm">
              {script}
            </pre>
            <button
              onClick={() => {
                const blob = new Blob([script], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "performance-test-script.js";
                link.click();
              }}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ⬇️ Download Script
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default PerformanceScriptGenerator;

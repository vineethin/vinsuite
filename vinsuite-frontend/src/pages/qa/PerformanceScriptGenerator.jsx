import React, { useState } from "react";
import ToolHeader from "../../components/common/ToolHeader";

const PerformanceScriptGenerator = () => {
  const [testCase, setTestCase] = useState("");
  const [tool, setTool] = useState("JMeter");
  const [users, setUsers] = useState(50);
  const [rampUp, setRampUp] = useState(30);
  const [duration, setDuration] = useState(300);
  const [script, setScript] = useState("");

  const handleGenerate = async () => {
    try {
      const response = await fetch("/api/qa/performance/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testCase, tool, users, rampUp, duration }),
      });

      const data = await response.json();
      setScript(data.script || "// No script returned.");
    } catch (error) {
      console.error("Error generating performance script:", error);
      setScript("// Error generating script.");
    }
  };

  return (
    <div className="p-6">
      <ToolHeader title="⚙️ Performance Test Script Generator" />

      <div className="grid gap-4 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <textarea
          placeholder="Enter user journey or test case here..."
          className="w-full p-3 border rounded resize-none h-32"
          value={testCase}
          onChange={(e) => setTestCase(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Tool</label>
            <select
              className="w-full p-2 border rounded"
              value={tool}
              onChange={(e) => setTool(e.target.value)}
            >
              <option value="JMeter">JMeter</option>
              <option value="k6">k6</option>
            </select>
          </div>

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
            <label>Ramp-up Time (seconds)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={rampUp}
              onChange={(e) => setRampUp(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label>Test Duration (seconds)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit hover:bg-blue-700"
        >
          Generate Script
        </button>

        {script && (
          <div>
            <label className="block font-semibold mt-4">Generated Script:</label>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">
              {script}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceScriptGenerator;

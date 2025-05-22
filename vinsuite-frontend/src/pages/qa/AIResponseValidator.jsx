import React, { useState } from "react";
import ToolLayout from "../../components/common/ToolLayout";

const AIResponseValidator = () => {
  const [prompt, setPrompt] = useState("");
  const [input, setInput] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [result, setResult] = useState(null);

  const handleRun = async () => {
    setResult(null);
    setActual("Generating...");

    // 🔁 Simulated AI response logic (replace with real API later)
    const simulatedOutput = prompt + " " + input;
    setTimeout(() => {
      setActual(simulatedOutput);
      const passed = simulatedOutput.trim().toLowerCase() === expected.trim().toLowerCase();
      setResult(passed ? "✅ Match" : "❌ Mismatch");
    }, 1000);
  };

  return (
    <ToolLayout title="🧠 AI Response Validator">
      <div className="bg-white bg-opacity-90 p-6 rounded shadow-md space-y-4 max-w-3xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prompt</label>
          <textarea
            rows={3}
            className="mt-1 w-full border rounded px-3 py-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Input</label>
          <textarea
            rows={2}
            className="mt-1 w-full border rounded px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expected Output</label>
          <textarea
            rows={2}
            className="mt-1 w-full border rounded px-3 py-2"
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
          />
        </div>

        <button
          onClick={handleRun}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Run & Compare
        </button>

        {actual && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">Actual Response:</p>
            <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{actual}</pre>
            <p className="mt-2 font-semibold">Result: {result}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default AIResponseValidator;

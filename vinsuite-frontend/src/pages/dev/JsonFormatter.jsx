import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JsonFormatter() {
  const navigate = useNavigate();
  const [rawJson, setRawJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(rawJson);
      setFormattedJson(JSON.stringify(parsed, null, 2));
    } catch (err) {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          🧹 JSON Formatter
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

      {/* Input JSON */}
      <label className="block mb-2 font-medium">Paste Raw JSON:</label>
      <textarea
        rows={10}
        value={rawJson}
        onChange={(e) => setRawJson(e.target.value)}
        className="w-full border p-2 mb-4 rounded font-mono"
        placeholder='{"name": "VinTaaS", "type": "tool"}'
      />

      <button
        onClick={handleFormat}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Format JSON
      </button>

      {/* Output */}
      {formattedJson && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Formatted JSON:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
            {formattedJson}
          </pre>
        </div>
      )}
    </div>
  );
}

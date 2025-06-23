import React, { useState } from "react";

const TestAuraPanel = () => {
  const [url, setUrl] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/testaura/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">🎙️ Test Aura</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter web app URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Analyze"}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">🧠 Suggested Tests:</h2>
          <ul className="list-disc list-inside space-y-1">
            {suggestions.map((sug, i) => (
              <li key={i}>{sug}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestAuraPanel;

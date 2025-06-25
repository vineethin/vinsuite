import React from "react";

const SuggestionsPanel = ({ suggestions, selectedTests, toggleTest, speak }) => {
  if (!Object.keys(suggestions || {}).length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">🧠 Suggested Tests (Grouped)</h2>

      {Object.entries(suggestions).map(([category, tests]) => (
        <div key={category}>
          <h3 className="text-md font-bold text-blue-800 mb-2">🗂️ {category}</h3>
          <ul className="bg-gray-50 p-4 rounded space-y-2">
            {tests.map((sug, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(sug)}
                    onChange={() => toggleTest(sug)}
                  />
                  <span>{sug}</span>
                </div>
                <button
                  className="text-sm text-blue-600 underline"
                  onClick={() => speak(sug)}
                >
                  🔊 Listen
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SuggestionsPanel;

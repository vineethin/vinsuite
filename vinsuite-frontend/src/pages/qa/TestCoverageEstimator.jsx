import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../apiConfig";

const TestCoverageEstimator = () => {
  const [requirements, setRequirements] = useState("");
  const [testCases, setTestCases] = useState("");
  const [steps, setSteps] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [deepMode, setDeepMode] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleEstimate = async () => {
    setLoading(true);
    try {
      const reqPayload = {
        userStories: requirements.split("\n").filter(r => r.trim()),
        testCases: testCases.split("\n").filter(t => t.trim())
      };

      if (deepMode) {
        reqPayload.testCaseSteps = steps.split("\n\n").map(block => block.split("\n").filter(l => l.trim()));
        reqPayload.acceptanceCriteria = acceptanceCriteria.split("\n\n").map(block => block.split("\n").filter(l => l.trim()));
      }

      const res = await fetch(`${API.TEST_CASES}/coverage-estimator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqPayload)
      });

      const data = await res.json();
      const parsed = Array.isArray(data) ? data : JSON.parse(data.choices?.[0]?.message?.content || "[]");
      setResults(parsed);
    } catch (err) {
      console.error("Estimation failed:", err);
      alert("AI response was not in valid JSON format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="📊 Test Coverage Estimator">
      <div className="bg-white p-6 rounded shadow-md space-y-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={deepMode} onChange={() => setDeepMode(!deepMode)} />
          <span className="text-sm font-medium text-gray-700">Enable Deep Coverage Mode</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Paste Requirements / User Stories
          </label>
          <textarea
            rows={4}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="One user story per line"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </div>

        {deepMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paste Acceptance Criteria (grouped by story, double line break between groups)
            </label>
            <textarea
              rows={4}
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="Given...\nWhen...\nThen..."
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Paste Existing Test Case Titles
          </label>
          <textarea
            rows={4}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="One title per line"
            value={testCases}
            onChange={(e) => setTestCases(e.target.value)}
          />
        </div>

        {deepMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paste Test Case Steps (grouped by test, double line break between groups)
            </label>
            <textarea
              rows={6}
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="Step 1\nStep 2\n\nStep 1\nStep 2"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
          </div>
        )}

        <button
          onClick={handleEstimate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Estimating..." : "Estimate Coverage"}
        </button>

        {results.length > 0 && (
          <div className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-2">Coverage Results:</h3>
            <ul className="space-y-2">
              {results.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  <strong>{item.story}</strong>: {item.status}
                  {item.matchedTestCases?.length > 0 && (
                    <div className="text-xs text-gray-500 ml-4">
                      Matches: {item.matchedTestCases.join(", ")}
                    </div>
                  )}
                  {item.missingSteps && (
                    <div className="text-xs text-red-500 ml-4">
                      Missing Steps: {item.missingSteps.join(", ")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TestCoverageEstimator;

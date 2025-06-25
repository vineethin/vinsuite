import React from "react";

const TestExecutionPreview = ({
  url,
  isRunning,
  screenshot,
  reportUrl,
  onRunTests,
  testResults = [] // 🔹 Optional prop for test result data
}) => {
  if (!url) return null;

  const isValidUrl = (val) => {
    try {
      const parsed = new URL(val);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!isValidUrl(url)) return null;

  const passedCount = testResults.filter(r => r.status === "passed").length;
  const failedCount = testResults.filter(r => r.status === "failed").length;
  const totalCount = testResults.length;

  return (
    <div className="space-y-4">
      <div className="border rounded p-2">
        <h3 className="font-medium mb-1">🔍 Webpage Preview</h3>

        {isRunning && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full" />
          </div>
        )}

        <iframe
          src={url}
          title="Page Preview"
          className="w-full h-[400px] border"
        />
      </div>

      <button
        onClick={onRunTests}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        disabled={isRunning}
      >
        {isRunning ? "Running..." : "🧪 Run Selected Tests"}
      </button>

      {/* 🔸 Summary panel (only shown if results available) */}
      {testResults.length > 0 && (
        <div className="border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">✅ Test Summary</h4>
          <p>
            🧪 Executed: <strong>{totalCount}</strong> | ✅ Passed:{" "}
            <strong className="text-green-600">{passedCount}</strong> | ❌ Failed:{" "}
            <strong className="text-red-600">{failedCount}</strong>
          </p>
        </div>
      )}

      {/* 🔻 Screenshot removed heading as requested */}
      {screenshot && (
        <div>
          <img
            src={screenshot}
            alt="Test screenshot"
            className="w-full border rounded mt-4"
          />
        </div>
      )}

      {reportUrl && (
        <div className="mt-4">
          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📄 View Test Report
          </a>
        </div>
      )}
    </div>
  );
};

export default TestExecutionPreview;

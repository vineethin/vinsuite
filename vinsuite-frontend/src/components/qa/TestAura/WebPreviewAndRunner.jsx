import React from "react";

const WebPreviewAndRunner = ({
  url,
  isRunning,
  screenshot,
  reportUrl,
  onRunTests,
  testResults = [],
}) => {
  const isValidUrl = (val) => {
    try {
      const parsed = new URL(val);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!isValidUrl(url)) return null;

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

      {/* Future Placeholder: Test result log display */}
      {testResults.length > 0 && (
        <div className="bg-gray-50 border rounded p-4 space-y-1">
          <h4 className="font-semibold">📝 Execution Steps</h4>
          <ul className="list-disc ml-5 text-sm text-gray-800">
            {testResults.map((res, i) => (
              <li key={i}>{res}</li>
            ))}
          </ul>
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

export default WebPreviewAndRunner;

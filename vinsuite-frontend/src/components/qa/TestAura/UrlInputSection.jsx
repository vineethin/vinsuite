import React from "react";

const UrlInputSection = ({
  url,
  setUrl,
  loading,
  recording,
  transcript,
  handleSubmit,
  handleVoiceCommand,
  downloadAsTxt,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <input
        type="text"
        placeholder="Enter URL to test (e.g. https://example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={() => handleSubmit()}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Get Suggestions"}
        </button>

        <button
          onClick={handleVoiceCommand}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🎙️ {recording ? "Listening..." : "Speak"}
        </button>

        <button
          onClick={downloadAsTxt}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          📥 Export TXT
        </button>
      </div>

      {transcript && (
        <p className="italic text-gray-600 mt-2 sm:col-span-2">
          You said: “{transcript}”
        </p>
      )}
    </div>
  );
};

export default UrlInputSection;

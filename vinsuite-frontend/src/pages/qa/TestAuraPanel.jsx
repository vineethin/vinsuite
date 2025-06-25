import React, { useState } from "react";
import ToolLayout from "../../components/common/ToolLayout";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE || "/api";

const TestAuraPanel = () => {
  const [url, setUrl] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);

  const handleSubmit = async () => {
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL (http or https).");
      return;
    }

    setLoading(true);
    setScreenshot(null);
    setSuggestions([]);
    setSelectedTests([]);
    setReportUrl(null);

    try {
      const res = await fetch(`${API_BASE}/testaura/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      console.log("🚀 Suggestions Response:", data);

      const flatSuggestions = data.suggestions
        ? Object.values(data.suggestions).flat()
        : [];

      setSuggestions(flatSuggestions);
    } catch (error) {
      console.error("❌ Error fetching suggestions:", error);
      toast.error("Failed to fetch test suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTest = (testText) => {
    setSelectedTests((prev) =>
      prev.includes(testText)
        ? prev.filter((t) => t !== testText)
        : [...prev, testText]
    );
  };

  const handleRunTests = async () => {
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL (http or https).");
      return;
    }

    if (selectedTests.length === 0) {
      toast.info("Please select at least one test to run.");
      return;
    }

    setIsRunning(true);
    setScreenshot(null);
    setReportUrl(null);
    console.log("📡 Sending test run request:", { url, tests: selectedTests });

    try {
      const res = await fetch(`${API_BASE}/testaura/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, tests: selectedTests }),
      });

      const data = await res.json();
      console.log("✅ Test Run Response:", data);

      if (res.ok) {
        toast.success(data.message || "Tests executed.");
        if (data.screenshot) {
          setScreenshot(`data:image/png;base64,${data.screenshot}`);
        }
        if (data.reportUrl) {
          setReportUrl(`${API_BASE}${data.reportUrl}`);
        }
      } else {
        toast.error(data.message || "Test execution failed.");
      }
    } catch (error) {
      console.error("❌ Run error:", error);
      toast.error("Error communicating with backend.");
    } finally {
      setIsRunning(false);
    }
  };

  const isValidUrl = (val) => {
    try {
      const parsed = new URL(val);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <ToolLayout
      title="🎙️ TestAura – Voice QA Assistant"
      showLogout={true}
      showBack={true}
    >
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter URL to test (e.g. https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Get Test Suggestions"}
          </button>
        </div>

        {/* Suggested Tests */}
        {suggestions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">🧠 Suggested Tests:</h2>
            <ul className="space-y-2">
              {suggestions.map((sug, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(sug)}
                    onChange={() => toggleTest(sug)}
                  />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Webpage Preview and Progress */}
        {isValidUrl(url) && (
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
              onClick={handleRunTests}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "🧪 Run Selected Tests"}
            </button>

            {/* Screenshot */}
            {screenshot && (
              <div>
                <h4 className="font-medium mt-4 mb-2">
                  📸 Screenshot from Test Run
                </h4>
                <img
                  src={screenshot}
                  alt="Test screenshot"
                  className="w-full border rounded"
                />
              </div>
            )}

            {/* Report */}
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
        )}
      </div>
    </ToolLayout>
  );
};

export default TestAuraPanel;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../apiConfig";

export default function UnitTestGenerator() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [generatedTest, setGeneratedTest] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(API.UNIT_TEST_GENERATOR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const errorData = await res.json();
          alert(errorData.message || "Failed to generate unit test.");
        } else {
          const text = await res.text();
          console.error("Non-JSON response from server:\n", text);
          alert("Server returned an unexpected response. Check console for details.");
        }
        setGeneratedTest("");
        return;
      }

      const data = await res.json();

      if (data.error) {
        alert(data.message || "Failed to generate unit test.");
        setGeneratedTest("");
      } else {
        setGeneratedTest(data.testCode);
      }
    } catch (err) {
      alert("Unexpected error: " + err.message);
      setGeneratedTest("");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const extension = language === "javascript" ? "test.js" : "test.py";
    const blob = new Blob([generatedTest], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `generated.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          🧪 Unit Test Generator
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

      <label className="block mb-2 font-medium">Select Language:</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border p-2 mb-4 rounded w-full"
      >
        <option value="javascript">JavaScript (Jest)</option>
        <option value="python">Python (Pytest)</option>
      </select>

      <label className="block mb-2 font-medium">Paste Your Function:</label>
      <textarea
        rows={10}
        className="w-full border p-2 mb-4 rounded font-mono"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your JS or Python function here"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Unit Tests"}
      </button>

      {generatedTest && (
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download as .{language === "javascript" ? "test.js" : "test.py"}
        </button>
      )}

      {generatedTest && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated Test Code:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
            {generatedTest}
          </pre>
        </div>
      )}
    </div>
  );
}

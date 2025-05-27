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

  const detectLanguage = (code) => {
    if (/def\s+\w+\(/.test(code)) return "python";
    if (/function\s+\w+\(/.test(code) || /=>/.test(code)) return "javascript";
    if (/public\s+(class|int|void|static)/.test(code)) return "java";
    if (/fun\s+\w+\(/.test(code)) return "kotlin";
    if (/package\s+\w+/.test(code) && /func\s+\w+\(/.test(code)) return "go";
    if (/func\s+\w+\(/.test(code)) return "go";
    if (/class\s+\w+\s+{/.test(code) && /public/.test(code)) return "csharp";
    if (/class\s+\w+\s*{/.test(code) && /\$[a-zA-Z]/.test(code)) return "php";
    if (/def\s+\w+\s*\(.+\)/.test(code) && /end/.test(code)) return "ruby";
    if (/func\s+\w+\(/.test(code) && /\(_\s+\w+:/.test(code)) return "swift";
    return "unknown";
  };

  const handleGenerate = async () => {
    const detected = detectLanguage(code);
    if (detected !== "unknown" && detected !== language.toLowerCase()) {
      alert(
        `Given code looks like ${detected}, but you selected ${language}. Please choose the correct option.`
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API.UNIT_TEST_GENERATOR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        const message = contentType.includes("application/json")
          ? (await res.json()).message
          : await res.text();
        alert(message || "Failed to generate unit test.");
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
    const extMap = {
      javascript: "test.js",
      typescript: "test.ts",
      python: "test.py",
      java: "Test.java",
      csharp: "Test.cs",
      go: "test.go",
      php: "Test.php",
      ruby: "test_spec.rb",
      kotlin: "Test.kt",
      swift: "Test.swift",
    };
    const extension = extMap[language] || "test.txt";
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
        {/* Web Dev */}
        <option value="javascript">JavaScript (Jest)</option>
        <option value="typescript">TypeScript (Jest)</option>

        {/* Backend */}
        <option value="python">Python (PyTest)</option>
        <option value="java">Java (JUnit)</option>
        <option value="csharp">C# (NUnit)</option>
        <option value="go">Go (testing)</option>
        <option value="php">PHP (PHPUnit)</option>
        <option value="ruby">Ruby (RSpec)</option>
        <option value="kotlin">Kotlin (JUnit/Kotest)</option>

        {/* Mobile */}
        <option value="swift">Swift (XCTest)</option>
      </select>

      <label className="block mb-2 font-medium">Paste Your Function:</label>
      <textarea
        rows={10}
        className="w-full border p-2 mb-4 rounded font-mono"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your function here"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Unit Tests"}
      </button>

      {generatedTest && (
        <>
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download as .{language}
          </button>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Generated Test Code:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
              {generatedTest}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

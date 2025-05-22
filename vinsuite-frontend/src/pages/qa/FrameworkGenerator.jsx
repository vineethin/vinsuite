import React, { useState } from "react";
import axios from "axios";
import API from "../../apiConfig";
import ToolLayout from "../../components/common/ToolLayout";

const FrameworkGenerator = () => {
  const [language, setLanguage] = useState("java");
  const [testFramework, setTestFramework] = useState("testng");
  const [reportTool, setReportTool] = useState("logback");
  const [packagingTool, setPackagingTool] = useState("maven");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!language || !testFramework || !reportTool || !packagingTool) {
      alert("❌ Please select all configuration options.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API.FRAMEWORK}/generate`,
        { language, testFramework, reportTool, packagingTool },
        { responseType: "blob" }
      );

      if (res.data && res.data.size > 0) {
        const blob = new Blob([res.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "sample-framework.zip");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("⚠️ Received empty or invalid ZIP file.");
      }
    } catch (err) {
      console.error("❌ Error generating framework:", err);
      alert("❌ Failed to generate framework. Please check backend logs or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout title="🛠️ VinSuite Framework Generator">
      <div className="max-w-xl mx-auto bg-white bg-opacity-90 p-6 rounded-xl shadow space-y-5">
        <div>
          <label htmlFor="language" className="block font-medium mb-1">Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="csharp">C#</option>
          </select>
        </div>

        <div>
          <label htmlFor="testFramework" className="block font-medium mb-1">Test Framework</label>
          <select
            id="testFramework"
            value={testFramework}
            onChange={(e) => setTestFramework(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {language === "java" && (
              <>
                <option value="testng">TestNG</option>
                <option value="junit">JUnit</option>
              </>
            )}
            {language === "python" && <option value="pytest">PyTest</option>}
            {language === "csharp" && <option value="nunit">NUnit</option>}
          </select>
        </div>

        <div>
          <label htmlFor="reportTool" className="block font-medium mb-1">Report Tool</label>
          <select
            id="reportTool"
            value={reportTool}
            onChange={(e) => setReportTool(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="logback">Logback</option>
            <option value="allure">Allure</option>
            <option value="extent">ExtentReports</option>
          </select>
        </div>

        <div>
          <label htmlFor="packagingTool" className="block font-medium mb-1">Packaging Tool</label>
          <select
            id="packagingTool"
            value={packagingTool}
            onChange={(e) => setPackagingTool(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="maven">Maven</option>
            <option value="gradle">Gradle</option>
            <option value="none">None</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? "Generating..." : "Download Framework"}
        </button>
      </div>
    </ToolLayout>
  );
};

export default FrameworkGenerator;

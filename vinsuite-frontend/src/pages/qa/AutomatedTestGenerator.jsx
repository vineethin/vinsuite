import React, { useState } from 'react';
import API from "../../apiConfig";
import ToolLayout from "../../components/common/ToolLayout";

const AutomatedTestGenerator = () => {
  const [testCase, setTestCase] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [language, setLanguage] = useState('Java');
  const [framework, setFramework] = useState('TestNG');
  const [generatedCode, setGeneratedCode] = useState('');

  const frameworkOptions = {
    Java: ['TestNG', 'JUnit'],
    Python: ['PyTest', 'unittest']
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch(`${API.FRAMEWORK}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testCase, htmlCode, language, framework }),
      });

      const result = await response.text();
      setGeneratedCode(result);
    } catch (error) {
      console.error('Error generating automation code:', error);
      setGeneratedCode('// Error: Unable to generate automation code.');
    }
  };

  return (
    <ToolLayout title="⚙️ Automated Test Generator" showLogout={true}>
      <div className="max-w-6xl mx-auto">
        <label className="block font-medium mb-1">Manual Test Case</label>
        <textarea
          className="w-full border rounded p-2 mb-4 h-32"
          placeholder="Enter manual test case steps..."
          value={testCase}
          onChange={(e) => setTestCase(e.target.value)}
        />

        <label className="block font-medium mb-1">HTML Code</label>
        <textarea
          className="w-full border rounded p-2 mb-4 h-32"
          placeholder="Paste related HTML code..."
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
        />

        <div className="flex gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">Language</label>
            <select
              className="border rounded p-2"
              value={language}
              onChange={(e) => {
                const selected = e.target.value;
                setLanguage(selected);
                setFramework(frameworkOptions[selected][0]);
              }}
            >
              {Object.keys(frameworkOptions).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Framework</label>
            <select
              className="border rounded p-2"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
            >
              {frameworkOptions[language].map((fw) => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleGenerate}
        >
          Generate Automation Script
        </button>

        {generatedCode && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Generated Script</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap">
              {generatedCode}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default AutomatedTestGenerator;

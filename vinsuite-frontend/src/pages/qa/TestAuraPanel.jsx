// src/components/qa/TestAuraPanel.jsx
import React, { useState } from "react";
import ToolLayout from "../../components/common/ToolLayout";
import UrlInputSection from "../../components/qa/TestAura/UrlInputSection";
import SuggestionsPanel from "../../components/qa/TestAura/SuggestionsPanel";
import WebPreviewAndRunner from "../../components/qa/TestAura/WebPreviewAndRunner";
import useTestAuraLogic from "../../components/qa/TestAura/useTestAuraLogic";

const TestAuraPanel = () => {
  const testAura = useTestAuraLogic();

  // ✅ Username and Password state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ToolLayout title="🎙️ TestAura – Voice QA Assistant" showLogout showBack>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">

        {/* URL Input and Voice Command Section */}
        <UrlInputSection {...testAura} />

        {/* ✅ Credential Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Username (optional)</label>
            <input
              type="text"
              placeholder="e.g., testuser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Password (optional)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </div>

        {/* Voice transcript display */}
        {testAura.transcript && (
          <p className="italic text-gray-600">
            You said: “{testAura.transcript}”
          </p>
        )}

        {/* AI-suggested Test Cases */}
        <SuggestionsPanel {...testAura} />

        {/* Live site preview and test runner */}
        <WebPreviewAndRunner
          url={testAura.url}
          isRunning={testAura.isRunning}
          screenshot={testAura.screenshot}
          reportUrl={testAura.reportUrl}
          testResults={testAura.testResults || []}
          onRunTests={() => testAura.handleRunTests({ username, password })}
        />
      </div>
    </ToolLayout>
  );
};

export default TestAuraPanel;

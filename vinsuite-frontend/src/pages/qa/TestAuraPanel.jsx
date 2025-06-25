// src/components/qa/TestAuraPanel.jsx
import React from "react";
import ToolLayout from "../../components/common/ToolLayout";
import UrlInputSection from "../../components/qa/TestAura/UrlInputSection";
import SuggestionsPanel from "../../components/qa/TestAura/SuggestionsPanel";
import WebPreviewAndRunner from "../../components/qa/TestAura/WebPreviewAndRunner";
import useTestAuraLogic from "../../components/qa/TestAura/useTestAuraLogic";

const TestAuraPanel = () => {
  const testAura = useTestAuraLogic();

  return (
    <ToolLayout title="🎙️ TestAura – Voice QA Assistant" showLogout showBack>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
        {/* URL Input with Voice, Submit, and Export options */}
        <UrlInputSection {...testAura} />

        {/* Transcript feedback */}
        {testAura.transcript && (
          <p className="italic text-gray-600">
            You said: “{testAura.transcript}”
          </p>
        )}

        {/* Categorized test suggestions */}
        <SuggestionsPanel {...testAura} />

        {/* Web preview, test runner button, screenshot preview, and report link */}
        <WebPreviewAndRunner
          url={testAura.url}
          isRunning={testAura.isRunning}
          screenshot={testAura.screenshot}
          reportUrl={testAura.reportUrl}
          onRunTests={testAura.handleRunTests}
          // ⬇️ To be implemented in step 2
          testResults={testAura.testResults || []}
        />
      </div>
    </ToolLayout>
  );
};

export default TestAuraPanel;

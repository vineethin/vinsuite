import React, { useState } from "react";
import ElementIdentifier from "../../components/tools/ElementIdentifier";
import PageObjectFromText from "../../components/tools/PageObjectFromText";
import ToolLayout from "../../components/common/ToolLayout";

const PageObjectGenerator = () => {
  const [activeTab, setActiveTab] = useState("default");

  const tabOptions = [
    { key: "default", label: "DOM-based (HTML Input)" },
    { key: "image", label: "Screenshot-based (Image Input)" },
  ];

  return (
    <ToolLayout title="📄 Page Object Generator" showLogout={true}>
      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabOptions.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white bg-opacity-90 shadow-md rounded-xl p-6">
        {activeTab === "default" && <PageObjectFromText />}
        {activeTab === "image" && <ElementIdentifier />}
        {!["default", "image"].includes(activeTab) && (
          <div className="text-red-600">⚠️ Invalid tab selection.</div>
        )}
      </div>
    </ToolLayout>
  );
};

export default PageObjectGenerator;

import React, { useState } from "react";
import ElementIdentifier from '../../components/tools/ElementIdentifier';
import PageObjectFromText from '../../components/tools/PageObjectFromText';
import ToolLayout from "../../components/common/ToolLayout";

const PageObjectGenerator = () => {
  const [activeTab, setActiveTab] = useState("default");

  return (
    <ToolLayout title="📄 Page Object Generator" showLogout={true}>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "default"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("default")}
        >
          Page Object (DOM based)
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "image"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("image")}
        >
          Page Object (from Screenshot)
        </button>
      </div>

      <div className="bg-white bg-opacity-90 shadow-md rounded-xl p-6">
        {activeTab === "default" && <PageObjectFromText />}
        {activeTab === "image" && <ElementIdentifier />}
      </div>
    </ToolLayout>
  );
};

export default PageObjectGenerator;

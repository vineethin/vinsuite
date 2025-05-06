import React, { useState } from "react";
import ElementIdentifier from '../../components/tools/ElementIdentifier';
import PageObjectFromText from '../../components/tools/PageObjectFromText';
import ToolHeader from "../../components/common/ToolHeader";

const PageObjectGenerator = () => {
  const [activeTab, setActiveTab] = useState("default");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToolHeader title="📄 Page Object Generator" showLogout={true} />

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

      <div className="bg-white shadow-md rounded p-6">
        {activeTab === "default" && <PageObjectFromText />}
        {activeTab === "image" && <ElementIdentifier />}
      </div>
    </div>
  );
};

export default PageObjectGenerator;

import React, { useState } from "react";
import ElementIdentifier from '../../components/tools/ElementIdentifier';
import PageObjectFromText from '../../components/tools/PageObjectFromText';

const PageObjectGenerator = () => {
  const [activeTab, setActiveTab] = useState("default");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">📄 Page Object Generator</h2>

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
        {activeTab === "default" && <PageObjectFromText  />}
        {activeTab === "image" && <ElementIdentifier />}
      </div>
    </div>
  );
};

export default PageObjectGenerator;

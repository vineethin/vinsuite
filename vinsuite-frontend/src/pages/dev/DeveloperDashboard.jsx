import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const tools = [
  { name: "JSON Formatter", route: "/developer/json-formatter" },
  { name: "AI Unit Test Generator", route: "#" },
  { name: "AI Code Reviewer", route: "#" },
  { name: "Secure Code Analyzer", route: "#" },
  { name: "Refactor Assistant", route: "#" },
  { name: "Regex Simplifier", route: "#" },
  { name: "Code Search Copilot", route: "#" },
];

const DeveloperDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="💻 Developer Dashboard">
      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded p-5 hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
            {tool.route === "#" && (
              <p className="text-gray-600 text-sm">[Placeholder for future AI integration]</p>
            )}
            <button
              onClick={() => tool.route !== "#" && navigate(tool.route)}
              className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Launch
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DeveloperDashboard;

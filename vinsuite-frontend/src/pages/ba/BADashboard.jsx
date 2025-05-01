import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const tools = [
  { name: "AI Requirement Parser", route: "#" },
  { name: "Traceability Matrix", route: "#" },
  { name: "AI Document Summarizer", route: "#" },
  { name: "Acceptance Criteria Generator", route: "#" },
  { name: "Requirements Coverage Report", route: "#" },
  { name: "AI Specification Validator", route: "#" },
];

const BADashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="📘 BA Dashboard">
      {/* Tool Grid */}
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

export default BADashboard;

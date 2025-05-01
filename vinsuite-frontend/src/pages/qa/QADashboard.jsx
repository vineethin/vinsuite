import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const tools = [
  { name: "Test Case Generator", route: "/test-generator" },
  { name: "Page Object Generator", route: "/page-object" },
  { name: "Bug Report Summarizer", route: "#" },
  { name: "Test Data Generator", route: "#" },
  { name: "Accessibility Checker", route: "/accessibility" },
  { name: "API Contract Verifier", route: "#" },
  { name: "Visual Regression Tool", route: "#" },
  { name: "CI/CD Test Advisor", route: "#" },
];

const QADashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="🧪 QA Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded p-5 hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
            {tool.route === "#" && (
              <p className="text-gray-600 text-sm">
                [Placeholder for future AI integration]
              </p>
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

export default QADashboard;

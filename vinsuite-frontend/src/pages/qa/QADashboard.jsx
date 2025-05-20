import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import ToolLayout from "../../components/common/ToolLayout";

const qaBase = "/dashboard/qa";

const tools = [
  { name: "Test Case Generator", route: `${qaBase}/test-generator` },
  { name: "Page Object Generator", route: `${qaBase}/page-object` },
  { name: "Test Coverage Estimator", route: `${qaBase}/test-coverage-estimator` },
  { name: "Automated Test Generator", route: `${qaBase}/automated-test-generator` },
  { name: "Performance Script Generator", route: `${qaBase}/performance-generator` },
  { name: "Test My Page", route: `${qaBase}/test-my-page` }
];

const QADashboard = () => {
  const navigate = useNavigate();
  const { userRole, hydrated } = useApp();

  // ✅ Wait for context to load
  if (!hydrated) return null;
  if (!userRole) return <Navigate to="/login" replace />;

  const isAdmin = userRole === "admin" || !!localStorage.getItem("adminActingAs");

  return (
    <ToolLayout title="🧪 QA Dashboard" showBackToAdmin={isAdmin}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded p-5 hover:shadow-lg transition-all border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
            <button
              onClick={() => navigate(tool.route)}
              className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Launch
            </button>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
};

export default QADashboard;

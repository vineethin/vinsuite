import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext"; // Import useApp hook

const tools = [
  { name: "Test Case Generator", route: "/test-generator" },
  { name: "Page Object Generator", route: "/page-object" },
  { name: "Test Coverage Estimator", route: "/qa/test-coverage-estimator" },
  { name: "Automated Test Generator", route: "/qa/automated-test-generator" },
  { name: "Performance Script Generator", route: "/qa/performance-generator" },
  { name: "Web Defect Scanner", route: "/dashboard/qa/web-defect-scanner" } // ✅ Newly added
];


const QADashboard = () => {
  const navigate = useNavigate();
  const { userRole, setUserRole } = useApp(); // Use context for userRole

  const isAdmin = userRole === "admin" || !!localStorage.getItem("adminActingAs");

  const handleLogout = () => {
    setUserRole(''); // Clear role in context
    navigate("/login");
  };

  if (!userRole) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">🧪 QA Dashboard</h1>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm flex items-center gap-2"
              >
                <span className="text-blue-600">⬅️</span> Back to Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default QADashboard;

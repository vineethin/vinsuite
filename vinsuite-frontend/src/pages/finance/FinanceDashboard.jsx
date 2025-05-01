import React from "react";
import { useNavigate } from "react-router-dom";

const tools = [
  { name: "Expense Categorizer", route: "#" },
  { name: "Budget Deviation Analyzer", route: "#" },
  { name: "Forecast Generator", route: "#" },
  { name: "Invoice Summary Extractor", route: "#" },
  { name: "Fraud Pattern Detector", route: "#" },
  { name: "AI-Driven ROI Calculator", route: "#" },
  { name: "Payroll Trend Predictor", route: "#" },
  { name: "Procurement Optimization Engine", route: "#" },
];

const FinanceDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">💼 Finance Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm flex items-center gap-2"
            >
              <span className="text-blue-600">⬅️</span> Back to Admin
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded p-5 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 text-sm">[Placeholder for future AI integration]</p>
              <button
                onClick={() => tool.route !== "#" && navigate(tool.route)}
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

export default FinanceDashboard;

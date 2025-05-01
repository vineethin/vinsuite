import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

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

  return (
    <DashboardLayout title="💼 Finance Dashboard">
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

export default FinanceDashboard;

import React from "react";
import AdminDeptSwitcher from "../../components/admin/AdminDeptSwitcher";
import DashboardHeader from "../../components/common/DashboardHeader";

const AdminFinanceDashboard = () => {
  return (
    <div className="p-8">
      {/* Reusable Header */}
      <DashboardHeader title="💰 Admin Finance Dashboard" />

      {/* Department Switcher */}
      <AdminDeptSwitcher />

      {/* Coming Soon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[
          {
            title: "Forecast Variance Analyzer",
            desc: "Identify gaps between forecasted and actuals."
          },
          {
            title: "Budget Assistant",
            desc: "AI-powered tool to help with budgeting decisions."
          },
          {
            title: "Spend Analyzer",
            desc: "Breakdown and categorize expenses with AI."
          },
          {
            title: "Fraud Pattern Detector",
            desc: "Detect suspicious transactions using ML models."
          },
          {
            title: "Invoice Summary Extractor",
            desc: "Parse and summarize financial documents."
          },
          {
            title: "ROI Predictor",
            desc: "Predict return on investments using AI modeling."
          }
        ].map((tool, idx) => (
          <div key={idx} className="border rounded p-4 opacity-50">
            <h3 className="font-bold text-lg">{tool.title}</h3>
            <p>{tool.desc}</p>
            <span className="text-xs text-gray-400">Coming Soon</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Built for smarter financial forecasting and expense optimization.
      </p>
    </div>
  );
};

export default AdminFinanceDashboard;

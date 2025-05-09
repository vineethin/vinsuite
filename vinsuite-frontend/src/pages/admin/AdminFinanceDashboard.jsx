import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext"; // Import useApp hook
import AdminDeptSwitcher from "../../components/admin/AdminDeptSwitcher";

const AdminFinanceDashboard = () => {
  const navigate = useNavigate();

  const { setUserRole, setUserDepartment } = useApp(); // Access context setters

  const handleLogout = () => {
    setUserRole(""); // Clear role in context
    setUserDepartment(""); // Clear department in context
    navigate("/"); // Redirect to login
  };

  return (
    <div className="p-8">
      {/* Header with title and Logout */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-green-700">
          💰 Admin Finance Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600 mb-4">Department: Finance</p>

      {/* 🔄 Department Switcher */}
      <AdminDeptSwitcher />

      {/* 🧩 Coming Soon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Forecast Variance Analyzer</h3>
          <p>Identify gaps between forecasted and actuals.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Budget Assistant</h3>
          <p>AI-powered tool to help with budgeting decisions.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Spend Analyzer</h3>
          <p>Breakdown and categorize expenses with AI.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Fraud Pattern Detector</h3>
          <p>Detect suspicious transactions using ML models.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Invoice Summary Extractor</h3>
          <p>Parse and summarize financial documents.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">ROI Predictor</h3>
          <p>Predict return on investments using AI modeling.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Built for smarter financial forecasting and expense optimization.
      </p>
    </div>
  );
};

export default AdminFinanceDashboard;

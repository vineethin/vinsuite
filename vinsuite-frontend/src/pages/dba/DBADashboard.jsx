import React from "react";
import { useNavigate } from "react-router-dom";

const tools = [
  { name: "Query Optimizer", route: "/dba/query-optimizer" },
  { name: "Backup Status Checker", route: "/dba/backup-check" },
  { name: "Schema Change Tracker", route: "/dba/schema-tracker" },
  { name: "AI SQL Explainer", route: "/dba/sql-explainer" },
  { name: "Query Anomaly Detector", route: "/dba/query-anomaly" },
  { name: "Test Data Generator", route: "/dba/test-data-generator" },
  { name: "Query Cost Visualizer", route: "/dba/query-cost" },
  { name: "Schema Documentation Generator", route: "/dba/schema-docs" },
  { name: "AI Index Advisor", route: "/dba/index-advisor" },
];

const DBADashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "DBA";
  const userRole = localStorage.getItem("userRole") || "dba";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-rose-700">
            🛢️ DBA Dashboard
          </h1>
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

        {/* Tool Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded p-5 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 text-sm">[Placeholder for future AI integration]</p>
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

export default DBADashboard;

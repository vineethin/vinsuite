import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

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

  return (
    <DashboardLayout title="🛢️ DBA Dashboard">
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
              onClick={() => navigate(tool.route)}
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

export default DBADashboard;

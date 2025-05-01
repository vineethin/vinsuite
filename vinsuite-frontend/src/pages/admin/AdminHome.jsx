import React from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  { label: "QA Tester", role: "qa", description: "Access test case tools and automation generators." },
  { label: "Developer", role: "dev", description: "Access AI code tools and productivity boosters." },
  { label: "Manager", role: "manager", description: "View dashboards, productivity insights, and risk analysis." },
  { label: "Business Analyst", role: "ba", description: "Generate specs, acceptance criteria, and traceability." },
  { label: "Database Admin", role: "dba", description: "Optimize queries and monitor schema changes with AI." },
  { label: "Sales Lead", role: "sales", description: "Access AI-powered sales tools and lead insights." },
  { label: "Support", role: "support", description: "Use AI tools for smarter, faster customer support." },
  { label: "Finance", role: "finance", description: "Analyze budgets, costs, forecasts, and financial health." }
];

const AdminHome = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    localStorage.setItem("userId", "admin");
    localStorage.setItem("userName", "Admin");
    localStorage.setItem("userRole", role); // This sets current view role
    localStorage.setItem("adminActingAs", role); // Flag for showing back to admin
    navigate(`/${role}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">🚀 VinSuite Admin Console</h1>
            <p className="text-gray-600">Select a role below to simulate login and explore tools.</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(({ label, role, description }) => (
            <div
              key={role}
              onClick={() => handleRoleClick(role)}
              className="cursor-pointer bg-white p-5 rounded shadow hover:shadow-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-1 text-gray-800">{label}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          🔐 Built for multi-role AI-assisted quality collaboration
        </p>
      </div>
    </div>
  );
};

export default AdminHome;

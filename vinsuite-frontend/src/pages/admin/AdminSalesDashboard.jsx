import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../../contexts/AppContext";
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminSalesDashboard = () => {
  const navigate = useNavigate();
  const { setUserRole, setUserDepartment } = useApp();

  const handleLogout = () => {
    setUserRole('');
    setUserDepartment('');
    navigate('/');
  };

  return (
    <div className="p-8">
      {/* Header with title and Logout */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-red-700">📊 Admin Sales Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600 mb-4">Department: Sales</p>

      {/* Department Switcher */}
      <AdminDeptSwitcher />

      {/* Coming Soon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[
          {
            title: "Lead Scoring",
            description: "Use AI to prioritize and score sales leads."
          },
          {
            title: "Follow-Up Email Generator",
            description: "Draft personalized follow-up emails automatically."
          },
          {
            title: "Deal Closure Predictor",
            description: "Predict likelihood of deal success with ML insights."
          },
          {
            title: "Meeting Summary Assistant",
            description: "Summarize client meetings and highlight action items."
          },
          {
            title: "Account Intelligence",
            description: "Aggregate buyer data and trends for better targeting."
          },
          {
            title: "Proposal Generator",
            description: "Auto-generate client proposals based on opportunity data."
          }
        ].map((tool, idx) => (
          <div key={idx} className="border rounded p-4 opacity-50">
            <h3 className="font-bold text-lg">{tool.title}</h3>
            <p>{tool.description}</p>
            <span className="text-xs text-gray-400">Coming Soon</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Built to empower smarter sales decisions with AI-driven insights.
      </p>
    </div>
  );
};

export default AdminSalesDashboard;

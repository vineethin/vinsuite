import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminHome = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">🚀 VinSuite Admin Console</h1>
      <p className="text-gray-600 mb-6">Select a role below to simulate login and explore tools.</p>

      {/* ✅ Show Change Department dropdown at the top */}
      <AdminDeptSwitcher />

      {/* 🔲 Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div onClick={() => handleCardClick('/qa')} className="cursor-pointer border rounded p-4 hover:shadow-md">
          <h3 className="font-bold text-lg">QA Tester</h3>
          <p>Access test case tools and automation generators.</p>
        </div>
        <div onClick={() => handleCardClick('/dev')} className="cursor-pointer border rounded p-4 hover:shadow-md">
          <h3 className="font-bold text-lg">Developer</h3>
          <p>Access AI code tools and productivity boosters.</p>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Manager</h3>
          <p>View dashboards, productivity insights, and risk analysis.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Business Analyst</h3>
          <p>Generate specs, acceptance criteria, and traceability.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Database Admin</h3>
          <p>Optimize queries and monitor schema changes with AI.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Sales Lead</h3>
          <p>Access AI-powered sales tools and lead insights.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Support</h3>
          <p>Use AI tools for smarter, faster customer support.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Finance</h3>
          <p>Analyze budgets, costs, forecasts, and financial health.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">🔐 Built for multi-role AI-assisted quality collaboration</p>
    </div>
  );
};

export default AdminHome;

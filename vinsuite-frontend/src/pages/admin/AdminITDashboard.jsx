import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../../contexts/AppContext";
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminITDashboard = () => {
  const navigate = useNavigate();
  const { setUserRole, setUserDepartment } = useApp();

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    setUserRole('');
    setUserDepartment('');
    navigate('/');
  };

  return (
    <div className="p-8">
      {/* Header with title and Logout */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-blue-800">👨‍💻 Admin IT Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600 mb-4">Department: IT</p>

      {/* Department switcher */}
      <AdminDeptSwitcher />

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div onClick={() => handleCardClick('/qa')} className="cursor-pointer border rounded p-4 hover:shadow-md">
          <h3 className="font-bold text-lg">QA Tester</h3>
          <p>Access test case tools and automation generators.</p>
        </div>
        <div onClick={() => handleCardClick('/dev')} className="cursor-pointer border rounded p-4 hover:shadow-md">
          <h3 className="font-bold text-lg">Developer</h3>
          <p>Access AI code tools and productivity boosters.</p>
        </div>
        <div onClick={() => handleCardClick('/admin/writer')} className="cursor-pointer border rounded p-4 hover:shadow-md">
          <h3 className="font-bold text-lg">Writer</h3>
          <p>Generate emails, content, and documents using AI.</p>
        </div>

        {/* Coming Soon cards (clickable) */}
        <div onClick={() => handleCardClick('/coming-soon/manager')} className="cursor-pointer border rounded p-4 opacity-50 hover:shadow-md">
          <h3 className="font-bold text-lg">Manager</h3>
          <p>View dashboards, productivity insights, and risk analysis.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div onClick={() => handleCardClick('/coming-soon/ba')} className="cursor-pointer border rounded p-4 opacity-50 hover:shadow-md">
          <h3 className="font-bold text-lg">Business Analyst</h3>
          <p>Generate specs, acceptance criteria, and traceability.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div onClick={() => handleCardClick('/coming-soon/dba')} className="cursor-pointer border rounded p-4 opacity-50 hover:shadow-md">
          <h3 className="font-bold text-lg">Database Admin</h3>
          <p>Optimize queries and monitor schema changes with AI.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div onClick={() => handleCardClick('/coming-soon/saleslead')} className="cursor-pointer border rounded p-4 opacity-50 hover:shadow-md">
          <h3 className="font-bold text-lg">Sales Lead</h3>
          <p>Access AI-powered sales tools and lead insights.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div onClick={() => handleCardClick('/coming-soon/support')} className="cursor-pointer border rounded p-4 opacity-50 hover:shadow-md">
          <h3 className="font-bold text-lg">Support</h3>
          <p>Use AI tools for smarter, faster customer support.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div onClick={() => handleCardClick('/coming-soon/finance')} className="cursor-pointer border rounded p-4 opacity-50 hover:shadow-md">
          <h3 className="font-bold text-lg">Finance</h3>
          <p>Analyze budgets, costs, forecasts, and financial health.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Built for multi-role AI-assisted quality collaboration
      </p>
    </div>
  );
};

export default AdminITDashboard;

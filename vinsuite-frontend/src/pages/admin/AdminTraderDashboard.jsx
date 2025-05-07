import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminTraderDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userDepartment');
    navigate('/');
  };

  return (
    <div className="p-8">
      {/* Header with title and Logout */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-red-700">📈 Admin Trader Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600 mb-4">Department: Trader</p>

      {/* 🔄 Department Switcher */}
      <AdminDeptSwitcher />

      {/* 🧩 Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Trade Execution Monitor</h3>
          <p>Track trade execution rates and anomalies.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">AI Strategy Generator</h3>
          <p>Generate trading strategies with AI insights.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Trade Volume Analyzer</h3>
          <p>Analyze market trends and volume spikes.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Latency Tracker</h3>
          <p>Measure and optimize trade execution speed.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Compliance Checker</h3>
          <p>Ensure all trades follow regulatory policies.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
        <div className="border rounded p-4 opacity-50">
          <h3 className="font-bold text-lg">Anomaly Detection</h3>
          <p>Detect irregular or risky trading behavior.</p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Built for AI-assisted trading operations and risk management.
      </p>
    </div>
  );
};

export default AdminTraderDashboard;

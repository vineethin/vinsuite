import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../../contexts/AppContext";
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminTraderDashboard = () => {
  const navigate = useNavigate();
  const { setUserRole, setUserDepartment } = useApp();

  const handleLogout = () => {
    setUserRole('');
    setUserDepartment('');
    navigate('/');
  };

  const tools = [
    { title: "Trade Execution Monitor", desc: "Track trade execution rates and anomalies." },
    { title: "AI Strategy Generator", desc: "Generate trading strategies with AI insights." },
    { title: "Trade Volume Analyzer", desc: "Analyze market trends and volume spikes." },
    { title: "Latency Tracker", desc: "Measure and optimize trade execution speed." },
    { title: "Compliance Checker", desc: "Ensure all trades follow regulatory policies." },
    { title: "Anomaly Detection", desc: "Detect irregular or risky trading behavior." }
  ];

  return (
    <div className="p-8">
      {/* Header */}
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

      {/* Department Switcher */}
      <AdminDeptSwitcher />

      {/* Coming Soon Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {tools.map((tool, idx) => (
          <div key={idx} className="border rounded p-4 opacity-50 hover:shadow-md transition">
            <h3 className="font-bold text-lg">{tool.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{tool.desc}</p>
            <span className="text-xs text-gray-400">Coming Soon</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Built for AI-assisted trading operations and risk management.
      </p>
    </div>
  );
};

export default AdminTraderDashboard;

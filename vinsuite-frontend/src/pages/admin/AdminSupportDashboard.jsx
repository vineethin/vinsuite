import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../../contexts/AppContext";
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminSupportDashboard = () => {
  const navigate = useNavigate();
  const { setUserRole, setUserDepartment } = useApp();

  const handleLogout = () => {
    setUserRole('');
    setUserDepartment('');
    navigate('/');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-green-700">🛠️ Admin Support Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600 mb-4">Department: Support</p>

      {/* Department Switcher */}
      <AdminDeptSwitcher />

      {/* Coming Soon Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[
          { title: "AI-Suggested Ticket Replies", desc: "Respond faster with AI-generated solutions." },
          { title: "Sentiment Analyzer", desc: "Understand customer mood in real-time." },
          { title: "Smart Ticket Routing", desc: "Automatically route tickets to the right agent." },
          { title: "Ticket Summarizer", desc: "Summarize long ticket conversations with one click." },
          { title: "Knowledge Base Generator", desc: "Convert resolved tickets into knowledge articles." },
          { title: "Response Time Predictor", desc: "Estimate and improve agent response SLAs." }
        ].map((tool, index) => (
          <div key={index} className="border rounded p-4 opacity-50 hover:shadow-md transition">
            <h3 className="font-bold text-lg">{tool.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{tool.desc}</p>
            <span className="text-xs text-gray-400">Coming Soon</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Support excellence powered by predictive AI tools.
      </p>
    </div>
  );
};

export default AdminSupportDashboard;

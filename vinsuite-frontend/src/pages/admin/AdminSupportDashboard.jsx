import React from 'react';
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';
import DashboardHeader from '../../components/common/DashboardHeader';

const AdminSupportDashboard = () => {
  return (
    <div className="p-8">
      {/* Reusable Header */}
      <DashboardHeader title="🛠️ Admin Support Dashboard" />

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

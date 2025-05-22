import React from 'react';
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';
import DashboardHeader from '../../components/common/DashboardHeader';

const AdminSalesDashboard = () => {
  return (
    <div className="p-8">
      {/* Reusable Header */}
      <DashboardHeader title="📊 Admin Sales Dashboard" />

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

import React from 'react';
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';
import DashboardHeader from '../../components/common/DashboardHeader';

const AdminITDashboard = () => {
  const handleCardClick = (path) => {
    window.location.href = path; // Or use useNavigate if needed in future
  };

  return (
    <div className="p-8">
      {/* Reusable Header */}
      <DashboardHeader title="👨‍💻 Admin IT Dashboard" />

      {/* Department Switcher */}
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

        {/* Coming Soon cards */}
        {[
          { title: "Manager", desc: "View dashboards, productivity insights, and risk analysis.", path: "/coming-soon/manager" },
          { title: "Business Analyst", desc: "Generate specs, acceptance criteria, and traceability.", path: "/coming-soon/ba" },
          { title: "Database Admin", desc: "Optimize queries and monitor schema changes with AI.", path: "/coming-soon/dba" },
          { title: "Sales Lead", desc: "Access AI-powered sales tools and lead insights.", path: "/coming-soon/saleslead" },
          { title: "Support", desc: "Use AI tools for smarter, faster customer support.", path: "/coming-soon/support" },
          { title: "Finance", desc: "Analyze budgets, costs, forecasts, and financial health.", path: "/coming-soon/finance" }
        ].map((role, idx) => (
          <div key={idx} onClick={() => handleCardClick(role.path)} className="cursor-pointer border rounded p-4 opacity-50 hover:shadow-md">
            <h3 className="font-bold text-lg">{role.title}</h3>
            <p>{role.desc}</p>
            <span className="text-xs text-gray-400">Coming Soon</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Built for multi-role AI-assisted quality collaboration
      </p>
    </div>
  );
};

export default AdminITDashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../../contexts/AppContext";
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminHome = () => {
  const navigate = useNavigate();
  const { setUserRole, setUserDepartment } = useApp();
  const [userCount, setUserCount] = useState(0);

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    setUserRole('');
    setUserDepartment('');
    navigate('/');
  };

  useEffect(() => {
    fetch('/api/admin/user-count')
      .then((res) => res.json())
      .then((data) => setUserCount(data))
      .catch((err) => console.error("❌ Failed to fetch user count", err));
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-blue-800">🚀 VinSuite Admin Console</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600 mb-6">Select a role below to simulate login and explore tools.</p>

      {/* Department Switcher */}
      <AdminDeptSwitcher />

      {/* Role Cards */}
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
          <p>Generate email, blog, and document content with AI.</p>
        </div>
      </div>

      {/* Dashboard Insights */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">🔍 System Usage Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 rounded p-4">
            <p className="font-medium">Departments</p>
            <p className="text-2xl">7</p>
          </div>
          <div className="bg-green-100 rounded p-4">
            <p className="font-medium">Roles</p>
            <p className="text-2xl">10</p>
          </div>
          <div className="bg-purple-100 rounded p-4">
            <p className="font-medium">Tools Available</p>
            <p className="text-2xl">21</p>
          </div>
          <div className="bg-yellow-100 rounded p-4">
            <p className="font-medium">Users Registered</p>
            <p className="text-2xl">{userCount}</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Panels */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📌 Coming Soon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Manager",
            "Business Analyst",
            "Database Admin",
            "Sales Lead",
            "Support",
            "Finance"
          ].map((role, idx) => (
            <div
              key={idx}
              className="border rounded p-4 opacity-50 cursor-not-allowed hover:shadow-md"
            >
              <h3 className="font-bold text-lg">{role}</h3>
              <p className="text-sm text-gray-600 mt-1">Dashboard coming soon.</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Built for multi-role AI-assisted quality collaboration
      </p>
    </div>
  );
};

export default AdminHome;

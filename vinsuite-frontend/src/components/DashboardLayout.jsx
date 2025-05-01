import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin" || !!localStorage.getItem("adminActingAs");

  console.log("🔍 userRole in DashboardLayout:", userRole);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!userRole) return null; // Prevent layout from rendering before role is loaded

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">{title}</h1>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm flex items-center gap-2"
              >
                <span className="text-blue-600">⬅️</span> Back to Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
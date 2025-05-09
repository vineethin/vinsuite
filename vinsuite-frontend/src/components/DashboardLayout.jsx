import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../contexts/AppContext"; // Import useApp hook

const DashboardLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, userDepartment, setUserRole, setUserDepartment } = useApp(); // Use context

  const isAdmin = userRole === "admin" || !!localStorage.getItem("adminActingAs");

  // Sync context state with localStorage on initial load
  useEffect(() => {
    if (!userRole) {
      setUserRole(localStorage.getItem("userRole"));
    }
    if (!userDepartment) {
      setUserDepartment(localStorage.getItem("userDepartment"));
    }
  }, [userRole, userDepartment, setUserRole, setUserDepartment]);

  if (!userRole) return null;

  const handleLogout = () => {
    localStorage.clear(); // Keep clearing localStorage for logout
    navigate("/login");
  };

  const isDev = userRole === "Developer" && userDepartment === "IT";

  const navItems = isDev
    ? [
        {
          title: "🧪 Unit Test Generator",
          path: "/dev/unit-test-generator",
        },
        // Add more dev tools here later
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">VinSuite</h2>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-3 py-2 rounded hover:bg-blue-100 ${location.pathname === item.path ? "bg-blue-200 font-semibold" : ""}`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm flex items-center gap-2"
            >
              ⬅️ Back to Admin
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

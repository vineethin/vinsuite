import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

const DashboardLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, userDepartment, setUserRole, setUserDepartment } = useApp();

  const isAdmin = userRole === "admin" || !!localStorage.getItem("adminActingAs");

  useEffect(() => {
    if (!userRole) setUserRole(localStorage.getItem("userRole"));
    if (!userDepartment) setUserDepartment(localStorage.getItem("userDepartment"));
  }, [userRole, userDepartment, setUserRole, setUserDepartment]);

  if (!userRole) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isDev = userRole === "Developer" && userDepartment === "IT";

  const navItems = isDev
    ? [
        {
          title: "🧪 Unit Test Generator",
          path: "/dev/unit-test-generator",
        },
        // More tools can go here
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-100 to-white flex overflow-hidden relative">
      {/* Decorative AI glow icon */}
      <span className="absolute top-4 left-4 w-6 h-6 rounded-full bg-pink-500 opacity-60 animate-ping blur-sm z-0" />
      <span className="absolute top-4 left-4 w-3 h-3 rounded-full bg-pink-600 z-10" />

      {/* Sidebar */}
      <aside className="w-64 bg-white/90 shadow-xl p-5 border-r border-slate-200 z-20">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">🤖 VinSuite</h2>
        <nav>
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg transition ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white font-semibold shadow"
                      : "hover:bg-blue-100 text-gray-700"
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 space-y-2">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 text-sm flex items-center justify-center"
            >
              ⬅ Back to Admin
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-white/60 backdrop-blur-sm rounded-l-3xl shadow-inner z-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">{title}</h1>
        <div className="text-gray-800">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;

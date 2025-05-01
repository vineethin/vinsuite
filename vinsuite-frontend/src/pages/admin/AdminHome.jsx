import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Brain,
  Hammer,
  BookText,
  DatabaseZap,
  UserCircle2,
  ShieldCheck,
  Target,
} from "lucide-react";

// Define all roles including Sales Lead and Admin
const roles = [
  {
    role: "tester",
    label: "QA Tester",
    icon: <BadgeCheck className="w-6 h-6 text-blue-600" />,
    description: "Access test case tools and automation generators.",
    path: "/qa",
  },
  {
    role: "developer",
    label: "Developer",
    icon: <Hammer className="w-6 h-6 text-green-600" />,
    description: "Access AI code tools and productivity boosters.",
    path: "/dev",
  },
  {
    role: "manager",
    label: "Manager",
    icon: <UserCircle2 className="w-6 h-6 text-indigo-600" />,
    description: "View dashboards, productivity insights, and risk analysis.",
    path: "/manager",
  },
  {
    role: "ba",
    label: "Business Analyst",
    icon: <BookText className="w-6 h-6 text-purple-600" />,
    description: "Generate specs, acceptance criteria, and traceability.",
    path: "/ba",
  },
  {
    role: "dba",
    label: "Database Admin",
    icon: <DatabaseZap className="w-6 h-6 text-rose-600" />,
    description: "Optimize queries and monitor schema changes with AI.",
    path: "/dba",
  },
  {
    role: "saleslead",
    label: "Sales Lead",
    icon: <Target className="w-6 h-6 text-orange-600" />,
    description: "Access AI-powered sales tools and lead insights.",
    path: "/sales",
  },
  {
    role: "admin",
    label: "Admin",
    icon: <ShieldCheck className="w-6 h-6 text-gray-700" />,
    description: "Manage users and simulate any role dashboard.",
    path: "/admin",
  },
];

const AdminHome = () => {
  const navigate = useNavigate();

  const simulateLogin = (role) => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", role.charAt(0).toUpperCase() + role.slice(1));
    const selectedRole = roles.find((r) => r.role === role);
    if (selectedRole) {
      navigate(selectedRole.path);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header and Logout */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🚀 VinSuite Admin Console</h1>
            <p className="text-gray-600 mt-1">Select a role below to simulate login and explore tools.</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((roleCard) => (
            <div
              key={roleCard.role}
              className="cursor-pointer border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] bg-white transition"
              onClick={() => simulateLogin(roleCard.role)}
            >
              <div className="flex items-center space-x-4 mb-2">
                {roleCard.icon}
                <h2 className="text-xl font-semibold text-gray-800">{roleCard.label}</h2>
              </div>
              <p className="text-gray-600 text-sm">{roleCard.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 text-gray-500 text-sm">
          <p>🔐 Built for multi-role AI-assisted quality collaboration</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeveloperDashboard = () => {
  const userName = localStorage.getItem("userName") || "Developer";
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  const tools = [
    {
      title: "API Client Code Generator",
      description: "Generate code from API details (Swagger, curl, etc).",
      path: "/api-code-gen"
    },
    {
      title: "Log Formatter + Analyzer",
      description: "Upload test logs and get AI-powered error highlights.",
      path: "/log-analyzer"
    },
    {
      title: "Code Snippet Vault",
      description: "Store and share reusable dev snippets.",
      path: "/snippet-vault"
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              👨‍💻 Welcome, {userName}
            </h1>
            <p className="text-gray-600">
              You are logged in as a <strong>{userRole}</strong>.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => navigate(tool.path)}
              className="cursor-pointer bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-blue-600 mb-2">{tool.title}</h2>
              <p className="text-sm text-gray-700">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;

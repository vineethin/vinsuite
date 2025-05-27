import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";

const tools = [
  { name: "JSON Formatter", route: "/developer/json-formatter" },
  { name: "Unit Test Generator", route: "/dev/unit-test-generator" },
  { name: "Code Summarizer & Explainer", route: "/dev/code-summarizer", description: "Get instant explanations for complex code." },
  { name: "Prompt Evaluator", route: "#", description: "Placeholder for future AI integration" },
  { name: "AI Code Reviewer", route: "/dev/ai-reviewer", description: "Get code review with quality, performance, and best practices suggestions." },
  { name: "Secure Code Analyzer", route: "#", description: "Placeholder for future AI integration" },
  { name: "Refactor Assistant", route: "#", description: "Placeholder for future AI integration" },
  { name: "Regex Simplifier", route: "#", description: "Placeholder for future AI integration" },
  { name: "Code Search Copilot", route: "#", description: "Placeholder for future AI integration" },
  { name: "Repo Test Generator", route: "#", description: "Generate unit tests from your GitHub repo." },
  { name: "Prompt Library", route: "#", description: "Save, rate, and organize your prompts." },
  { name: "AI Code Quality Scanner", route: "#", description: "Detect code smells and risky patterns." },
  { name: "CI/CD Export Assistant", route: "#", description: "Export tests to your CI/CD pipeline." }
];

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const { userRole, setUserRole } = useApp();

  const isAdmin = userRole === "admin" || !!localStorage.getItem("adminActingAs");

  const handleLogout = () => {
    setUserRole("");
    navigate("/login");
  };

  if (!userRole) return null;

  const activeTools = tools.filter(t => t.route !== "#");
  const comingSoonTools = tools.filter(t => t.route === "#");

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">💻 Developer Dashboard</h1>
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

        {/* Enabled Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8 animate-fade-in mb-10">
          {activeTools.map((tool, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded p-5 hover:shadow-lg transition-all border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                {tool.description && (
                  <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                )}
              </div>
              <button
                onClick={() => navigate(tool.route)}
                className="mt-2 px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Launch
              </button>
            </div>
          ))}
        </div>

        {/* Coming Soon Tools */}
        <h2 className="text-xl font-bold text-gray-600 mb-4">Coming Soon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8 animate-fade-in">
          {comingSoonTools.map((tool, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded p-5 border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                {tool.description && (
                  <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                )}
              </div>
              <button
                disabled
                className="mt-2 px-4 py-1 text-sm rounded bg-gray-300 text-gray-600 cursor-not-allowed"
              >
                Launch
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;

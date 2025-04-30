import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import { Code, FileJson, TestTubes, Eye, ShieldAlert, WandSparkles, Replace, SearchCode } from 'lucide-react';

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Developer";
  const userRole = localStorage.getItem("userRole") || "developer";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-700 mb-1">
              💻 Welcome, {userName}
            </h1>
            <p className="text-gray-600">
              You are logged in as a <strong>{userRole}</strong>.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="space-y-4">
          {/* 🔹 JSON Formatter */}
          <div className="cursor-pointer p-4 bg-green-50 hover:shadow-md border border-green-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <FileJson className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800 group-hover:text-green-900 transition">
                JSON Formatter
              </h3>
              <p className="text-sm text-gray-700">
                Format and validate your JSON files for better readability and debugging.
              </p>
            </div>
          </div>

          {/* 🔹 Unit Test Generator */}
          <div className="cursor-pointer p-4 bg-gradient-to-r from-green-50 to-green-100 hover:scale-[1.02] hover:shadow-xl border border-green-200 rounded-xl transition-all duration-200 ease-in-out flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <TestTubes className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800 group-hover:text-green-900 transition">
                AI Unit Test Generator
              </h3>
              <p className="text-sm text-gray-700">
                Generate unit tests for your methods and classes using AI prompts.
              </p>
            </div>
          </div>

          {/* 🔹 AI Code Reviewer */}
          <div className="cursor-pointer p-4 bg-green-50 hover:shadow-md border border-green-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <Eye className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800 group-hover:text-green-900 transition">
                AI Code Reviewer
              </h3>
              <p className="text-sm text-gray-700">
                Receive AI-driven suggestions to improve code quality, security, and readability.
              </p>
            </div>
          </div>

          {/* 🔹 Secure Code Analyzer */}
          <div className="cursor-pointer p-4 bg-green-50 hover:shadow-md border border-green-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <ShieldAlert className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800 group-hover:text-green-900 transition">
                Secure Code Analyzer
              </h3>
              <p className="text-sm text-gray-700">
                Identify security issues in your code using static analysis and AI hints.
              </p>
            </div>
          </div>

          {/* 🔹 Refactor Assistant */}
          <div className="cursor-pointer p-4 bg-green-50 hover:shadow-md border border-green-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <WandSparkles className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800 group-hover:text-green-900 transition">
                Refactor Assistant
              </h3>
              <p className="text-sm text-gray-700">
                Improve structure and clarity of your code through AI-guided suggestions.
              </p>
            </div>
          </div>

          {/* 🔹 Regex Simplifier */}
          <div className="cursor-pointer p-4 bg-green-50 hover:shadow-md border border-green-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <Replace className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800 group-hover:text-green-900 transition">
                Regex Simplifier
              </h3>
              <p className="text-sm text-gray-700">
                Paste regex and get human-readable explanations and simplified alternatives.
              </p>
            </div>
          </div>

          {/* 🔹 Code Search Copilot */}
          <div className="cursor-pointer p-4 bg-green-50 hover:shadow-md border border-green-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <SearchCode className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800 group-hover:text-green-900 transition">
                Code Search Copilot
              </h3>
              <p className="text-sm text-gray-700">
                Search your codebase semantically using natural language and AI understanding.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
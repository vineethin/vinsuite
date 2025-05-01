import React from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Code, Globe, FileText, Lightbulb } from "lucide-react"; // Add lucide-react icons

import LogoutButton from "../../components/LogoutButton";

const QADashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Tester";
  const userRole = localStorage.getItem("userRole") || "tester";
  const isAdminView = !localStorage.getItem("userId");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-700 mb-1">
              🧪 Welcome, {userName}
            </h1>
            <p className="text-gray-600">
              You are logged in as a <strong>{userRole}</strong>.
            </p>
          </div>
          <div className="flex gap-4">
            {isAdminView && (
              <button
                onClick={() => navigate("/admin")}
                className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                🔙 Back to Admin
              </button>
            )}
            <LogoutButton />
          </div>
        </div>

        <div className="space-y-4">
          {/* 🔹 Test Case Generator */}
          <div
            onClick={() => navigate("/test-generator")}
            className="cursor-pointer p-4 bg-blue-50 hover:shadow-md border border-blue-100 rounded-lg transition transform hover:scale-105"
          >
            <div className="flex items-center space-x-4 mb-2">
              <BadgeCheck className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-700">
                Test Case Generator
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              Generate manual and automated test cases from feature text or UI image.
            </p>
          </div>

          {/* 🔹 Page Object Generator */}
          <div
            onClick={() => navigate("/page-object")}
            className="cursor-pointer p-4 bg-blue-50 hover:shadow-md border border-blue-100 rounded-lg transition transform hover:scale-105"
          >
            <div className="flex items-center space-x-4 mb-2">
              <Code className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-blue-700">
                Page Object Generator
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              Create Page Object Models for Selenium from UI screens.
            </p>
          </div>

          {/* 🔹 Accessibility Scanner */}
          <div
            onClick={() => navigate("/accessibility")}
            className="cursor-pointer p-4 bg-blue-50 hover:shadow-md border border-blue-100 rounded-lg transition transform hover:scale-105"
          >
            <div className="flex items-center space-x-4 mb-2">
              <Globe className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-blue-700">
                Accessibility Scanner
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              Run WCAG 2.0 accessibility tests using Axe & Lighthouse.
            </p>
          </div>

          {/* 🔹 Framework Generator */}
          <div
            onClick={() => navigate("/qa/framework-generator")}
            className="cursor-pointer p-4 bg-blue-50 hover:shadow-md border border-blue-100 rounded-lg transition transform hover:scale-105"
          >
            <div className="flex items-center space-x-4 mb-2">
              <FileText className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-blue-700">
                Framework Generator
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              Download a sample automation framework with your preferred language and testing tools.
            </p>
          </div>

          {/* 🔹 AI Defect Predictor */}
          <div
            onClick={() => navigate("/predict-defect")}
            className="cursor-pointer p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:scale-[1.02] hover:shadow-xl border border-yellow-200 rounded-xl transition-all duration-200 ease-in-out flex items-center space-x-4"
          >
            <div>
              <Lightbulb className="text-yellow-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-yellow-800">
                AI Defect Predictor
              </h3>
              <p className="text-sm text-gray-700">
                Estimate defect risk from change details using trained AI model.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QADashboard;

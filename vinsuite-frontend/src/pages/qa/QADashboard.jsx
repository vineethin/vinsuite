import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';

const QADashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Tester";
  const userRole = localStorage.getItem("userRole") || "tester";

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
          <LogoutButton />
        </div>

        <div className="space-y-4">
          {/* 🔹 Test Case Generator */}
          <div
            onClick={() => navigate('/test-generator')}
            className="cursor-pointer p-4 bg-blue-50 hover:shadow-md border border-blue-100 rounded-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">Test Case Generator</h3>
            <p className="text-sm text-gray-700">
              Generate manual and automated test cases from feature text or UI image.
            </p>
          </div>

          {/* 🔹 Page Object Generator */}
          <div
            onClick={() => navigate('/page-object')}
            className="cursor-pointer p-4 bg-blue-50 hover:shadow-md border border-blue-100 rounded-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">Page Object Generator</h3>
            <p className="text-sm text-gray-700">
              Create Page Object Models for Selenium from UI screens.
            </p>
          </div>

          {/* 🔹 Accessibility Scanner */}
          <div
            onClick={() => navigate('/accessibility')}
            className="cursor-pointer p-4 bg-blue-50 hover:shadow-md border border-blue-100 rounded-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">Accessibility Scanner</h3>
            <p className="text-sm text-gray-700">
              Run WCAG 2.0 accessibility tests using Axe & Lighthouse.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QADashboard;

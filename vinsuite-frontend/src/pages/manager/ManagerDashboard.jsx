import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import { BarChart3, ClipboardCheck, GaugeCircle, Users2, BarChart4, ClipboardList, BadgeCheck, Gauge } from 'lucide-react';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Manager";
  const userRole = localStorage.getItem("userRole") || "manager";
  const isAdminView = !localStorage.getItem("userId");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700 mb-1">
              📊 Welcome, {userName}
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
          {/* 🔹 Test Execution Heatmap */}
          <div className="cursor-pointer p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:scale-[1.02] hover:shadow-xl border border-indigo-200 rounded-xl transition-all duration-200 ease-in-out flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <BarChart3 className="text-indigo-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-800 group-hover:text-indigo-900 transition">
                Test Execution Heatmap
              </h3>
              <p className="text-sm text-gray-700">
                Visual insights into test pass/fail trends and coverage gaps.
              </p>
            </div>
          </div>

          {/* 🔹 Release Readiness Score */}
          <div className="cursor-pointer p-4 bg-indigo-50 hover:shadow-md border border-indigo-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <GaugeCircle className="text-indigo-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-800 group-hover:text-indigo-900 transition">
                Release Readiness Score
              </h3>
              <p className="text-sm text-gray-700">
                Evaluate project stability and quality metrics to determine go-live readiness.
              </p>
            </div>
          </div>

          {/* 🔹 Team Productivity Tracker */}
          <div className="cursor-pointer p-4 bg-indigo-50 hover:shadow-md border border-indigo-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <Gauge className="text-indigo-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-800 group-hover:text-indigo-900 transition">
                Team Productivity Tracker
              </h3>
              <p className="text-sm text-gray-700">
                Monitor execution rates, defect resolution, and QA contributions.
              </p>
            </div>
          </div>

          {/* 🔹 Sprint Progress Monitor */}
          <div className="cursor-pointer p-4 bg-indigo-50 hover:shadow-md border border-indigo-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <ClipboardCheck className="text-indigo-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-800 group-hover:text-indigo-900 transition">
                Sprint Progress Monitor
              </h3>
              <p className="text-sm text-gray-700">
                View burndown, blockers, and real-time sprint goal status.
              </p>
            </div>
          </div>

          {/* 🔹 Defect Aging Report */}
          <div className="cursor-pointer p-4 bg-indigo-50 hover:shadow-md border border-indigo-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <ClipboardList className="text-indigo-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-800 group-hover:text-indigo-900 transition">
                Defect Aging Report
              </h3>
              <p className="text-sm text-gray-700">
                See how long defects stay open and where resolution bottlenecks are.
              </p>
            </div>
          </div>

          {/* 🔹 Team Allocation Overview */}
          <div className="cursor-pointer p-4 bg-indigo-50 hover:shadow-md border border-indigo-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <Users2 className="text-indigo-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-800 group-hover:text-indigo-900 transition">
                Team Allocation Overview
              </h3>
              <p className="text-sm text-gray-700">
                Track who is working on what and spot overloading or underutilization.
              </p>
            </div>
          </div>

          {/* 🔹 Risk Dashboard */}
          <div className="cursor-pointer p-4 bg-indigo-50 hover:shadow-md border border-indigo-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <BarChart4 className="text-indigo-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-800 group-hover:text-indigo-900 transition">
                AI-Powered Risk Dashboard
              </h3>
              <p className="text-sm text-gray-700">
                Predict delivery risks based on story velocity, test gaps, and defect backlog.
              </p>
            </div>
          </div>

          {/* 🔹 Milestone Readiness Checker */}
          <div className="cursor-pointer p-4 bg-indigo-50 hover:shadow-md border border-indigo-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <BadgeCheck className="text-indigo-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-800 group-hover:text-indigo-900 transition">
                Milestone Readiness Checker
              </h3>
              <p className="text-sm text-gray-700">
                Get automated insights on whether you're ready to close upcoming milestones.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
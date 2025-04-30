import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import { DatabaseZap, History, FileDiff, MessageSquare, ScanSearch, FlaskConical, BarChartBig, FileText, Sparkles } from 'lucide-react';

const DBADashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "DBA";
  const userRole = localStorage.getItem("userRole") || "dba";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-rose-700 mb-1">
              🧩 Welcome, {userName}
            </h1>
            <p className="text-gray-600">
              You are logged in as a <strong>{userRole}</strong>.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="space-y-4">
          {/* 🔹 Query Optimizer */}
          <div
            onClick={() => navigate("/dba/query-optimizer")}
            className="cursor-pointer p-4 bg-rose-50 hover:shadow-md border border-rose-100 rounded-lg transition"
          >
            <h3 className="text-lg font-semibold text-rose-700">Query Optimizer</h3>
            <p className="text-sm text-gray-700">
              Paste slow SQL queries to get optimized versions with AI insights.
            </p>
          </div>

          {/* 🔹 Backup Status Checker */}
          <div
            onClick={() => navigate("/dba/backup-check")}
            className="cursor-pointer p-4 bg-rose-50 hover:shadow-md border border-rose-100 rounded-lg transition"
          >
            <h3 className="text-lg font-semibold text-rose-700">Backup Status Checker</h3>
            <p className="text-sm text-gray-700">
              View recent database backups and their status across environments.
            </p>
          </div>

          {/* 🔹 AI-Powered Schema Change Tracker */}
          <div
            onClick={() => navigate("/dba/schema-tracker")}
            className="cursor-pointer p-4 bg-gradient-to-r from-rose-50 to-rose-100 hover:scale-[1.02] hover:shadow-xl border border-rose-200 rounded-xl transition-all duration-200 ease-in-out flex items-center space-x-4 group"
          >
            <div className="flex-shrink-0">
              <FileDiff className="text-rose-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-800 group-hover:text-rose-900 transition">
                AI-Powered Schema Change Tracker
              </h3>
              <p className="text-sm text-gray-700">
                Track and analyze schema changes across environments with AI-based impact summaries.
              </p>
            </div>
          </div>

          {/* 🔹 AI SQL Explainer */}
          <div
            className="cursor-pointer p-4 bg-gradient-to-r from-rose-100 to-rose-200 hover:scale-[1.02] hover:shadow-xl border border-rose-300 rounded-xl transition-all duration-200 ease-in-out flex items-center space-x-4 group"
          >
            <div className="flex-shrink-0">
              <MessageSquare className="text-rose-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-800 group-hover:text-rose-900 transition">
                AI SQL Explainer
              </h3>
              <p className="text-sm text-gray-700">
                Paste complex SQL queries to get plain-English explanations and usage recommendations.
              </p>
            </div>
          </div>

          {/* 🔹 Query Anomaly Detector */}
          <div
            className="cursor-pointer p-4 bg-rose-50 hover:shadow-md border border-rose-100 rounded-lg transition flex items-center space-x-4 group"
          >
            <div className="flex-shrink-0">
              <ScanSearch className="text-rose-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-800 group-hover:text-rose-900 transition">
                Query Anomaly Detector
              </h3>
              <p className="text-sm text-gray-700">
                Detect abnormal queries and performance issues using AI-driven pattern analysis.
              </p>
            </div>
          </div>

          {/* 🔹 Test Data Generator */}
          <div
            className="cursor-pointer p-4 bg-rose-50 hover:shadow-md border border-rose-100 rounded-lg transition flex items-center space-x-4 group"
          >
            <div className="flex-shrink-0">
              <FlaskConical className="text-rose-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-800 group-hover:text-rose-900 transition">
                Test Data Generator
              </h3>
              <p className="text-sm text-gray-700">
                Automatically create realistic test data for database testing and QA scenarios.
              </p>
            </div>
          </div>

          {/* 🔹 Query Cost Visualizer */}
          <div
            className="cursor-pointer p-4 bg-rose-50 hover:shadow-md border border-rose-100 rounded-lg transition flex items-center space-x-4 group"
          >
            <div className="flex-shrink-0">
              <BarChartBig className="text-rose-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-800 group-hover:text-rose-900 transition">
                Query Cost Visualizer
              </h3>
              <p className="text-sm text-gray-700">
                Visualize and understand cost components (I/O, CPU, memory) of slow SQL statements.
              </p>
            </div>
          </div>

          {/* 🔹 Schema Documentation Generator */}
          <div
            className="cursor-pointer p-4 bg-rose-50 hover:shadow-md border border-rose-100 rounded-lg transition flex items-center space-x-4 group"
          >
            <div className="flex-shrink-0">
              <FileText className="text-rose-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-800 group-hover:text-rose-900 transition">
                Schema Documentation Generator
              </h3>
              <p className="text-sm text-gray-700">
                Generate detailed schema documentation using AI for team onboarding and audits.
              </p>
            </div>
          </div>

          {/* 🔹 Index Advisor */}
          <div
            className="cursor-pointer p-4 bg-rose-50 hover:shadow-md border border-rose-100 rounded-lg transition flex items-center space-x-4 group"
          >
            <div className="flex-shrink-0">
              <Sparkles className="text-rose-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-800 group-hover:text-rose-900 transition">
                AI Index Advisor
              </h3>
              <p className="text-sm text-gray-700">
                Get smart index recommendations based on query logs and table usage patterns.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DBADashboard;
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import { BookOpenText, TableProperties, FileText, BrainCog, FileTextIcon, ListChecks } from 'lucide-react';

const BADashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Business Analyst";
  const userRole = localStorage.getItem("userRole") || "ba";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-purple-700 mb-1">
              📘 Welcome, {userName}
            </h1>
            <p className="text-gray-600">
              You are logged in as a <strong>{userRole}</strong>.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="space-y-4">
          {/* 🔹 Requirement Parser */}
          <div className="cursor-pointer p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:scale-[1.02] hover:shadow-xl border border-purple-200 rounded-xl transition-all duration-200 ease-in-out flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <BookOpenText className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-800 group-hover:text-purple-900 transition">
                AI Requirement Parser
              </h3>
              <p className="text-sm text-gray-700">
                Extract epics, stories, and tests from requirement text using AI.
              </p>
            </div>
          </div>

          {/* 🔹 Traceability Matrix */}
          <div className="cursor-pointer p-4 bg-purple-50 hover:shadow-md border border-purple-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <ListChecks className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-800 group-hover:text-purple-900 transition">
                Traceability Matrix
              </h3>
              <p className="text-sm text-gray-700">
                Map requirements to test cases and results for better coverage validation.
              </p>
            </div>
          </div>

          {/* 🔹 Document Summarizer */}
          <div className="cursor-pointer p-4 bg-purple-50 hover:shadow-md border border-purple-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <FileText className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-800 group-hover:text-purple-900 transition">
                AI Document Summarizer
              </h3>
              <p className="text-sm text-gray-700">
                Summarize lengthy PRDs or feature specs into clear highlights using AI.
              </p>
            </div>
          </div>

          {/* 🔹 Acceptance Criteria Generator */}
          <div className="cursor-pointer p-4 bg-purple-50 hover:shadow-md border border-purple-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <BrainCog className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-800 group-hover:text-purple-900 transition">
                Acceptance Criteria Generator
              </h3>
              <p className="text-sm text-gray-700">
                Use AI to draft clear and testable acceptance criteria for user stories.
              </p>
            </div>
          </div>

          {/* 🔹 Requirements-to-Test Coverage Report */}
          <div className="cursor-pointer p-4 bg-purple-50 hover:shadow-md border border-purple-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <TableProperties className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-800 group-hover:text-purple-900 transition">
                Requirements Coverage Report
              </h3>
              <p className="text-sm text-gray-700">
                Auto-generate reports showing which stories are tested and which are not.
              </p>
            </div>
          </div>

          {/* 🔹 AI Specification Validator */}
          <div className="cursor-pointer p-4 bg-purple-50 hover:shadow-md border border-purple-100 rounded-lg transition flex items-center space-x-4 group">
            <div className="flex-shrink-0">
              <FileTextIcon className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-800 group-hover:text-purple-900 transition">
                AI Specification Validator
              </h3>
              <p className="text-sm text-gray-700">
                Scan specs for ambiguity, inconsistency, or missing edge cases using AI.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BADashboard;
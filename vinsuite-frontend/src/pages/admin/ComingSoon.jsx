import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const plannedFeatures = {
  manager: [
    "Team productivity dashboard",
    "Test Execution Heatmap",
    "Risk heatmaps",
    "Sprint Progress Monitor",
    "Release readiness scorecards",
    "Defect Aging Report",
    "Team Allocation Overview",
    "AI-Powered Risk Dashboard",
    "Milestone Readiness Checker"
  ],
  ba: [
    "AI-generated specs from user stories",
    "Traceability matrix auto-builder",
    "Acceptance criteria suggestion tool",
    "AI Requirement Parser",
    "AI Document Summarizer",
    "Requirements Coverage Report",
    "AI Specification Validator"
  ],
  dba: [
    "Query optimizer and visual explain plans",
    "Schema change impact tracker",
    "Scheduled backup verification tool",
    "AI SQL Explainer",
    "Query Anomaly Detector",
    "Test Data Generator",
    "Query Cost Visualizer",
    "AI Index Advisor",
    "Schema Documentation Generator"
  ],
  sales: [
    "Lead scoring with AI",
    "Follow-up email drafts",
    "Deal closure predictor",
    "Opportunity Forecasting",
    "Email Intent Analyzer",
    "Sales Chatbot Configurator",
    "Proposal Generator",
    "Meeting Summary Assistant",
    "Account Intelligence Aggregator",
    "Smart Follow-Up Scheduler"
  ],
  support: [
    "AI-suggested ticket replies",
    "Sentiment analysis",
    "Ticket tagging and routing",
    "Ticket Summarizer",
    "Smart Response Recommender",
    "Support Load Forecaster",
    "Knowledge Base Generator",
    "Escalation Detector",
    "Response Time Predictor"
  ],
  finance: [
    "Forecast variance analyzer",
    "Budget vs actual AI assistant",
    "Spend categorization insights",
    "Expense Categorizer",
    "Budget Deviation Analyzer",
    "Forecast Generator",
    "Invoice Summary Extractor",
    "Fraud Pattern Detector",
    "AI-Driven ROI Calculator",
    "Payroll Trend Predictor",
    "Procurement Optimization Engine"
  ]
};

const ComingSoon = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const tools = plannedFeatures[role] || [];

  const formattedRole = role ? role.replace("-", " ").toUpperCase() : "Role";

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-2 capitalize">
          🚧 {formattedRole} Tools — Coming Soon
        </h2>
        <p className="text-gray-600 mb-6">
          We're actively working to build powerful features for this role. Here's a sneak peek:
        </p>

        <ul className="text-left max-w-md mx-auto mb-6">
          {tools.length > 0 ? (
            tools.map((tool, idx) => (
              <li key={idx} className="mb-2 text-gray-700">✅ {tool}</li>
            ))
          ) : (
            <li className="text-gray-500 italic">Feature list coming soon.</li>
          )}
        </ul>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;

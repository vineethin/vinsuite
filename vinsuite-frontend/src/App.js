import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importing the AppContext hook
import { useApp } from "./contexts/AppContext";

// Core
import HomePage from './pages/core/HomePage';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProjectPage from "./pages/core/ProjectPage";
import TestCaseGenerator from "./pages/qa/TestCaseGenerator";
import ResultsPage from "./pages/core/ResultsPage";

// Import all other pages
import AccessibilityScanner from './pages/qa/AccessibilityScanner';
import PageObjectGenerator from './pages/qa/PageObjectGenerator';
import FrameworkGenerator from './pages/qa/FrameworkGenerator';
import AIResponseValidator from './pages/qa/AIResponseValidator';
import TestCoverageEstimator from './pages/qa/TestCoverageEstimator';
import ElementIdentifier from './components/tools/ElementIdentifier';
import AutomatedTestGenerator from './pages/qa/AutomatedTestGenerator';
import JsonFormatter from './pages/dev/JsonFormatter';
import UnitTestGenerator from './pages/dev/UnitTestGenerator';
import AIReviewer from './pages/dev/AIReviewer';
import AdminITDashboard from './pages/admin/AdminITDashboard';
import AdminFinanceDashboard from './pages/admin/AdminFinanceDashboard';
import AdminTraderDashboard from './pages/admin/AdminTraderDashboard';
import AdminSupportDashboard from './pages/admin/AdminSupportDashboard';
import AdminSalesDashboard from './pages/admin/AdminSalesDashboard';
import AdminHome from './pages/admin/AdminHome';
import ComingSoon from './pages/admin/ComingSoon';
import QADashboard from './pages/qa/QADashboard';
import DeveloperDashboard from './pages/dev/DeveloperDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import BADashboard from './pages/ba/BADashboard';
import DBADashboard from './pages/dba/DBADashboard';
import SalesDashboard from './pages/sales/SalesDashboard';
import SupportDashboard from './pages/support/SupportDashboard';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import DefectPredictor from './components/tools/DefectPredictor';
import MainRouter from './routes/MainRouter';

function App() {
  const { userId, userRole, userDepartment } = useApp(); // Use context for user data

  const isLoggedIn = !!userId; // Check login status from context state

  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Core */}
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/test-generator" element={<TestCaseGenerator />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/generate" element={<TestCaseGenerator />} />

        {/* QA Tools */}
        <Route path="/accessibility" element={<AccessibilityScanner />} />
        <Route path="/page-object" element={<PageObjectGenerator />} />
        <Route path="/qa/framework-generator" element={<FrameworkGenerator />} />
        <Route path="/qa/ai-response-validator" element={<AIResponseValidator />} />
        <Route path="/qa/test-coverage-estimator" element={<TestCoverageEstimator />} />
        <Route path="/xpath-image" element={<ElementIdentifier />} />
        <Route path="/qa/automated-test-generator" element={<AutomatedTestGenerator />} />

        {/* Dev Tools */}
        <Route path="/developer/json-formatter" element={<JsonFormatter />} />
        <Route path="/dev/unit-test-generator" element={<UnitTestGenerator />} />
        <Route path="/dev/ai-reviewer" element={<AIReviewer />} /> {/* ✅ NEWLY Added */}

        {/* Admin Department Dashboards */}
        <Route path="/admin/it" element={<AdminITDashboard />} />
        <Route path="/admin/finance" element={<AdminFinanceDashboard />} />
        <Route path="/admin/trader" element={<AdminTraderDashboard />} />
        <Route path="/admin/support" element={<AdminSupportDashboard />} />
        <Route path="/admin/sales" element={<AdminSalesDashboard />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/coming-soon/:role" element={<ComingSoon />} />

        {/* Dashboards */}
        <Route path="/qa" element={<QADashboard />} />
        <Route path="/dev" element={<DeveloperDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/ba" element={<BADashboard />} />
        <Route path="/dba" element={<DBADashboard />} />
        <Route path="/sales" element={<SalesDashboard />} />
        <Route path="/support" element={<SupportDashboard />} />
        <Route path="/finance" element={<FinanceDashboard />} />

        {/* Other Tools */}
        <Route path="/predict-defect" element={<DefectPredictor />} />

        {/* Role-Based Smart Routing */}
        <Route path="/dashboard" element={<MainRouter />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

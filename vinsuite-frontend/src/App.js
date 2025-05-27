import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./contexts/AppContext";

// Core Pages
import HomePage from './pages/core/HomePage';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProjectPage from "./pages/core/ProjectPage";
import ResultsPage from "./pages/core/ResultsPage";

// QA Tools
import TestCaseGenerator from "./pages/qa/TestCaseGenerator";
import AccessibilityScanner from './pages/qa/AccessibilityScanner';
import PageObjectGenerator from './pages/qa/PageObjectGenerator';
import FrameworkGenerator from './pages/qa/FrameworkGenerator';
import AIResponseValidator from './pages/qa/AIResponseValidator';
import TestCoverageEstimator from './pages/qa/TestCoverageEstimator';
import AutomatedTestGenerator from './pages/qa/AutomatedTestGenerator';
import PerformanceScriptGenerator from './pages/qa/PerformanceScriptGenerator';


// Dev Tools
import JsonFormatter from './pages/dev/JsonFormatter';
import UnitTestGenerator from './pages/dev/UnitTestGenerator';
import AIReviewer from './pages/dev/AIReviewer';
import CodeSummarizer from './pages/dev/CodeSummarizer';

// Admin Pages
import AdminITDashboard from './pages/admin/AdminITDashboard';
import AdminFinanceDashboard from './pages/admin/AdminFinanceDashboard';
import AdminTraderDashboard from './pages/admin/AdminTraderDashboard';
import AdminSupportDashboard from './pages/admin/AdminSupportDashboard';
import AdminSalesDashboard from './pages/admin/AdminSalesDashboard';
import AdminWriterDashboard from './pages/admin/AdminWriterDashboard'; // ✅ FIXED
import AdminHome from './pages/admin/AdminHome';
import ComingSoon from './pages/admin/ComingSoon';
import ViewUsers from './pages/admin/ViewUsers';

// Dashboards
import QADashboard from './pages/qa/QADashboard';
import DeveloperDashboard from './pages/dev/DeveloperDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import BADashboard from './pages/ba/BADashboard';
import DBADashboard from './pages/dba/DBADashboard';
import SalesDashboard from './pages/sales/SalesDashboard';
import SupportDashboard from './pages/support/SupportDashboard';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import WriterDashboard from './pages/writer/WriterDashboard';

// ✅ Writer Tools
import ContentGenerator from './pages/writer/ContentGenerator';
import EmailWriter from './pages/writer/EmailWriter';
import DocumentAssistant from './pages/writer/DocumentAssistant';

// Other Tools
import ElementIdentifier from './components/tools/ElementIdentifier';
import DefectPredictor from './components/tools/DefectPredictor';

// Smart Role-Based Router
import MainRouter from './routes/MainRouter';

// Not Found Page
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { isLoggedIn } = useApp();
  console.log("🔐 isLoggedIn =", isLoggedIn);

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Home or Redirect to Dashboard */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <HomePage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Core Pages */}
        <Route path="/project" element={<PrivateRoute><ProjectPage /></PrivateRoute>} />
        <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />

        {/* QA Tools */}
        <Route path="/test-generator" element={<PrivateRoute><TestCaseGenerator /></PrivateRoute>} />
        <Route path="/generate" element={<PrivateRoute><TestCaseGenerator /></PrivateRoute>} />
        <Route path="/accessibility" element={<PrivateRoute><AccessibilityScanner /></PrivateRoute>} />
        <Route path="/page-object" element={<PrivateRoute><PageObjectGenerator /></PrivateRoute>} />
        <Route path="/qa/framework-generator" element={<PrivateRoute><FrameworkGenerator /></PrivateRoute>} />
        <Route path="/qa/ai-response-validator" element={<PrivateRoute><AIResponseValidator /></PrivateRoute>} />
        <Route path="/qa/test-coverage-estimator" element={<PrivateRoute><TestCoverageEstimator /></PrivateRoute>} />
        <Route path="/qa/automated-test-generator" element={<PrivateRoute><AutomatedTestGenerator /></PrivateRoute>} />
        <Route path="/qa/performance-generator" element={<PrivateRoute><PerformanceScriptGenerator /></PrivateRoute>} />

        {/* Developer Tools */}
        <Route path="/developer/json-formatter" element={<PrivateRoute><JsonFormatter /></PrivateRoute>} />
        <Route path="/dev/unit-test-generator" element={<PrivateRoute><UnitTestGenerator /></PrivateRoute>} />
        <Route path="/dev/ai-reviewer" element={<PrivateRoute><AIReviewer /></PrivateRoute>} />
        <Route path="/dev/code-summarizer" element={<PrivateRoute><CodeSummarizer /></PrivateRoute>} />


        {/* Admin Dashboards */}
        <Route path="/admin/it" element={<PrivateRoute><AdminITDashboard /></PrivateRoute>} />
        <Route path="/admin/finance" element={<PrivateRoute><AdminFinanceDashboard /></PrivateRoute>} />
        <Route path="/admin/trader" element={<PrivateRoute><AdminTraderDashboard /></PrivateRoute>} />
        <Route path="/admin/support" element={<PrivateRoute><AdminSupportDashboard /></PrivateRoute>} />
        <Route path="/admin/sales" element={<PrivateRoute><AdminSalesDashboard /></PrivateRoute>} />
        <Route path="/admin/writer" element={<PrivateRoute><AdminWriterDashboard /></PrivateRoute>} /> 
        <Route path="/admin" element={<PrivateRoute><AdminHome /></PrivateRoute>} />
        <Route path="/coming-soon/:role" element={<PrivateRoute><ComingSoon /></PrivateRoute>} />
        <Route path="/admin/users" element={<ViewUsers />} />

        {/* Department Dashboards */}
        <Route path="/qa" element={<PrivateRoute><QADashboard /></PrivateRoute>} />
        <Route path="/dev" element={<PrivateRoute><DeveloperDashboard /></PrivateRoute>} />
        <Route path="/manager" element={<PrivateRoute><ManagerDashboard /></PrivateRoute>} />
        <Route path="/ba" element={<PrivateRoute><BADashboard /></PrivateRoute>} />
        <Route path="/dba" element={<PrivateRoute><DBADashboard /></PrivateRoute>} />
        <Route path="/sales" element={<PrivateRoute><SalesDashboard /></PrivateRoute>} />
        <Route path="/support" element={<PrivateRoute><SupportDashboard /></PrivateRoute>} />
        <Route path="/finance" element={<PrivateRoute><FinanceDashboard /></PrivateRoute>} />

        {/* Writer Tools */}
        <Route path="/writer/dashboard" element={<PrivateRoute><WriterDashboard /></PrivateRoute>} />
        <Route path="/writer/content-generator" element={<PrivateRoute><ContentGenerator /></PrivateRoute>} />
        <Route path="/writer/email-writer" element={<PrivateRoute><EmailWriter /></PrivateRoute>} />
        <Route path="/writer/document-assistant" element={<PrivateRoute><DocumentAssistant /></PrivateRoute>} />

        {/* Other Tools */}
        <Route path="/xpath-image" element={<PrivateRoute><ElementIdentifier /></PrivateRoute>} />
        <Route path="/predict-defect" element={<PrivateRoute><DefectPredictor /></PrivateRoute>} />

        {/* Smart Role-Based Routing */}
        <Route path="/dashboard/*" element={<PrivateRoute><MainRouter /></PrivateRoute>} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

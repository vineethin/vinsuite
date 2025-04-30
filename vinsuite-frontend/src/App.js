import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Core
import HomePage from './pages/core/HomePage';
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProjectPage from "./pages/core/ProjectPage";
import TestCaseGenerator from "./pages/core/TestCaseGenerator";
import ResultsPage from "./pages/core/ResultsPage";

// QA
import QADashboard from "./pages/qa/QADashboard";
import AccessibilityScanner from "./pages/qa/AccessibilityScanner";
import FrameworkGenerator from "./pages/qa/FrameworkGenerator";

// Dev
import DeveloperDashboard from "./pages/dev/DeveloperDashboard";
import PageObjectGenerator from "./pages/dev/PageObjectGenerator";
import JsonFormatter from './pages/dev/JsonFormatter';

// Manager, BA, DBA
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import BADashboard from "./pages/ba/BADashboard";
import DBADashboard from "./pages/dba/DBADashboard";

// DBA Tools
import QueryOptimizer from "./pages/dba/QueryOptimizer";
import BackupCheck from "./pages/dba/BackupCheck";
import SchemaTracker from "./pages/dba/SchemaTracker";

//other tools
import DefectPredictor from './components/tools/DefectPredictor';

function App() {
  const isLoggedIn = !!localStorage.getItem("userId");

  return (
    <Router>
      <Routes>
        {/* 🏠 Home */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <HomePage />} />

        {/* 🔐 Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 📁 Core */}
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/test-generator" element={<TestCaseGenerator />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/generate" element={<TestCaseGenerator />} />

        {/* 🎯 Dashboards */}
        <Route path="/qa" element={<QADashboard />} />
        <Route path="/dev" element={<DeveloperDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/ba" element={<BADashboard />} />
        <Route path="/dba" element={<DBADashboard />} />

        {/* 🛠️ QA Tools */}
        <Route path="/accessibility" element={<AccessibilityScanner />} />
        <Route path="/page-object" element={<PageObjectGenerator />} />
        <Route path="/qa/framework-generator" element={<FrameworkGenerator />} />

        {/* 🧰 Dev Tools */}
        <Route path="/developer/json-formatter" element={<JsonFormatter />} />
        
        {/* 🧰 Other Tools */}
        <Route path="/predict-defect" element={<DefectPredictor />} />

        {/* 🚀 Role-Based Redirect */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              (() => {
                const role = localStorage.getItem("userRole");
                switch (role) {
                  case "tester": return <Navigate to="/qa" />;
                  case "developer": return <Navigate to="/dev" />;
                  case "manager": return <Navigate to="/manager" />;
                  case "ba": return <Navigate to="/ba" />;
                  case "dba": return <Navigate to="/dba" />;
                  default: return <Navigate to="/project" />;
                }
              })()
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🔄 Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
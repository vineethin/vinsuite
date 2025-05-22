import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

// Dashboards
import QADashboard from '../pages/qa/QADashboard';
import DeveloperDashboard from '../pages/dev/DeveloperDashboard';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import BADashboard from '../pages/ba/BADashboard';
import DBADashboard from '../pages/dba/DBADashboard';
import SalesDashboard from '../pages/sales/SalesDashboard';
import SupportDashboard from '../pages/support/SupportDashboard';
import FinanceDashboard from '../pages/finance/FinanceDashboard';
import WriterDashboard from '../pages/writer/WriterDashboard';

// Admin Dashboards
import AdminITDashboard from '../pages/admin/AdminITDashboard';
import AdminFinanceDashboard from '../pages/admin/AdminFinanceDashboard';
import AdminTraderDashboard from '../pages/admin/AdminTraderDashboard';
import AdminSupportDashboard from '../pages/admin/AdminSupportDashboard';
import AdminSalesDashboard from '../pages/admin/AdminSalesDashboard';
import AdminWriterDashboard from '../pages/admin/AdminWriterDashboard';
import AdminHome from '../pages/admin/AdminHome';

// Tool Pages
import UnitTestGenerator from '../pages/dev/UnitTestGenerator';
import PerformanceScriptGenerator from '../pages/qa/PerformanceScriptGenerator';
import WebDefectScanner from '../pages/qa/WebDefectScanner'; 

const MainRouter = () => {
  const { userId, userRole, userDepartment, adminActingAs } = useApp();
  console.log("🧠 userRole:", userRole, "| adminActingAs:", adminActingAs);
  console.log("🧠 userDepartment:", userDepartment);
  console.log("🧠 userId:", userId);

  if (!userId || !userRole) {
    return <Navigate to="/login" replace />;
  }

  const isQA = ["qa", "tester", "sdet", "admin"].includes(userRole?.toLowerCase()) || adminActingAs === "tester";


  return (
    <Routes>
      {/* QA */}
      {isQA && (
        <>
          <Route path="" element={<QADashboard />} />
          <Route path="qa/performance-generator" element={<PerformanceScriptGenerator />} />
        </>
      )}

      {/* 🔥 Force render QA Web Defect Scanner temporarily */}
      <Route path="qa/web-defect-scanner" element={<WebDefectScanner />} />

      {/* Developer */}
      {(userRole === 'developer' || userRole === 'dev') && (
        <>
          <Route path="" element={<DeveloperDashboard />} />
          <Route path="dev/unit-test-generator" element={<UnitTestGenerator />} />
        </>
      )}

      {/* Other Roles */}
      {userRole === 'manager' && <Route path="" element={<ManagerDashboard />} />}
      {userRole === 'ba' && <Route path="" element={<BADashboard />} />}
      {userRole === 'dba' && <Route path="" element={<DBADashboard />} />}
      {(userRole === 'saleslead' || userRole === 'sales') && <Route path="" element={<SalesDashboard />} />}
      {userRole === 'support' && <Route path="" element={<SupportDashboard />} />}
      {userRole === 'finance' && <Route path="" element={<FinanceDashboard />} />}
      {userRole === 'writer' && <Route path="" element={<WriterDashboard />} />}

      {/* Admin Dashboards Based on Department */}
      {userRole === 'admin' && (
        <>
          {userDepartment?.toLowerCase() === 'it' && <Route path="" element={<AdminITDashboard />} />}
          {userDepartment?.toLowerCase() === 'finance' && <Route path="" element={<AdminFinanceDashboard />} />}
          {userDepartment?.toLowerCase() === 'trader' && <Route path="" element={<AdminTraderDashboard />} />}
          {userDepartment?.toLowerCase() === 'support' && <Route path="" element={<AdminSupportDashboard />} />}
          {userDepartment?.toLowerCase() === 'sales' && <Route path="" element={<AdminSalesDashboard />} />}
          {userDepartment?.toLowerCase() === 'writer' && <Route path="" element={<AdminWriterDashboard />} />}
          {!userDepartment && <Route path="" element={<AdminHome />} />}
        </>
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
};

export default MainRouter;

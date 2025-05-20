import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

// QA Pages
import QADashboard from '../pages/qa/QADashboard';
import TestCaseGenerator from '../pages/qa/TestCaseGenerator';
import PageObjectGenerator from '../pages/qa/PageObjectGenerator';
import TestCoverageEstimator from '../pages/qa/TestCoverageEstimator';
import AutomatedTestGenerator from '../pages/qa/AutomatedTestGenerator';
import PerformanceScriptGenerator from '../pages/qa/PerformanceScriptGenerator';
import TestMyPage from '../pages/qa/TestMyPage';

// Dev Pages
import DeveloperDashboard from '../pages/dev/DeveloperDashboard';
import UnitTestGenerator from '../pages/dev/UnitTestGenerator';

// Other Dashboards
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

const MainRouter = () => {
  const { userId, userRole, userDepartment, adminActingAs } = useApp();

  if (!userId || !userRole) {
    return <Navigate to="/login" replace />;
  }

  const isQA = userRole === 'qa' || userRole === 'tester' || adminActingAs === 'tester';
  const isDev = userRole === 'developer' || userRole === 'dev';

  return (
    <Routes>
      <Route path="dashboard">
        {/* QA Routes */}
        {isQA && (
          <Route path="qa">
            <Route index element={<QADashboard />} />
            <Route path="test-generator" element={<TestCaseGenerator />} />
            <Route path="page-object" element={<PageObjectGenerator />} />
            <Route path="test-coverage-estimator" element={<TestCoverageEstimator />} />
            <Route path="automated-test-generator" element={<AutomatedTestGenerator />} />
            <Route path="performance-generator" element={<PerformanceScriptGenerator />} />
            <Route path="test-my-page" element={<TestMyPage />} />
          </Route>
        )}

        {/* Developer Routes */}
        {isDev && (
          <Route path="dev">
            <Route index element={<DeveloperDashboard />} />
            <Route path="unit-test-generator" element={<UnitTestGenerator />} />
          </Route>
        )}

        {/* Other Roles */}
        {userRole === 'manager' && <Route path="manager" element={<ManagerDashboard />} />}
        {userRole === 'ba' && <Route path="ba" element={<BADashboard />} />}
        {userRole === 'dba' && <Route path="dba" element={<DBADashboard />} />}
        {(userRole === 'saleslead' || userRole === 'sales') && (
          <Route path="sales" element={<SalesDashboard />} />
        )}
        {userRole === 'support' && <Route path="support" element={<SupportDashboard />} />}
        {userRole === 'finance' && <Route path="finance" element={<FinanceDashboard />} />}
        {userRole === 'writer' && <Route path="writer/dashboard" element={<WriterDashboard />} />}

        {/* Admin Dashboards by Department */}
        {userRole === 'admin' && (
          <>
            {userDepartment?.toLowerCase() === 'it' && (
              <Route path="admin/it" element={<AdminITDashboard />} />
            )}
            {userDepartment?.toLowerCase() === 'finance' && (
              <Route path="admin/finance" element={<AdminFinanceDashboard />} />
            )}
            {userDepartment?.toLowerCase() === 'trader' && (
              <Route path="admin/trader" element={<AdminTraderDashboard />} />
            )}
            {userDepartment?.toLowerCase() === 'support' && (
              <Route path="admin/support" element={<AdminSupportDashboard />} />
            )}
            {userDepartment?.toLowerCase() === 'sales' && (
              <Route path="admin/sales" element={<AdminSalesDashboard />} />
            )}
            {userDepartment?.toLowerCase() === 'writer' && (
              <Route path="admin/writer" element={<AdminWriterDashboard />} />
            )}
            {!userDepartment && <Route path="admin" element={<AdminHome />} />}
          </>
        )}

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to={getDefaultRoute(userRole)} replace />} />
      </Route>
    </Routes>
  );
};

// Helper function to fallback to the right dashboard
function getDefaultRoute(role) {
  switch (role) {
    case 'qa':
    case 'tester':
      return '/dashboard/qa';
    case 'developer':
    case 'dev':
      return '/dashboard/dev';
    case 'manager':
      return '/dashboard/manager';
    case 'ba':
      return '/dashboard/ba';
    case 'dba':
      return '/dashboard/dba';
    case 'saleslead':
    case 'sales':
      return '/dashboard/sales';
    case 'support':
      return '/dashboard/support';
    case 'finance':
      return '/dashboard/finance';
    case 'writer':
      return '/dashboard/writer/dashboard';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/dashboard';
  }
}

export default MainRouter;
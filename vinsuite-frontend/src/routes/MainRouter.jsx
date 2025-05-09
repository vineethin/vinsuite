import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext'; // Import useApp hook

// Dashboards
import QADashboard from '../pages/qa/QADashboard';
import DeveloperDashboard from '../pages/dev/DeveloperDashboard';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import BADashboard from '../pages/ba/BADashboard';
import DBADashboard from '../pages/dba/DBADashboard';
import SalesDashboard from '../pages/sales/SalesDashboard';
import SupportDashboard from '../pages/support/SupportDashboard';
import FinanceDashboard from '../pages/finance/FinanceDashboard';

// Admin Dashboards
import AdminITDashboard from '../pages/admin/AdminITDashboard';
import AdminFinanceDashboard from '../pages/admin/AdminFinanceDashboard';
import AdminTraderDashboard from '../pages/admin/AdminTraderDashboard';
import AdminSupportDashboard from '../pages/admin/AdminSupportDashboard';
import AdminSalesDashboard from '../pages/admin/AdminSalesDashboard';
import AdminHome from '../pages/admin/AdminHome';

// Dev Tools
import UnitTestGenerator from '../pages/dev/UnitTestGenerator'; // ✅ Import tool page

const MainRouter = () => {
  const { userRole, userDepartment } = useApp(); // Use context for role and department

  useEffect(() => {
    if (!userRole) {
      <Navigate to="/login" />;
    }
  }, [userRole]);

  if (!userRole) return <Navigate to="/login" />;

  return (
    <Routes>
      {/* Role-based dashboards */}
      {(userRole === 'qa' || userRole === 'tester') && <Route path="/" element={<QADashboard />} />}
      {(userRole === 'developer' || userRole === 'dev') && (
        <>
          <Route path="/" element={<DeveloperDashboard />} />
          <Route path="/dev/unit-test-generator" element={<UnitTestGenerator />} />
        </>
      )}
      {userRole === 'manager' && <Route path="/" element={<ManagerDashboard />} />}
      {userRole === 'ba' && <Route path="/" element={<BADashboard />} />}
      {userRole === 'dba' && <Route path="/" element={<DBADashboard />} />}
      {(userRole === 'saleslead' || userRole === 'sales') && <Route path="/" element={<SalesDashboard />} />}
      {userRole === 'support' && <Route path="/" element={<SupportDashboard />} />}
      {userRole === 'finance' && <Route path="/" element={<FinanceDashboard />} />}

      {/* Admin department-based routing */}
      {userRole === 'admin' && (
        <>
          {userDepartment === 'IT' && <Route path="/" element={<AdminITDashboard />} />}
          {userDepartment === 'Finance' && <Route path="/" element={<AdminFinanceDashboard />} />}
          {userDepartment === 'Trader' && <Route path="/" element={<AdminTraderDashboard />} />}
          {userDepartment === 'Support' && <Route path="/" element={<AdminSupportDashboard />} />}
          {userDepartment === 'Sales' && <Route path="/" element={<AdminSalesDashboard />} />}
          {!userDepartment && <Route path="/" element={<AdminHome />} />}
        </>
      )}

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default MainRouter;

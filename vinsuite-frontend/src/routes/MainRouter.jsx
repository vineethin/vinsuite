import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
  const role = localStorage.getItem('userRole');
  const department = localStorage.getItem('userDepartment');

  if (!role) return <Navigate to="/login" />;

  return (
    <Routes>
      {/* Role-based dashboards */}
      {(role === 'qa' || role === 'tester') && <Route path="/" element={<QADashboard />} />}
      {(role === 'developer' || role === 'dev') && (
        <>
          <Route path="/" element={<DeveloperDashboard />} />
          <Route path="/dev/unit-test-generator" element={<UnitTestGenerator />} />
        </>
      )}
      {role === 'manager' && <Route path="/" element={<ManagerDashboard />} />}
      {role === 'ba' && <Route path="/" element={<BADashboard />} />}
      {role === 'dba' && <Route path="/" element={<DBADashboard />} />}
      {(role === 'saleslead' || role === 'sales') && <Route path="/" element={<SalesDashboard />} />}
      {role === 'support' && <Route path="/" element={<SupportDashboard />} />}
      {role === 'finance' && <Route path="/" element={<FinanceDashboard />} />}

      {/* Admin department-based routing */}
      {role === 'admin' && (
        <>
          {department === 'IT' && <Route path="/" element={<AdminITDashboard />} />}
          {department === 'Finance' && <Route path="/" element={<AdminFinanceDashboard />} />}
          {department === 'Trader' && <Route path="/" element={<AdminTraderDashboard />} />}
          {department === 'Support' && <Route path="/" element={<AdminSupportDashboard />} />}
          {department === 'Sales' && <Route path="/" element={<AdminSalesDashboard />} />}
          {!department && <Route path="/" element={<AdminHome />} />}
        </>
      )}

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default MainRouter;

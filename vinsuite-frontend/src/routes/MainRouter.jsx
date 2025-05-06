import React from 'react';
import { Navigate } from 'react-router-dom';

// Department Dashboards
import QADashboard from '../pages/qa/QADashboard';
import DeveloperDashboard from '../pages/dev/DeveloperDashboard';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import BADashboard from '../pages/ba/BADashboard';
import DBADashboard from '../pages/dba/DBADashboard';
import SalesDashboard from '../pages/sales/SalesDashboard';
import SupportDashboard from '../pages/support/SupportDashboard';
import FinanceDashboard from '../pages/finance/FinanceDashboard';

// Admin Department Dashboards
import AdminITDashboard from '../pages/admin/AdminITDashboard';
import AdminFinanceDashboard from '../pages/admin/AdminFinanceDashboard';
import AdminTraderDashboard from '../pages/admin/AdminTraderDashboard';
import AdminSupportDashboard from '../pages/admin/AdminSupportDashboard';
import AdminSalesDashboard from '../pages/admin/AdminSalesDashboard';
import AdminHome from '../pages/admin/AdminHome';

const MainRouter = () => {
    const role = localStorage.getItem('userRole');
    const department = localStorage.getItem('userDepartment');

    if (!role) return <Navigate to="/login" />;

    // ✅ Admin: department-based or fallback to console
    if (role === 'admin') {
        switch (department) {
            case 'IT': return <AdminITDashboard />;
            case 'Finance': return <AdminFinanceDashboard />;
            case 'Trader': return <AdminTraderDashboard />;
            case 'Support': return <AdminSupportDashboard />;
            case 'Sales': return <AdminSalesDashboard />;
            default: return <AdminHome />; // no department selected
        }
    }

    // ✅ Other roles
    switch (role) {
        case 'qa':
        case 'tester':
            return <QADashboard />;
        case 'developer':
        case 'dev':
            return <DeveloperDashboard />;
        case 'manager':
            return <ManagerDashboard />;
        case 'ba':
            return <BADashboard />;
        case 'dba':
            return <DBADashboard />;
        case 'saleslead':
        case 'sales':
            return <SalesDashboard />;
        case 'support':
            return <SupportDashboard />;
        case 'finance':
            return <FinanceDashboard />;
        default:
            return <Navigate to="/project" />;
    }
};

export default MainRouter;

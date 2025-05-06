import React from 'react';
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminFinanceDashboard = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-green-700 mb-2">💰 Admin Finance Dashboard</h1>
            <p className="text-gray-600 mb-4">Department: Finance</p>

            {/* 🔄 Department Switcher */}
            <AdminDeptSwitcher />

            {/* 🧩 Coming Soon Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Forecast Variance Analyzer</h3>
                    <p>Identify gaps between forecasted and actuals.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Budget Assistant</h3>
                    <p>AI-powered tool to help with budgeting decisions.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Spend Analyzer</h3>
                    <p>Breakdown and categorize expenses with AI.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Fraud Pattern Detector</h3>
                    <p>Detect suspicious transactions using ML models.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Invoice Summary Extractor</h3>
                    <p>Parse and summarize financial documents.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">ROI Predictor</h3>
                    <p>Predict return on investments using AI modeling.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-6">
                🔐 Built for smarter financial forecasting and expense optimization.
            </p>
        </div>
    );
};

export default AdminFinanceDashboard;

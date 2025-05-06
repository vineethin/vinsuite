import React from 'react';
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminSalesDashboard = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-red-700 mb-2">📊 Admin Sales Dashboard</h1>
            <p className="text-gray-600 mb-4">Department: Sales</p>

            {/* 🔄 Department Switcher */}
            <AdminDeptSwitcher />

            {/* 🧩 Coming Soon Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Lead Scoring</h3>
                    <p>Use AI to prioritize and score sales leads.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Follow-Up Email Generator</h3>
                    <p>Draft personalized follow-up emails automatically.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Deal Closure Predictor</h3>
                    <p>Predict likelihood of deal success with ML insights.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Meeting Summary Assistant</h3>
                    <p>Summarize client meetings and highlight action items.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Account Intelligence</h3>
                    <p>Aggregate buyer data and trends for better targeting.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Proposal Generator</h3>
                    <p>Auto-generate client proposals based on opportunity data.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-6">
                🔐 Built to empower smarter sales decisions with AI-driven insights.
            </p>
        </div>
    );
};

export default AdminSalesDashboard;

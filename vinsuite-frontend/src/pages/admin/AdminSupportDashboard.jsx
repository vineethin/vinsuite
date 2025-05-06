import React from 'react';
import AdminDeptSwitcher from '../../components/admin/AdminDeptSwitcher';

const AdminSupportDashboard = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-green-700 mb-2">🛠️ Admin Support Dashboard</h1>
            <p className="text-gray-600 mb-4">Department: Support</p>

            {/* 🔄 Department Switcher */}
            <AdminDeptSwitcher />

            {/* 🧩 Coming Soon Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">AI-Suggested Ticket Replies</h3>
                    <p>Respond faster with AI-generated solutions.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Sentiment Analyzer</h3>
                    <p>Understand customer mood in real-time.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Smart Ticket Routing</h3>
                    <p>Automatically route tickets to the right agent.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Ticket Summarizer</h3>
                    <p>Summarize long ticket conversations with one click.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Knowledge Base Generator</h3>
                    <p>Convert resolved tickets into knowledge articles.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
                <div className="border rounded p-4 opacity-50">
                    <h3 className="font-bold text-lg">Response Time Predictor</h3>
                    <p>Estimate and improve agent response SLAs.</p>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-6">
                🔐 Support excellence powered by predictive AI tools.
            </p>
        </div>
    );
};

export default AdminSupportDashboard;

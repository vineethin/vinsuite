import React from "react";
import { useNavigate } from "react-router-dom";

const tools = [
    "Lead Scoring AI",
    "Opportunity Forecasting",
    "Email Intent Analyzer",
    "Sales Chatbot Configurator",
    "Proposal Generator",
    "Meeting Summary Assistant",
    "Account Intelligence Aggregator",
    "Smart Follow-Up Scheduler",
];

const SalesDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-700">
                        📊 Sales Lead Dashboard
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, idx) => (
                        <div
                            key={idx}
                            className="bg-white shadow rounded p-5 hover:shadow-lg transition-all"
                        >
                            <h3 className="text-lg font-semibold mb-2">{tool}</h3>
                            <p className="text-gray-600 text-sm">[Placeholder for future AI integration]</p>
                            <button className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm">
                                Launch
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;

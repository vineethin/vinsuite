import React from 'react';
import { useNavigate } from 'react-router-dom';

const WriterDashboard = () => {
    const navigate = useNavigate();

    const tools = [
        {
            name: 'Content Generator',
            description: 'Create blogs, articles, or website content using AI.',
            path: '/writer/content-generator',
            icon: '✍️',
        },
        {
            name: 'Email Writer',
            description: 'Generate personalized emails for marketing or outreach.',
            path: '/writer/email-writer',
            icon: '📧',
        },
        {
            name: 'Document Assistant',
            description: 'Draft reports, proposals, and formatted docs fast.',
            path: '/writer/document-assistant',
            icon: '📝',
        },
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-purple-700 mb-6">🖋️ Writer Dashboard</h1>
            <p className="text-gray-600 mb-8">Boost your writing productivity with AI-powered tools.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                    <div
                        key={tool.name}
                        onClick={() => navigate(tool.path)}
                        className="cursor-pointer border border-gray-200 shadow hover:shadow-md p-6 rounded-2xl transition duration-300 bg-white"
                    >
                        <div className="text-4xl mb-2">{tool.icon}</div>
                        <h2 className="text-xl font-semibold mb-1">{tool.name}</h2>
                        <p className="text-gray-500 text-sm">{tool.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WriterDashboard;

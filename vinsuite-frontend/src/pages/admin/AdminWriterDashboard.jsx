import React from "react";
import { useNavigate } from "react-router-dom";
import AdminDeptSwitcher from "../../components/admin/AdminDeptSwitcher";

const AdminWriterDashboard = () => {
    const navigate = useNavigate();

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-purple-700 mb-2">✍️ Admin Writer Dashboard</h1>
            <p className="text-gray-600 mb-4">Department: Writer</p>

            {/* 🔄 Department Switcher */}
            <AdminDeptSwitcher />

            {/* 🧩 Tool Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div onClick={() => handleCardClick("/writer/content")} className="border p-4 rounded shadow hover:shadow-lg cursor-pointer">
                    <h3 className="font-semibold text-lg">Content Generator</h3>
                    <p className="text-sm text-gray-600 mt-1">Generate SEO blogs, articles, and marketing content with AI.</p>
                </div>

                <div onClick={() => handleCardClick("/writer/email")} className="border p-4 rounded shadow hover:shadow-lg cursor-pointer">
                    <h3 className="font-semibold text-lg">Email Writer</h3>
                    <p className="text-sm text-gray-600 mt-1">Compose outreach and campaign emails with ease.</p>
                </div>

                <div onClick={() => handleCardClick("/writer/document")} className="border p-4 rounded shadow hover:shadow-lg cursor-pointer">
                    <h3 className="font-semibold text-lg">Document Assistant</h3>
                    <p className="text-sm text-gray-600 mt-1">Create polished reports, proposals, and whitepapers.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminWriterDashboard;

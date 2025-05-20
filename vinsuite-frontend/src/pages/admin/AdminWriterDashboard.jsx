import React from "react";
import { useNavigate } from "react-router-dom";
import AdminDeptSwitcher from "../../components/admin/AdminDeptSwitcher";
import ToolHeader from "../../components/common/ToolHeader";

const AdminWriterDashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="p-8">
      {/* Header with Logout + Back to Dashboard */}
      <ToolHeader title="✍️ Admin Writer Dashboard" showBack={false} />

      <p className="text-gray-600 mb-4">Department: Writer</p>

      {/* Department Switcher */}
      <AdminDeptSwitcher />

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div
          onClick={() => handleCardClick("/writer/content-generator")}
          className="border p-4 rounded shadow hover:shadow-lg cursor-pointer"
        >
          <h3 className="font-semibold text-lg">Content Generator</h3>
          <p className="text-sm text-gray-600 mt-1">
            Generate SEO blogs, articles, and marketing content with AI.
          </p>
        </div>

        <div
          onClick={() => handleCardClick("/writer/email-writer")}
          className="border p-4 rounded shadow hover:shadow-lg cursor-pointer"
        >
          <h3 className="font-semibold text-lg">Email Writer</h3>
          <p className="text-sm text-gray-600 mt-1">
            Compose outreach and campaign emails with ease.
          </p>
        </div>

        <div
          onClick={() => handleCardClick("/writer/document-assistant")}
          className="border p-4 rounded shadow hover:shadow-lg cursor-pointer"
        >
          <h3 className="font-semibold text-lg">Document Assistant</h3>
          <p className="text-sm text-gray-600 mt-1">
            Create polished reports, proposals, and whitepapers.
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        🔐 Built for AI-powered content productivity
      </p>
    </div>
  );
};

export default AdminWriterDashboard;

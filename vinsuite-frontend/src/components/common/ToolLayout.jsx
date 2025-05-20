import React from "react";
import ToolHeader from "./ToolHeader";

const ToolLayout = ({ title, children, showBackToAdmin = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white shadow-sm px-6 py-4">
        <ToolHeader title={title} showBackToAdmin={showBackToAdmin} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default ToolLayout;

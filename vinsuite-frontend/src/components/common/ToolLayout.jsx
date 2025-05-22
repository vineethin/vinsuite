import React from "react";
import ToolHeader from "./ToolHeader";

const ToolLayout = ({
  title,
  children,
  showBack = true,
  showLogout = true,
  backTo = "/qa"
}) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#ecf0f3] via-[#dfe8f0] to-[#cddbe9] text-gray-900 overflow-hidden">
      {/* Decorative Robot-style Visual Element (Optional) */}
      <div className="absolute top-0 right-0 w-80 h-80 opacity-20 z-0 pointer-events-none animate-spin-slow">
        <img
          src="/assets/robot-arm-light.svg" // Replace with your path or comment if not using
          alt="AI Robot"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Soft Blurred Blob at Bottom-Left */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl z-0 animate-pulse" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToolHeader
          title={title}
          showBack={showBack}
          showLogout={showLogout}
          backTo={backTo}
        />
        <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ToolLayout;

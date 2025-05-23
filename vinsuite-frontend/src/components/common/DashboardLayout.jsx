import React from "react";
import DashboardHeader from "./DashboardHeader"; // ✅ Correct relative path

const DashboardLayout = ({
  title,
  children,
  showLogout = true,
  showBack = true,
  backTo = "/admin"
}) => {
  return (
    <div className="min-h-screen bg-white px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title={title}
          showLogout={showLogout}
          showBack={showBack}
          backTo={backTo}
        />
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

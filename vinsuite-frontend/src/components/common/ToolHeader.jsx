import React from "react";
import { useNavigate } from "react-router-dom";

const ToolHeader = ({
  title = "VinSuite Tool",
  showLogout = false,
  showBack = false,
  backTo = "/",
}) => {
  const navigate = useNavigate();

  const showBackBtn = showBack === true || showBack === "true";
  const showLogoutBtn = showLogout === true || showLogout === "true";

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow">
      {/* Left: Back Button */}
      <div className="w-1/4">
        {showBackBtn && (
          <button
            onClick={() => navigate(backTo)}
            className="text-blue-600 hover:underline"
          >
            ⬅ Back to Dashboard
          </button>
        )}
      </div>

      {/* Center: Title */}
      <div className="w-1/2 text-center">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Right: Logout */}
      <div className="w-1/4 text-right">
        {showLogoutBtn && (
          <button
            onClick={() => {
              console.log("🔒 Logout clicked");
            }}
            className="text-red-500 hover:underline"
          >
            🔒 Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default ToolHeader;

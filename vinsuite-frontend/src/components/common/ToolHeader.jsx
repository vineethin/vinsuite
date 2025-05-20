import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../LogoutButton";

const ToolHeader = ({
  title,
  showLogout = true,
  showBack = true,
  showBackToAdmin = false,
  backTo = "/qa"
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (showBackToAdmin) {
      localStorage.setItem("userDepartment", "IT");
      navigate("/admin");
    } else {
      navigate(backTo);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <div className="flex gap-2">
        {showBack && (
          <button
            onClick={handleBackClick}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 text-sm"
          >
            ⬅️ {showBackToAdmin ? "Back to Admin" : "Back to Dashboard"}
          </button>
        )}
        {showLogout && <LogoutButton />}
      </div>
    </div>
  );
};

export default ToolHeader;

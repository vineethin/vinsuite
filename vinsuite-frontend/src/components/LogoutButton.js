// src/components/LogoutButton.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

const LogoutButton = () => {
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // ✅ Clear state & storage
    setTimeout(() => navigate("/login"), 0); // ✅ Ensure redirect AFTER state clears
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

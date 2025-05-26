import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LogoutButton from "../LogoutButton";

const ToolHeader = ({ title, showLogout = true, showBack = true, backTo = "/qa" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white/5 p-4 rounded-xl shadow border border-white/10">
      {/* Title with styled brain icon */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-pink-100 text-pink-600 text-xl">
          🧠
        </span>
        {title}
      </h1>

      {/* Buttons */}
      <div className="flex gap-2 mt-4 sm:mt-0">
        {showBack && (
          <button
            onClick={() => navigate(backTo)}
            className="bg-white/20 hover:bg-white/30 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        )}
        {showLogout && <LogoutButton />}
      </div>
    </div>
  );
};

export default ToolHeader;

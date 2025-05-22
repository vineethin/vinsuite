import { useNavigate } from "react-router-dom";
import LogoutButton from "../LogoutButton";

const DashboardHeader = ({ title, backTo = "/admin", showLogout = true, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-blue-800 flex items-center space-x-2">
        <span>{title}</span>
      </h1>
      <div className="flex gap-2 items-center">
        {showBack && (
          <button
            onClick={() => navigate(backTo)}
            className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded flex items-center space-x-2 text-sm"
          >
            <span>⬅️</span>
            <span>Back to Admin</span>
          </button>
        )}
        {showLogout && <LogoutButton />}
      </div>
    </div>
  );
};


export default DashboardHeader;

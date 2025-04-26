import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("activeProjectId");
    localStorage.removeItem("generatedTestCases");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} style={{ float: 'right', margin: '1rem' }}>
      🚪 Logout
    </button>
  );
}

export default LogoutButton;

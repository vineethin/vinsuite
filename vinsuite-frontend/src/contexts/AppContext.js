// src/contexts/AppContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context
const AppContext = createContext();

// Create a provider to wrap your app
export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [userDepartment, setUserDepartment] = useState(localStorage.getItem("userDepartment") || "");
  const [activeProjectId, setActiveProjectId] = useState(localStorage.getItem("activeProjectId") || "");

  // Sync context state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userDepartment", userDepartment);
    localStorage.setItem("activeProjectId", activeProjectId);
  }, [userId, userName, userRole, userDepartment, activeProjectId]);

  // Logout function to clear state and localStorage
  const logout = () => {
    localStorage.clear();
    setUserId("");
    setUserName("");
    setUserRole("");
    setUserDepartment("");
    setActiveProjectId("");
  };

  // Provide state and functions to children components
  return (
    <AppContext.Provider
      value={{
        userId, setUserId,
        userName, setUserName,
        userRole, setUserRole,
        userDepartment, setUserDepartment,
        activeProjectId, setActiveProjectId,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access AppContext
export const useApp = () => useContext(AppContext);

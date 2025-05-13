// src/contexts/AppContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [userDepartment, setUserDepartment] = useState(localStorage.getItem("userDepartment") || "");
  const [activeProjectId, setActiveProjectId] = useState(localStorage.getItem("activeProjectId") || "");
  const [adminActingAs, setAdminActingAs] = useState(localStorage.getItem("adminActingAs") || "");

  // ✅ Derived login state
  const isLoggedIn = !!userId;

  // ✅ Helper to safely set only non-empty values
  const setItemIfNotEmpty = (key, value) => {
    if (value !== "") {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  };

  // ✅ Safe syncing to avoid infinite loops
  useEffect(() => setItemIfNotEmpty("userId", userId), [userId]);
  useEffect(() => setItemIfNotEmpty("userName", userName), [userName]);
  useEffect(() => setItemIfNotEmpty("userRole", userRole), [userRole]);
  useEffect(() => setItemIfNotEmpty("userDepartment", userDepartment), [userDepartment]);
  useEffect(() => setItemIfNotEmpty("activeProjectId", activeProjectId), [activeProjectId]);
  useEffect(() => setItemIfNotEmpty("adminActingAs", adminActingAs), [adminActingAs]);

  // Logout clears both context and storage
  const logout = () => {
    [
      "userId",
      "userName",
      "userRole",
      "userDepartment",
      "activeProjectId",
      "adminActingAs"
    ].forEach((key) => localStorage.removeItem(key));

    setUserId("");
    setUserName("");
    setUserRole("");
    setUserDepartment("");
    setActiveProjectId("");
    setAdminActingAs("");
  };

  return (
    <AppContext.Provider
      value={{
        userId, setUserId,
        userName, setUserName,
        userRole, setUserRole,
        userDepartment, setUserDepartment,
        activeProjectId, setActiveProjectId,
        adminActingAs, setAdminActingAs,
        logout,
        isLoggedIn
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => useContext(AppContext);

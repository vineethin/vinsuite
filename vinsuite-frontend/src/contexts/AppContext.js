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

  const isLoggedIn = !!userId;

  // Safely update localStorage based on value
  const setItemIfNotEmpty = (key, value) => {
    if (value !== "") {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  };

  // Sync values to localStorage on change
  useEffect(() => setItemIfNotEmpty("userId", userId), [userId]);
  useEffect(() => setItemIfNotEmpty("userName", userName), [userName]);
  useEffect(() => setItemIfNotEmpty("userRole", userRole), [userRole]);
  useEffect(() => setItemIfNotEmpty("userDepartment", userDepartment), [userDepartment]);
  useEffect(() => setItemIfNotEmpty("activeProjectId", activeProjectId), [activeProjectId]);
  useEffect(() => setItemIfNotEmpty("adminActingAs", adminActingAs), [adminActingAs]);

  // Restore from localStorage on mount to support browser back/forward
  useEffect(() => {
    const stored = {
      userId: localStorage.getItem("userId") || "",
      userName: localStorage.getItem("userName") || "",
      userRole: localStorage.getItem("userRole") || "",
      userDepartment: localStorage.getItem("userDepartment") || "",
      activeProjectId: localStorage.getItem("activeProjectId") || "",
      adminActingAs: localStorage.getItem("adminActingAs") || "",
    };

    if (stored.userId !== userId) setUserId(stored.userId);
    if (stored.userName !== userName) setUserName(stored.userName);
    if (stored.userRole !== userRole) setUserRole(stored.userRole);
    if (stored.userDepartment !== userDepartment) setUserDepartment(stored.userDepartment);
    if (stored.activeProjectId !== activeProjectId) setActiveProjectId(stored.activeProjectId);
    if (stored.adminActingAs !== adminActingAs) setAdminActingAs(stored.adminActingAs);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Logout clears everything
  const logout = () => {
    [
      "userId",
      "userName",
      "userRole",
      "userDepartment",
      "activeProjectId",
      "adminActingAs"
    ].forEach(key => localStorage.removeItem(key));

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

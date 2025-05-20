import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userDepartment, setUserDepartment] = useState("");
  const [activeProjectId, setActiveProjectId] = useState("");
  const [adminActingAs, setAdminActingAs] = useState("");

  const [hydrated, setHydrated] = useState(false); // ✅ NEW

  // ✅ Load from localStorage once on app mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(localStorage.getItem("userName") || "");
      setUserRole(localStorage.getItem("userRole") || "");
      setUserDepartment(localStorage.getItem("userDepartment") || "");
      setActiveProjectId(localStorage.getItem("activeProjectId") || "");
      setAdminActingAs(localStorage.getItem("adminActingAs") || "");
    }
    setHydrated(true); // ✅ Mark as hydrated
  }, []);

  // ✅ Keep localStorage updated
  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
  }, [userId]);

  useEffect(() => {
    if (userName) localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    if (userRole) localStorage.setItem("userRole", userRole);
  }, [userRole]);

  useEffect(() => {
    if (userDepartment) localStorage.setItem("userDepartment", userDepartment);
  }, [userDepartment]);

  useEffect(() => {
    if (activeProjectId) localStorage.setItem("activeProjectId", activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    if (adminActingAs) localStorage.setItem("adminActingAs", adminActingAs);
  }, [adminActingAs]);

  const isLoggedIn = !!userId;

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
        isLoggedIn,
        hydrated // ✅ Expose to consumers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

// authContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const initialIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);
  useEffect(() => {
    localStorage.setItem("isAdmin", isAdmin.toString());
  }, [isAdmin]);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const updateAdmin = () => {
    setIsAdmin(true);
    // alert(isAdmin);
  };
  const contextData = { isLoggedIn, isAdmin, updateAdmin, login, logout };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};

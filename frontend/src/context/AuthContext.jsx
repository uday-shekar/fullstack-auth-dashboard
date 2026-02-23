import React, { createContext, useContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext(null);

// AuthProvider wraps your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ✅ Persist user from localStorage if exists
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Login: save user + token
  const login = ({ user: userData, token }) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // Logout: clear everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Optional: auto-logout on token expiry could be added here

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
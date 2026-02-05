// client/src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const register = async (username, email, firstName, lastName, password) => {
    try {
      const response = await authAPI.register(
        username,
        email,
        firstName,
        lastName,
        password
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      localStorage.setItem("access_token", response.access_token);
      const userData = { username };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

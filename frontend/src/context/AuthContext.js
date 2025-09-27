// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // { _id, name, email, role, region, preferredLanguage }
  const [loading, setLoading] = useState(true);

  // on mount, load user from localStorage (if any)
  useEffect(() => {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      } catch (e) {
        console.warn("Invalid user in localStorage");
        localStorage.removeItem("user");
      }
    }
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // login wrapper used by Login page (also updates context)
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data?.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      const u = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        region: data.region,
        preferredLanguage: data.preferredLanguage
      };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
    }
    return data;
  };

  const register = async (name, email, password, role) => {
    return await authService.register(name, email, password, role);
  };

  const logout = () => {
    authService.logout();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook to use auth
export const useAuth = () => {
  return useContext(AuthContext);
};

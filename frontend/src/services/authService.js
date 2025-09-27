// src/services/authService.js
import api from "./api";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  // Expected backend response: { _id, name, email, role, token }
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role })
    );
  }
  return data;
};

export const register = async (name, email, password, role = "student", region = "") => {
  const { data } = await api.post("/auth/register", { name, email, password, role, region });
  // We do NOT auto-login here — user can login after registration.
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

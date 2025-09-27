// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useTranslation from "../hooks/useTranslation";
import NetworkError from "../components/NetworkError";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [networkError, setNetworkError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNetworkError(null);
    try {
      await login(email, password); // updates context and localStorage
      navigate("/");
    } catch (err) {
      if (err.isNetworkError || err.isServerError) {
        setNetworkError(err);
      } else {
        setError(err.response?.data?.msg || err.message || "Login failed");
      }
    }
  };

  const { t } = useTranslation();
  if (networkError?.isNetworkError || networkError?.isServerError) {
    return <NetworkError message={networkError.message} />;
  }
  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">{t("login")}</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="email" placeholder={t("email")} className="w-full p-2 border rounded" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder={t("password")} className="w-full p-2 border rounded" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">{t("login")}</button>
      </form>
    </div>
  );
};

export default Login;

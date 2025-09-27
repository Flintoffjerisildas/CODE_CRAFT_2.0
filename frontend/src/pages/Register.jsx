import React, { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import useTranslation from "../hooks/useTranslation";
import NetworkError from "../components/NetworkError";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [networkError, setNetworkError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNetworkError(null);
    try {
      await register(name, email, password, role, region);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      if (err.isNetworkError || err.isServerError) {
        setNetworkError(err);
      } else {
        setError(err.response?.data?.message || "Registration failed.");
      }
    }
  };

  const { t } = useTranslation();
  if (networkError?.isNetworkError || networkError?.isServerError) {
    return <NetworkError message={networkError.message} />;
  }
  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">{t("register")}</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder={t("fullName")}
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder={t("email")}
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t("password")}
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">{t("student")}</option>
          <option value="teacher">{t("teacher")}</option>
        </select>
        <select
          className="w-full p-2 border rounded"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        >
          <option value="">{t("selectRegion")}</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Punjab">Punjab</option>
          <option value="Odisha">Odisha</option>
          <option value="Telangana">Telangana</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Bihar">Bihar</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Delhi">Delhi</option>
          <option value="Haryana">Haryana</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
          <option value="Assam">Assam</option>
          <option value="Jammu & Kashmir">Jammu & Kashmir</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {t("register")}
        </button>
      </form>
    </div>
  );
};

export default Register;

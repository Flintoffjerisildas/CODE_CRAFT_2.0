import React, { useState, useEffect } from "react";
import useTranslation from "../hooks/useTranslation";
import { Link } from "react-router-dom";
import NetworkError from "../components/NetworkError";
import api from "../services/api";
import Hero from "../components/Hero";

const Home = () => {
  const { t } = useTranslation();
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    // Example: check API health or fetch something lightweight to trigger error UI if needed
    api.get("/health").catch((err) => {
      if (err.isNetworkError || err.isServerError) {
        setNetworkError(err);
      }
    });
  }, []);

  if (networkError?.isNetworkError || networkError?.isServerError) {
    return <NetworkError message={networkError.message} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col items-center justify-start">
      <Hero />
      <section className="w-full max-w-3xl mx-auto text-center mt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">{t("welcome")}</h2>
        <p className="text-lg text-gray-700 mb-6">{t("desc")}</p>
        <Link
          to="/videodrills"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors duration-150"
        >
          {t("goto")}
        </Link>
      </section>
    </div>
  );
};

export default Home;

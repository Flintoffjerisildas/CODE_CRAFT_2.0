// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  HomeIcon,
  PlayCircleIcon,
  TrophyIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  PuzzlePieceIcon,
  GlobeAltIcon
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useTranslation from "../hooks/useTranslation";
import LanguageSelect from "./LanguageSelect";
import AssessmentNotification from "./AssessmentNotification";

const Navbar = () => {
  const { user, setUser, logout } = useAuth();
  // Map language code to translation key
  const codeToLang = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    bn: "Bengali",
    te: "Telugu",
    mr: "Marathi"
  };
  const { t, lang } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(
    Object.keys(codeToLang).find(code => codeToLang[code] === (user?.preferredLanguage || lang)) || "en"
  );

  const handleLangChange = (newCode) => {
    setSelectedLang(newCode);
    const newLang = codeToLang[newCode] || "English";
    // Update user context and localStorage
    if (user) {
      const updatedUser = { ...user, preferredLanguage: newLang };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    // For non-logged-in users, could persist in localStorage if needed
  };

  return (
    <nav className="bg-gradient-to-r from-blue-100 to-pink-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-2xl font-extrabold text-blue-700">
              <PuzzlePieceIcon className="mr-2 h-8 w-8 text-blue-700" /> PrepEd
            </Link>
            <div className="ml-8 flex space-x-4">
              <Link to="/" className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                <HomeIcon className="mr-1 h-5 w-5" /> {t("home")}
              </Link>
              <Link to="/videodrills" className="flex items-center text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors">
                <PlayCircleIcon className="mr-1 h-5 w-5" /> {t("drills")}
              </Link>
              <Link to="/leaderboard" className="flex items-center text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors">
                <TrophyIcon className="mr-1 h-5 w-5" /> {t("leaderboard")}
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" className="flex items-center text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
                    <ChartBarIcon className="mr-1 h-5 w-5" /> {t("myDashboard")}
                  </Link>
                  {user.role === "student" && (
                    <div className="relative flex items-center">
                      <Link to="/my-assessments" className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors">
                        <ChartBarIcon className="mr-1 h-5 w-5" /> My Assessments
                      </Link>
                      <AssessmentNotification />
                    </div>
                  )}
                </>
              )}
              {user?.role === "teacher" && (
                <>
                  <Link to="/admin" className="flex items-center text-sm font-semibold text-gray-700 hover:text-green-700 transition-colors">
                    <ShieldCheckIcon className="mr-1 h-5 w-5" /> {t("admin")}
                  </Link>
                  <Link to="/teacher-assessments" className="flex items-center text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors">
                    <ChartBarIcon className="mr-1 h-5 w-5" /> Assessments
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Auth & Profile + Language */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <GlobeAltIcon className="h-6 w-6 text-blue-700 mr-2" />
              <LanguageSelect value={selectedLang} onChange={handleLangChange} hideLabel />
            </div>
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm flex items-center"><UserCircleIcon className="mr-1 h-5 w-5" />Hi, <strong>{user.name}</strong></span>
                <button
                  onClick={logout}
                  className="text-sm px-3 py-1 border rounded-full bg-white hover:bg-blue-100 transition-colors"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-sm px-3 py-1 border rounded-full bg-white hover:bg-blue-100 transition-colors">{t("login")}</Link>
                <Link to="/register" className="text-sm px-3 py-1 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-colors">{t("register")}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// src/hooks/useTranslation.js
import { useAuth } from "../context/AuthContext";
import translations from "../translations";

export default function useTranslation() {
  const { user } = useAuth();
  // Try to get preferredLanguage from user, else from localStorage, else default to English
  let lang = "English";
  if (user?.preferredLanguage) {
    lang = user.preferredLanguage;
  } else {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.preferredLanguage) lang = parsed.preferredLanguage;
      } catch {}
    }
  }
  function t(key) {
    return translations[key]?.[lang] || translations[key]?.["English"] || key;
  }
  return { t, lang };
}

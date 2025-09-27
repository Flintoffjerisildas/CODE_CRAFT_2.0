import React from "react";
import useTranslation from "../hooks/useTranslation";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
];

export default function LanguageSelect({ value, onChange, hideLabel }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center space-x-2">
      {!hideLabel && (
        <label htmlFor="lang-select" className="font-medium">{t("language")}</label>
      )}
      <select
        id="lang-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
}

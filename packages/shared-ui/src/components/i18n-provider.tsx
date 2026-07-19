"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { t, tWithParams, type Language } from "@ubar/shared-utils";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  tp: (key: string, params: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children, defaultLang = "en" }: { children: ReactNode; defaultLang?: Language }) {
  const [lang, setLangState] = useState<Language>(defaultLang);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("ubar_lang", newLang);
    }
  }, []);

  const translate = useCallback((key: string) => t(key, lang), [lang]);
  const translateWithParams = useCallback((key: string, params: Record<string, string | number>) => tWithParams(key, params, lang), [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translate, tp: translateWithParams }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={`flex items-center gap-1 rounded-lg border p-1 ${className}`}>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("so")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          lang === "so" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
        }`}
      >
        SO
      </button>
    </div>
  );
}

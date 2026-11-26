import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const SUPPORTED_LANGS = ['cs', 'en'];
const DEFAULT_LANG = 'cs';

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;

    const stored = localStorage.getItem('lang');
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

    return DEFAULT_LANG;
  });

  const [translations, setTranslations] = useState({});

  useEffect(() => {
    async function loadTranslations() {
      try {
        const res = await fetch(`/lang/${currentLang}.json`);
        if (res.ok) {
          const data = await res.json();
          setTranslations(data);
        }
      } catch (err) {
        console.error('Failed to load translations:', err);
      }
    }
    loadTranslations();
    localStorage.setItem('lang', currentLang);
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }

  function t(key, fallback) {
    const val = getNestedValue(translations, key);
    if (val !== undefined) return val;
    if (fallback !== undefined) return fallback;
    return key;
  }

  function setLanguage(lang) {
    if (SUPPORTED_LANGS.includes(lang)) {
      setCurrentLang(lang);
    }
  }

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

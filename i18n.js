// ============================================================
// i18n.js — Vícejazyčný překladový engine pro Tedův východní svět
// Podporuje: CZ (výchozí), EN (+ snadné přidání dalších jazyků)
// ============================================================

(function () {
    'use strict';

    const SUPPORTED_LANGS = ['cs', 'en'];
    const DEFAULT_LANG = 'cs';
    const LANG_FLAGS = { cs: 'CZ', en: 'EN' };
    const LANG_NAMES = { cs: 'Čeština', en: 'English' };

    let currentLang = DEFAULT_LANG;
    let translations = {};
    let translationsLoaded = false;

    // --- Detekce jazyka ---
    function detectLanguage() {
        // 1. URL parametr (?lang=en) — nejvyšší priorita
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;

        // 2. localStorage
        const stored = localStorage.getItem('lang');
        if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

        // 3. Jazyk prohlížeče
        const browserLang = (navigator.language || '').split('-')[0];
        if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

        return DEFAULT_LANG;
    }

    // --- Pomocná funkce pro přístup k vnořeným klíčům ---
    function getNestedValue(obj, path) {
        return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    }

    // --- Hlavní překladová funkce ---
    function t(key, fallback) {
        const val = getNestedValue(translations, key);
        if (val !== undefined) return val;
        if (fallback !== undefined) return fallback;
        return key; // Vrátí klíč jako fallback
    }

    // --- Aktualizace URL bez reloadu ---
    function updateUrl(lang) {
        const url = new URL(window.location);
        if (lang === DEFAULT_LANG) {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', lang);
        }
        window.history.replaceState({}, '', url);
    }

    // --- Aplikace překladů na DOM ---
    function applyTranslations() {
        // Textový obsah
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            if (val !== key) {
                el.textContent = val;
            }
        });

        // HTML obsah (pro elementy s ikonami apod.)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const val = t(key);
            if (val !== key) {
                el.innerHTML = val;
            }
        });

        // Placeholder atributy
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const val = t(key);
            if (val !== key) el.placeholder = val;
        });

        // Title atributy
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const val = t(key);
            if (val !== key) el.title = val;
        });

        // aria-label atributy
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const val = t(key);
            if (val !== key) el.setAttribute('aria-label', val);
        });

        // <option> elementy
        document.querySelectorAll('option[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            if (val !== key) el.textContent = val;
        });

        // Aktualizace <html lang="">
        document.documentElement.lang = currentLang;

        // Aktualizace <title>
        const titleKey = document.querySelector('title')?.getAttribute('data-i18n');
        if (titleKey) {
            document.title = t(titleKey);
        }

        // Aktualizace switcher stavu
        updateSwitcherState();

        // Dispatch custom event pro ostatní skripty
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
    }

    // --- Načtení překladů ---
    async function loadTranslations(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;

        try {
            // Zjistíme cestu k JSON souboru relativně k aktuální stránce
            const basePath = getBasePath();
            const response = await fetch(`${basePath}lang/${lang}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            translations = await response.json();
            currentLang = lang;
            localStorage.setItem('lang', lang);
            updateUrl(lang);
            translationsLoaded = true;
            applyTranslations();
        } catch (e) {
            console.error('i18n: Nepodařilo se načíst překlady pro jazyk:', lang, e);
            // Fallback: pokud selže EN, zkusíme CS
            if (lang !== DEFAULT_LANG) {
                console.warn('i18n: Fallback na výchozí jazyk:', DEFAULT_LANG);
                await loadTranslations(DEFAULT_LANG);
            }
        }
    }

    // --- Zjištění base path (pro případ vnořených složek) ---
    function getBasePath() {
        // V tomto projektu jsou všechny stránky v kořenovém adresáři
        return '';
    }

    // --- Změna jazyka ---
    async function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) return;
        if (lang === currentLang && translationsLoaded) return;
        await loadTranslations(lang);
    }

    // --- Injekce přepínače jazyků do navbaru ---
    function injectLanguageSwitcher() {
        // Najdeme kontejner s theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle || document.getElementById('lang-switcher')) return;

        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher';
        switcher.id = 'lang-switcher';

        SUPPORTED_LANGS.forEach(lang => {
            const btn = document.createElement('button');
            btn.className = 'lang-btn' + (lang === currentLang ? ' active' : '');
            btn.setAttribute('data-lang', lang);
            btn.setAttribute('title', LANG_NAMES[lang]);
            btn.setAttribute('aria-label', LANG_NAMES[lang]);
            btn.textContent = LANG_FLAGS[lang];
            btn.addEventListener('click', () => {
                if (lang !== currentLang) {
                    setLanguage(lang);
                }
            });
            switcher.appendChild(btn);
        });

        // Vložíme před theme toggle
        themeToggle.parentNode.insertBefore(switcher, themeToggle);
    }

    // --- Aktualizace stavu switcher tlačítek ---
    function updateSwitcherState() {
        const switcher = document.getElementById('lang-switcher');
        if (!switcher) return;
        switcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
        });
    }

    // --- Veřejné API ---
    window.i18n = {
        t: t,
        setLanguage: setLanguage,
        getCurrentLang: () => currentLang,
        isLoaded: () => translationsLoaded,
        applyTranslations: applyTranslations
    };

    // Detekce jazyka co nejdříve
    currentLang = detectLanguage();

    // --- Inicializace po načtení DOM ---
    document.addEventListener('DOMContentLoaded', () => {
        injectLanguageSwitcher();
        loadTranslations(currentLang);
    });

})();

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Dynamic locale loader — each language is a separate chunk
// Only the active language is loaded at init, others on demand
var localeLoaders = {
    fr: function() { return import('./locales/fr.json'); },
    en: function() { return import('./locales/en.json'); },
    br: function() { return import('./locales/br.json'); }
};

var supportedLngs = ['fr', 'en', 'br'];

function detectLanguage() {
    var stored = localStorage.getItem('i18nextLng');
    if (stored && supportedLngs.indexOf(stored) !== -1) return stored;
    var nav = navigator.language || '';
    if (nav.startsWith('pt')) return 'br';
    if (nav.startsWith('en')) return 'en';
    return 'fr';
}

async function loadLanguage(lang) {
    if (supportedLngs.indexOf(lang) === -1) lang = 'fr';
    if (i18n.hasResourceBundle(lang, 'translation')) return;
    var mod = await localeLoaders[lang]();
    i18n.addResourceBundle(lang, 'translation', mod.default || mod, true, true);
}

var initialLng = detectLanguage();

// Load initial language, then init i18n
var initPromise = loadLanguage(initialLng).then(function() {
    return i18n
        .use(initReactI18next)
        .init({
            lng: initialLng,
            fallbackLng: 'fr',
            supportedLngs: supportedLngs,
            interpolation: {
                escapeValue: false
            }
        });
});

// On language change, dynamically load the new bundle
i18n.on('languageChanged', function(lng) {
    localStorage.setItem('i18nextLng', lng);
    loadLanguage(lng);
});

// Export a ready promise for components that need to wait
export var i18nReady = initPromise;

export default i18n;

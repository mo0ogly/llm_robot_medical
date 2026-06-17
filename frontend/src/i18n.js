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

var loadedLanguages = new Set();
var i18nInitialized = false;

async function loadLanguage(lang) {
    if (supportedLngs.indexOf(lang) === -1) lang = 'fr';
    if (loadedLanguages.has(lang)) return;
    var mod = await localeLoaders[lang]();
    var resource = (mod && mod.default) ? mod.default : mod;

    if (!i18nInitialized) {
        // Premier appel : on initialise i18n AVEC la ressource. C'est le seul moment
        // où il est sûr d'utiliser l'API du store (addResourceBundle / hasResourceBundle).
        var initialResources = {};
        initialResources[lang] = { translation: resource };
        await i18n
            .use(initReactI18next)
            .init({
                lng: lang,
                fallbackLng: 'fr',
                supportedLngs: supportedLngs,
                resources: initialResources,
                interpolation: {
                    escapeValue: false
                }
            });
        i18nInitialized = true;
    } else {
        i18n.addResourceBundle(lang, 'translation', resource, true, true);
    }
    loadedLanguages.add(lang);
}

var initialLng = detectLanguage();

// Load initial language (which also initializes i18n on first call)
var initPromise = loadLanguage(initialLng);

// On language change, dynamically load the new bundle
i18n.on('languageChanged', function(lng) {
    localStorage.setItem('i18nextLng', lng);
    loadLanguage(lng);
});

// Export a ready promise for components that need to wait
export var i18nReady = initPromise;

export default i18n;

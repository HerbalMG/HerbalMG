import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './i18n/en.json';
import hi from './i18n/hi.json';
import ta from './i18n/ta.json';
import ma from './i18n/ma.json';
import te from './i18n/te.json';

// Debug available resources
console.log('Available translation resources:', {
  en,
  hi,
  ta,
  ma,
  te
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { faqs: en },
      hi: { faqs: hi },
      ma: { faqs: ma },
      te: { faqs: te },
      ta: { faqs: ta },
    },
    fallbackLng: 'en',
    debug: true, // Enable debug mode
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Debug i18n instance
console.log('i18n instance:', i18n);
console.log('Current language:', i18n.language);
console.log('Available languages:', Object.keys(i18n.options.resources));

export default i18n;

import {translations} from './translations.js';

export const supportedLanguages = Object.keys(translations);
export const defaultLanguage = 'es';
const storageKey = 'memelser.language';
let currentLanguage = defaultLanguage;

export function normalizeLanguage(value) {
  if (typeof value !== 'string') return null;
  const base = value.trim().toLowerCase().replaceAll('_', '-').split('-')[0];
  return supportedLanguages.includes(base) ? base : null;
}

export function resolveLanguage(urlLanguage, savedLanguage, browserLanguages = []) {
  return normalizeLanguage(urlLanguage) || normalizeLanguage(savedLanguage) ||
    browserLanguages.map(normalizeLanguage).find(Boolean) || defaultLanguage;
}

export function t(key, values = {}, locale = currentLanguage) {
  const language = normalizeLanguage(locale) || defaultLanguage;
  const template = translations[language][key] ?? translations[defaultLanguage][key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}

export function getLanguage() { return currentLanguage; }

export function setLanguage(value) {
  const language = normalizeLanguage(value) || defaultLanguage;
  try { localStorage.setItem(storageKey, language); } catch { /* Switching still works without storage. */ }
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set('lang', language);
  history.replaceState(null, '', nextUrl);
  renderLanguage(language, true);
}

function renderLanguage(language, announce = false) {
  currentLanguage = normalizeLanguage(language) || defaultLanguage;
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  const date = new Intl.DateTimeFormat(currentLanguage, {month: 'long', year: 'numeric', timeZone: 'UTC'})
    .format(new Date(Date.UTC(2026, 8, 1)));
  const numbers = new Intl.NumberFormat(currentLanguage);
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const values = {date};
    if (element.dataset.count !== undefined) values.count = numbers.format(Number(element.dataset.count));
    element.textContent = t(element.dataset.i18n, values);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });
  document.title = t('metaTitle');
  document.querySelector('meta[name="description"]').setAttribute('content', t('metaDescription'));
  document.querySelectorAll('input[name="language"]').forEach(input => {input.checked = input.value === currentLanguage;});
  document.getElementById('language-code').textContent = currentLanguage.toUpperCase();
  if (announce) document.getElementById('language-status').textContent = t('languageChanged');
  window.dispatchEvent(new CustomEvent('portfolio:languagechange', {detail: {language: currentLanguage}}));
}

if (typeof document !== 'undefined') {
  let savedLanguage;
  try { savedLanguage = localStorage.getItem(storageKey); } catch { /* Storage may be unavailable. */ }
  const url = new URL(window.location.href);
  renderLanguage(resolveLanguage(url.searchParams.get('lang'), savedLanguage, navigator.languages || [navigator.language]));
  document.querySelectorAll('input[name="language"]').forEach(input => {
    input.addEventListener('change', () => {if (input.checked) setLanguage(input.value);});
  });
}

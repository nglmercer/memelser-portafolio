import { createI18n } from 'vue-i18n';
import { translations } from '../locales/translations';
import { defaultLanguage, normalizeLanguage, readSavedLanguage } from '../core/language';

function initialLocale(): string {
  if (typeof window === 'undefined') return defaultLanguage;
  const url = new URL(window.location.href);
  const urlLang = normalizeLanguage(url.searchParams.get('lang'));
  let saved: string | null = null;
  try {
    saved = readSavedLanguage();
  } catch {
    /* Storage may be unavailable. */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : [];
  const browser = (nav as string[]).map(normalizeLanguage).find(Boolean);
  return urlLang || normalizeLanguage(saved) || browser || defaultLanguage;
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: defaultLanguage,
  messages: Object.fromEntries(Object.entries(translations).map(([locale, dict]) => [locale, dict])),
});

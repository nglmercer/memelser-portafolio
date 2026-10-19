import { translations } from '../locales/translations';

export const supportedLanguages: string[] = Object.keys(translations);
export const defaultLanguage = 'es';
export const LANGUAGE_STORAGE_KEY = 'memelser.language';

export function normalizeLanguage(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const base = value.trim().toLowerCase().replaceAll('_', '-').split('-')[0];
  return supportedLanguages.includes(base) ? base : null;
}

export function resolveLanguage(
  urlLanguage: unknown,
  savedLanguage: unknown,
  browserLanguages: readonly unknown[] = [],
): string {
  return (
    normalizeLanguage(urlLanguage) ||
    normalizeLanguage(savedLanguage) ||
    browserLanguages.map(normalizeLanguage).find(Boolean) ||
    defaultLanguage
  );
}

export function translate(
  key: string,
  values: Record<string, string | number> = {},
  locale?: string,
): string {
  const language = normalizeLanguage(locale ?? defaultLanguage) ?? defaultLanguage;
  const template: string =
    translations[language]?.[key] ?? translations[defaultLanguage]?.[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const replacement = values[name];
    return replacement === undefined ? match : String(replacement);
  });
}

/** Legacy alias kept for the verification scripts. */
export const t = translate;

export function readSavedLanguage(): string | null {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistLanguage(language: string): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    /* Switching still works without storage. */
  }
}

export const themes = ['lime', 'violet', 'cyan', 'ember', 'light'] as const;
export type Theme = (typeof themes)[number];

export const THEME_STORAGE_KEY = 'memelser.theme';

export function normalizeTheme(value: unknown): Theme {
  return (themes as readonly string[]).includes(value as string) ? (value as Theme) : 'light';
}

export function readSavedTheme(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Optional device preference. */
  }
}

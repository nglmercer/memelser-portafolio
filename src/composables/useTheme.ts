import { ref } from 'vue';
import { normalizeTheme, persistTheme, readSavedTheme, themes, type Theme } from '../core/theme';

export { themes, type Theme };

const activeTheme = ref<Theme>(normalizeTheme(typeof document !== 'undefined' ? readSavedTheme() : null));

function applyToDom(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  const background = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
}

export function useTheme() {
  function setTheme(value: unknown, announce = true): void {
    activeTheme.value = normalizeTheme(value);
    applyToDom(activeTheme.value);
    persistTheme(activeTheme.value);
    if (announce) {
      const key = 'theme' + activeTheme.value[0].toUpperCase() + activeTheme.value.slice(1);
      void key;
    }
    window.dispatchEvent(new CustomEvent('portfolio:themechange', { detail: { theme: activeTheme.value } }));
  }

  function initTheme(): void {
    activeTheme.value = normalizeTheme(readSavedTheme());
    applyToDom(activeTheme.value);
  }

  return { activeTheme, setTheme, initTheme };
}

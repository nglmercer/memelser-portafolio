import {t} from './i18n.js';

export const themes = ['lime', 'violet', 'cyan', 'ember', 'light'];
export function normalizeTheme(value) { return themes.includes(value) ? value : 'light'; }
let activeTheme = 'light';

export function setTheme(value, announce = true) {
  activeTheme = normalizeTheme(value);
  document.documentElement.dataset.theme = activeTheme;
  document.querySelectorAll('input[name="theme"]').forEach(input => {input.checked = input.value === activeTheme;});
  try {localStorage.setItem('memelser.theme', activeTheme);} catch { /* Optional device preference. */ }
  const background = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  document.querySelector('meta[name="theme-color"]').setAttribute('content', background);
  if (announce) {
    const key = 'theme' + activeTheme[0].toUpperCase() + activeTheme.slice(1);
    document.getElementById('theme-status').textContent = t('themeChanged', {theme:t(key)});
  }
  window.dispatchEvent(new CustomEvent('portfolio:themechange', {detail:{theme:activeTheme}}));
}

// Native disclosure + radio controls provide Enter/Space, Tab, and arrow-key navigation.
export function initializeDropdowns() {
  const menus = [...document.querySelectorAll('.preference-menu')];
  const close = (menu, restoreFocus = false) => {
    menu.open = false;
    if (restoreFocus) menu.querySelector('summary').focus();
  };
  menus.forEach(menu => {
    menu.addEventListener('toggle', () => {
      if (menu.open) menus.forEach(other => {if(other !== menu) close(other);});
    });
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) {event.preventDefault();close(menu, true);}
    });
    menu.addEventListener('focusout', event => {
      if (event.relatedTarget && !menu.contains(event.relatedTarget)) close(menu);
    });
    menu.querySelectorAll('input').forEach(input => {
      // Keep keyboard selection open so arrow keys can traverse the radio group.
      input.addEventListener('click', event => {if(event.detail > 0) close(menu, true);});
    });
  });
  document.addEventListener('pointerdown', event => {
    menus.forEach(menu => {if(menu.open && !menu.contains(event.target)) close(menu);});
  });
}

if (typeof document !== 'undefined') {
  let savedTheme;
  try {savedTheme = localStorage.getItem('memelser.theme');} catch {}
  setTheme(savedTheme, false);
  document.querySelectorAll('input[name="theme"]').forEach(input => {
    input.addEventListener('change', () => {if(input.checked) setTheme(input.value);});
  });
  initializeDropdowns();
}

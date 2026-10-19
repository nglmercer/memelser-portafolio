<template>
  <header class="header">
    <a href="#inicio" class="brand" aria-label="memelser, inicio" @click.prevent="go('home')">
      <span class="brand-icon">m.</span> memelser<span class="brand-slash">/</span>
    </a>
    <nav aria-label="Navegación principal">
      <div class="content-tabs" role="tablist" aria-label="Secciones" @keydown="onKeydown">
        <button
          v-for="item in tabs"
          :id="`tab-${item.view}`"
          :key="item.view"
          type="button"
          role="tab"
          :aria-selected="item.view === view"
          :aria-controls="`panel-${item.view}`"
          :tabindex="item.view === view ? 0 : -1"
          :data-view="item.view"
          @click="go(item.view)"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" v-html="item.icon"></svg>
          <span>{{ $t(item.label) }}</span>
        </button>
      </div>
    </nav>
    <div class="preference-controls">
      <details
        v-for="menu in ['theme', 'language']"
        :id="menu === 'theme' ? 'theme-menu' : 'language-menu'"
        :key="menu"
        class="preference-menu"
        @toggle="onToggle(menu, $event)"
      >
        <summary
          class="preference-trigger"
          :aria-label="menu === 'theme' ? String($t('theme')) : String($t('language'))"
        >
          <svg v-if="menu === 'theme'" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.6-3.2c-.6-.8 0-1.8 1-1.8H17a4 4 0 0 0 4-4 9 9 0 0 0-9-9z" />
            <circle cx="7.5" cy="10" r=".8" /><circle cx="10" cy="6.8" r=".8" />
            <circle cx="14" cy="6.8" r=".8" /><circle cx="17" cy="10" r=".8" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18z" />
          </svg>
          <span v-if="menu === 'language'" id="language-code" aria-hidden="true">{{ localeCode }}</span>
          <span v-else class="sr-only">{{ $t('theme') }}</span>
          <svg class="dropdown-caret" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <div class="preference-panel" :class="{ 'language-panel': menu === 'language' }">
          <fieldset>
            <legend>{{ menu === 'theme' ? $t('theme') : $t('language') }}</legend>
            <template v-if="menu === 'theme'">
              <label v-for="opt in themeOptions" :key="opt.value" class="preference-choice">
                <input
                  class="choice-radio"
                  type="radio"
                  name="theme"
                  :value="opt.value"
                  :checked="opt.value === activeTheme"
                  @change="setTheme(opt.value)"
                />
                <span class="theme-swatches" aria-hidden="true">
                  <i v-for="c in opt.colors" :key="c" :style="{ background: c }"></i>
                </span>
                <span>{{ $t(opt.label) }}</span>
                <svg class="choice-check" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </label>
            </template>
            <template v-else>
              <label v-for="code in supportedLanguages" :key="code" class="preference-choice">
                <input
                  class="choice-radio"
                  type="radio"
                  name="language"
                  :value="code"
                  :checked="code === current"
                  @change="setLanguage(code)"
                />
                <span :lang="code" dir="auto">{{ LANGUAGE_NAMES[code] ?? code }}</span>
                <svg class="choice-check" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </label>
            </template>
          </fieldset>
        </div>
      </details>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { supportedLanguages, LANGUAGE_NAMES } from '../composables/useLanguage';
import { useTheme } from '../composables/useTheme';
import { views, type View } from '../core/routing';

const props = defineProps<{ view: View }>();
const emit = defineEmits<{
  (e: 'navigate', view: View): void;
  (e: 'language', code: string): void;
}>();

const { locale } = useI18n();
const { activeTheme, setTheme } = useTheme();

const current = computed(() => String(locale.value));
const localeCode = computed(() => current.value.toUpperCase());

function setLanguage(code: string): void {
  emit('language', code);
}

const tabs = [
  {
    view: 'home' as View,
    label: 'home',
    icon: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  },
  {
    view: 'projects' as View,
    label: 'projects',
    icon: '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M8 5V3h8v2M3 11h18M10 11v3h4v-3"/>',
  },
  {
    view: 'blog' as View,
    label: 'blog',
    icon: '<path d="M5 3h10l4 4v14H5zM15 3v5h4M8 12h8M8 16h6"/>',
  },
  {
    view: 'about' as View,
    label: 'about',
    icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  },
];

function go(view: View): void {
  emit('navigate', view);
}

function onKeydown(event: KeyboardEvent): void {
  const order = [...views];
  const currentIndex = order.indexOf(props.view);
  const rtl = document.documentElement.dir === 'rtl';
  let next: number | undefined;
  if (event.key === 'ArrowRight') next = (currentIndex + (rtl ? -1 : 1) + order.length) % order.length;
  if (event.key === 'ArrowLeft') next = (currentIndex + (rtl ? 1 : -1) + order.length) % order.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = order.length - 1;
  if (next !== undefined) {
    event.preventDefault();
    go(order[next]);
  }
}

const themeOptions = [
  { value: 'lime', label: 'themeLime', colors: ['#10110f', '#171916', '#d0ff71'] },
  { value: 'violet', label: 'themeViolet', colors: ['#111018', '#1c1927', '#c5acff'] },
  { value: 'cyan', label: 'themeCyan', colors: ['#0b1419', '#13232b', '#70e0ee'] },
  { value: 'ember', label: 'themeEmber', colors: ['#19110e', '#2b1c16', '#ffbd88'] },
  { value: 'light', label: 'themeLight', colors: ['#f8fafc', '#ffffff', '#214acb'] },
] as const;

function onToggle(menu: string, event: Event): void {
  const target = event.target as HTMLDetailsElement;
  if (target.open) {
    document.querySelectorAll('.preference-menu').forEach((other) => {
      if (other !== target && other instanceof HTMLDetailsElement) other.open = false;
    });
  }
  void menu;
}

document.addEventListener('pointerdown', (event) => {
  document.querySelectorAll('.preference-menu').forEach((menu) => {
    if (
      menu instanceof HTMLDetailsElement &&
      menu.open &&
      event.target instanceof Node &&
      !menu.contains(event.target)
    ) {
      menu.open = false;
    }
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.preference-menu').forEach((menu) => {
      if (menu instanceof HTMLDetailsElement && menu.open) menu.open = false;
    });
  }
});
</script>

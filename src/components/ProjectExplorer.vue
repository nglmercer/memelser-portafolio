<template>
  <section
    v-if="store.data.value"
    id="repository-explorer"
    class="project-explorer"
    aria-labelledby="explorer-heading"
  >
    <div class="visual-heading">
      <h2 id="explorer-heading">{{ $t('projectExplorer') }}</h2>
      <div id="technology-badges">
        <span v-for="lang in topLanguages" :key="lang" class="technology-badge">{{ lang }}</span>
      </div>
    </div>
    <div v-if="!store.filtered.value.length" id="project-empty">{{ $t('noProjects') }}</div>
    <div class="explorer-compact-toolbar">
      <details id="project-picker" class="preference-menu">
        <summary class="project-picker-trigger" :aria-label="String($t('selectProject'))">
          <span id="project-picker-name">{{ store.selection.value?.name ?? $t('selectProject') }}</span>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <div class="project-picker-panel">
          <label class="sr-only" for="project-search">{{ $t('findProject') }}</label>
          <input
            id="project-search"
            v-model="store.search.value"
            type="search"
            autocomplete="off"
            :aria-label="String($t('findProject'))"
          />
          <div id="project-choices">
            <button
              v-for="(repo, i) in store.filtered.value"
              :key="repo.id"
              type="button"
              class="project-choice"
              :aria-pressed="i === store.index.value"
              @click="choose(i)"
            >
              <span>{{ repo.name }}</span>
              <small>{{ repo.language || $t('repositoryView') }}</small>
            </button>
          </div>
        </div>
      </details>
    </div>
    <div v-if="store.filtered.value.length" class="explorer-main">
      <div id="carousel-body">
        <div class="carousel-controls">
          <div class="carousel-pagination">
            <button
              id="project-prev"
              type="button"
              :aria-label="String($t('previousProject'))"
              :disabled="store.filtered.value.length < 2"
              @click="store.step(-1)"
            >
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
            </button>
            <span id="project-counter" aria-live="polite">{{ counter }}</span>
            <button
              id="project-next"
              type="button"
              :aria-label="String($t('nextProject'))"
              :disabled="store.filtered.value.length < 2"
              @click="store.step(1)"
            >
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
            </button>
          </div>
          <button
            v-if="store.selection.value?.demo"
            id="preview-toggle"
            type="button"
            :aria-pressed="store.previewMode.value === 'repo'"
            :aria-label="isLive ? String($t('repositoryView')) : String($t('liveDemo'))"
            :title="isLive ? String($t('repositoryView')) : String($t('liveDemo'))"
            @click="store.previewMode.value = isLive ? 'repo' : 'demo'"
          >
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" />
            </svg>
          </button>
          <a
            id="project-open"
            :href="openHref"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="String($t('openProject'))"
          >
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7" />
            </svg>
          </a>
        </div>
        <div class="browser-window">
          <iframe
            id="project-frame"
            :src="frameSrc"
            :title="frameTitle"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { GithubStore } from '../composables/useGithub';

const props = defineProps<{ store: GithubStore }>();
const { locale, t } = useI18n();

function formatNumber(value: number): string {
  return new Intl.NumberFormat(locale.value).format(value);
}

const counter = computed(
  () => `${formatNumber(props.store.index.value + 1)} / ${formatNumber(props.store.filtered.value.length)}`,
);

const isLive = computed(() => {
  const repo = props.store.selection.value;
  return props.store.previewMode.value === 'demo' && !!repo?.demo;
});

const frameSrc = computed(() => props.store.frameUrl(locale.value));

const frameTitle = computed(() => {
  const repo = props.store.selection.value;
  if (!repo) return '';
  return `${isLive.value ? t('liveDemo') : t('repositoryView')}: ${repo.name}`;
});

const openHref = computed(() => {
  const repo = props.store.selection.value;
  if (!repo) return 'https://github.com/nglmercer';
  return isLive.value && repo.demo ? repo.demo : repo.url;
});

const topLanguages = computed(() => {
  const data = props.store.data.value;
  if (!data) return [];
  return Object.keys(data.languages).slice(0, 6);
});

function choose(i: number): void {
  props.store.index.value = i;
  const menu = document.getElementById('project-picker');
  if (menu instanceof HTMLDetailsElement) menu.open = false;
}
</script>

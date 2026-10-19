<template>
  <section id="proyectos" class="projects section">
    <div class="section-heading">
      <h2>{{ $t('selected') }}</h2>
      <a
        href="https://github.com/nglmercer?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
        class="text-link"
      >
        <span>{{ $t('allRepos') }}</span>
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 19c-5 1-5-3-7-3M15 22v-4c0-1-.3-2-1-2 4-.5 6-2 6-6 0-1-.4-2-1-3 .2-1 .2-2-.2-3-2 0-3 1-3 1a12 12 0 0 0-7 0S7 4 5 4c-.4 1-.4 2-.2 3-.6 1-1 2-1 3 0 4 2 5.5 6 6-.7.5-1 1-1 2v4" />
        </svg>
        <span>GitHub</span>
      </a>
    </div>
    <div class="project-grid">
      <a
        v-for="project in projects"
        :key="project.repo"
        class="project"
        :href="`https://github.com/nglmercer/${project.repo}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="project-top">
          <span v-if="project.category">{{ $t(project.category) }}</span>
          <span>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
            </svg>
            <span>{{ $t('stars', { count: formatNumber(project.stars) }) }}</span>
          </span>
        </div>
        <div class="project-wordmark" :class="project.wordClass" aria-hidden="true">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" v-html="project.icon"></svg>
        </div>
        <div class="project-body">
          <h3>{{ project.repo }}</h3>
          <p><span>{{ $t(project.description) }}</span></p>
          <div class="project-footer">
            <span v-for="tag in project.tags" :key="tag" class="tag">{{ tagLabel(tag) }}</span>
            <span class="repo-label">
              <span>{{ $t('repository') }}</span>
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 19c-5 1-5-3-7-3M15 22v-4c0-1-.3-2-1-2 4-.5 6-2 6-6 0-1-.4-2-1-3 .2-1 .2-2-.2-3-2 0-3 1-3 1a12 12 0 0 0-7 0S7 4 5 4c-.4 1-.4 2-.2 3-.6 1-1 2-1 3 0 4 2 5.5 6 6-.7.5-1 1-1 2v4" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </div>
    <p class="source-note">{{ $t('snapshot') }}</p>
  </section>
  <section class="contributions section">
    <div class="contribution-heading">
      <h2>{{ $t('contributions') }}</h2>
      <p>{{ $t('contributionIntro') }}</p>
    </div>
    <div class="contribution-grid">
      <article v-for="item in contributionList" :key="item.repo" class="contribution">
        <a class="contribution-repo" :href="`https://github.com/${item.repo}`" target="_blank" rel="noopener noreferrer">
          <h3>{{ item.repo }}</h3>
          <span>{{ $t('stars', { count: formatNumber(item.stars) }) }}</span>
        </a>
        <p>{{ $t(item.text) }}</p>
        <div class="merge-record">
          <span>{{ $t('mergedContribution') }}</span><time :datetime="item.date">{{ item.date }}</time>
        </div>
        <a class="contribution-link" :href="item.pr" target="_blank" rel="noopener noreferrer">
          <span>{{ $t('viewContribution') }}</span><span>#{{ item.number }}</span>
        </a>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();

function formatNumber(value: number): string {
  return new Intl.NumberFormat(locale.value).format(value);
}

function tagLabel(tag: string): string {
  if (tag === 'streamingTag') return String(t('streamingTag'));
  return tag;
}

const codeIcon = '<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>';
const videoIcon = '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3M8 9v6l4-3z"/>';
const audioIcon = '<path d="M3 10v4M7 6v12M12 3v18M17 6v12M21 10v4"/>';
const hookIcon = '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M7 5h10M6 7l5 10M18 7l-5 10"/>';

const projects = [
  {
    repo: 'TikTools-app',
    category: 'streamCategory',
    stars: 25,
    icon: videoIcon,
    wordClass: '',
    description: 'projectTik',
    tags: ['Rust', 'streamingTag'],
  },
  {
    repo: 'freellmapiV2',
    category: 'aiCategory',
    stars: 18,
    icon: codeIcon,
    wordClass: 'api-word',
    description: 'projectAI',
    tags: ['Rust', 'API'],
  },
  {
    repo: 'qpwgraph-rs',
    category: 'audioCategory',
    stars: 3,
    icon: audioIcon,
    wordClass: 'audio-word',
    description: 'projectAudio',
    tags: ['Rust', 'PipeWire'],
  },
  {
    repo: 'wshook-extension',
    category: 'realtimeCategory',
    stars: 4,
    icon: hookIcon,
    wordClass: 'hook-word',
    description: 'projectHook',
    tags: ['TypeScript', 'WebSockets'],
  },
  {
    repo: 'tiktok-signer',
    category: '',
    stars: 7,
    icon: codeIcon,
    wordClass: '',
    description: 'projectSigner',
    tags: ['Rust'],
  },
  {
    repo: 'android-linux-desktop',
    category: '',
    stars: 6,
    icon: codeIcon,
    wordClass: '',
    description: 'projectAndroid',
    tags: ['Termux'],
  },
];

const contributionList = [
  {
    repo: 'napi-rs/napi-rs',
    stars: 7956,
    text: 'napiContribution',
    date: '2026-08-30',
    pr: 'https://github.com/napi-rs/napi-rs/pull/3463',
    number: '3463',
  },
  {
    repo: 'PerryTS/perry',
    stars: 4916,
    text: 'perryContribution',
    date: '2026-06-19',
    pr: 'https://github.com/PerryTS/perry/pull/5409',
    number: '5409',
  },
  {
    repo: 'sonorahq/sonora',
    stars: 1645,
    text: 'sonoraContribution',
    date: '2026-09-11',
    pr: 'https://github.com/sonorahq/sonora/pull/555',
    number: '555',
  },
];
</script>

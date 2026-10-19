<template>
  <main class="cv-page">
    <div class="cv-actions no-print">
      <router-link class="cv-back" to="/">{{ $t('home') }}</router-link>
      <button class="cv-print-button" type="button" @click="print">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-12-3h12v6H6z" />
        </svg>
        <span>{{ $t('cvPrint') }}</span>
      </button>
    </div>
    <article class="cv-sheet">
      <header class="cv-header">
        <div>
          <h1>Hernan Laime Condori</h1>
          <p class="cv-tagline">memelser · {{ $t('aboutIntro') }}</p>
          <p class="cv-meta">{{ $t('location') }} · @nglmercer</p>
        </div>
        <div class="cv-contact">
          <h2>{{ $t('cvContact') }}</h2>
          <p><a href="mailto:nglmercer@gmail.com">nglmercer@gmail.com</a></p>
          <p><a href="tel:+51918722242">+51 918 722 242</a></p>
          <p>github.com/nglmercer</p>
          <p>{{ $t('contactText') }}</p>
        </div>
      </header>
      <section class="cv-section">
        <h2>{{ $t('cvProfile') }}</h2>
        <p>{{ $t('aboutBody') }}</p>
      </section>
      <section class="cv-section">
        <h2>{{ $t('cvSkills') }}</h2>
        <ul class="cv-skills">
          <li><strong>{{ $t('webPractice') }}</strong><span>TypeScript · APIs · WebSockets</span></li>
          <li><strong>{{ $t('desktopPractice') }}</strong><span>Rust · Node.js · Webviews</span></li>
          <li><strong>{{ $t('livePractice') }}</strong><span>{{ $t('liveSkills') }}</span></li>
        </ul>
        <p v-if="topLanguages.length" class="cv-languages">
          <strong>{{ $t('githubLanguages') }}:</strong> {{ topLanguages.join(' · ') }}
        </p>
      </section>
      <section class="cv-section">
        <h2>{{ $t('selected') }}</h2>
        <ul class="cv-projects">
          <li v-for="project in projects" :key="project.repo">
            <strong>{{ project.repo }}</strong>
            <span> — {{ $t(project.description) }}</span>
            <span class="cv-tags">{{ project.tags.map(tagLabel).join(' · ') }}</span>
          </li>
        </ul>
      </section>
      <section class="cv-section">
        <h2>{{ $t('contributions') }}</h2>
        <ul class="cv-projects">
          <li v-for="item in contributions" :key="item.repo">
            <strong>{{ item.repo }}</strong>
            <span> — {{ $t(item.text) }} ({{ item.date }})</span>
          </li>
        </ul>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { showcaseContributions, showcaseProjects } from '../data/portfolio';
import { useGithub } from '../composables/useGithub';
import '../cv.css';

const { t } = useI18n();
const github = useGithub();
const projects = showcaseProjects;
const contributions = showcaseContributions;

const topLanguages = computed(() =>
  github.data.value ? Object.keys(github.data.value.languages).slice(0, 6) : [],
);

function tagLabel(tag: string): string {
  if (tag === 'streamingTag') return String(t('streamingTag'));
  return tag;
}

function print(): void {
  window.print();
}

onMounted(() => {
  document.title = `memelser — CV | ${String(t('portfolio'))}`;
  void github.load();
});
</script>

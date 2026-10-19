<template>
  <section id="sobre" class="about section">
    <div ref="stageRef" class="about-label portrait-stage">
      <img
        ref="portraitRef"
        class="about-avatar profile-portrait"
        src="/assets/avatar-original.png"
        width="460"
        height="460"
        alt="memelser"
      />
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </svg>
      <span>{{ $t('about') }}</span>
      <span class="identity-handle">@nglmercer</span>
    </div>
    <div class="about-content">
      <h2><span>{{ $t('greeting') }}</span><span>memelser.</span></h2>
      <p class="about-intro"><span>{{ $t('aboutIntro') }}</span></p>
      <p><span>{{ $t('aboutBody') }}</span></p>
    </div>
    <div class="practice-list">
      <div>
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" />
        </svg>
        <h3><span>{{ $t('webPractice') }}</span></h3>
        <span>TypeScript · APIs · WebSockets</span>
      </div>
      <div>
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="13" rx="2" /><path d="M12 16v5M7 21h10" />
        </svg>
        <h3><span>{{ $t('desktopPractice') }}</span></h3>
        <span>Rust · Node.js · Webviews</span>
      </div>
      <div>
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="6" width="13" height="12" rx="3" />
          <path d="m16 10 5-3v10l-5-3M8 9v6l4-3z" />
        </svg>
        <h3><span>{{ $t('livePractice') }}</span></h3>
        <span><span>{{ $t('liveSkills') }}</span></span>
      </div>
    </div>
  </section>
  <section id="contacto" class="contact section">
    <div class="contact-main">
      <h2>
        <span>{{ $t('contactFirst') }}</span><br />
        <span>{{ $t('contactSecond') }}</span><em><span>{{ $t('idea') }}</span></em>
      </h2>
      <div>
        <p><span>{{ $t('contactText') }}</span></p>
        <a class="button primary" href="https://github.com/nglmercer" target="_blank" rel="noopener noreferrer">
          <span>{{ $t('github') }}</span>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 19c-5 1-5-3-7-3M15 22v-4c0-1-.3-2-1-2 4-.5 6-2 6-6 0-1-.4-2-1-3 .2-1 .2-2-.2-3-2 0-3 1-3 1a12 12 0 0 0-7 0S7 4 5 4c-.4 1-.4 2-.2 3-.6 1-1 2-1 3 0 4 2 5.5 6 6-.7.5-1 1-1 2v4" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePortraitTilt } from '../composables/usePortraitTilt';

const stageRef = ref<HTMLElement | null>(null);
const portraitRef = ref<HTMLImageElement | null>(null);

onMounted(() => usePortraitTilt(stageRef, portraitRef));
</script>

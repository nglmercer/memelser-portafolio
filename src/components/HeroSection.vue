<template>
  <section id="inicio" class="hero">
    <div class="hero-copy">
      <h1>
        <span>{{ $t('headlineFirst') }}</span><br />
        <span>{{ $t('headlineSecond') }}</span><span class="dimension">{{ $t('dimension') }}<span class="period">.</span></span>
      </h1>
      <p>{{ $t('intro') }}</p>
      <a class="button primary" href="?view=projects" @click.prevent="goProjects">
        <span>{{ $t('explore') }}</span>
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="15" rx="3" />
          <path d="M8 5V3h8v2M3 11h18M10 11v3h4v-3" />
        </svg>
      </a>
    </div>
    <div ref="stageRef" class="hero-visual fluid-stage">
      <div ref="hostRef" class="fluid-surface" :class="{ 'vortex-unavailable': failed }">
        <canvas
          v-show="!failed"
          id="fluid"
          ref="canvasRef"
          width="640"
          height="640"
          role="img"
          :aria-label="String($t('fluidLabel'))"
        ></canvas>
        <div v-if="failed" class="vortex-fallback">{{ $t('fluidLabel') }}</div>
      </div>
      <div class="fluid-caption">
        <span>Navier–Stokes</span><span>{{ $t('fluidHint') }}</span>
      </div>
      <div v-if="!failed" class="fluid-controls">
        <button id="fluid-pause" type="button" :aria-pressed="paused" @click="toggle">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
          <span id="fluid-pause-label">{{ paused ? $t('animate') : $t('pause') }}</span>
        </button>
        <button id="fluid-reset" type="button" @click="reset">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 11a9 9 0 1 1 2 7M3 4v7h7" />
          </svg>
          <span>{{ $t('resetFluid') }}</span>
        </button>
      </div>
    </div>
    <div class="hero-bottom">
      <span><span>{{ $t('domains') }}</span></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFluidScene } from '../composables/useFluidScene';

const emit = defineEmits<{ (e: 'projects'): void }>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const hostRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const { paused, failed, toggle, reset, init } = useFluidScene(canvasRef, hostRef);

onMounted(() => init());

function goProjects(): void {
  emit('projects');
}
</script>

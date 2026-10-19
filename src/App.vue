<template>
  <div v-if="navigating" class="route-loader" role="status" aria-label="Loading">
    <div class="route-loader-mark" aria-hidden="true"><i>m.</i></div>
    <div class="route-loader-bar" aria-hidden="true"><i></i></div>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const router = useRouter();
const navigating = ref(false);
let timer = 0;

// Show feedback only when a redirect or route change takes noticeable time;
// instant transitions never flash the overlay.
router.beforeEach(() => {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    navigating.value = true;
  }, 200);
});
router.afterEach(() => {
  window.clearTimeout(timer);
  navigating.value = false;
});
</script>

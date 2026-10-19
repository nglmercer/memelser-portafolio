<template>
  <footer>
    <a class="brand" href="#inicio" @click.prevent="emit('home')">memelser<span class="brand-slash">/</span></a>
    <span><span>{{ $t('footer') }}</span></span>
  </footer>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'home'): void }>();
</script>

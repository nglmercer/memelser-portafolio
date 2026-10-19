import { createApp } from 'vue';
import App from './App.vue';
import { i18n } from './i18n';
import { router } from './router';
import './style.css';

createApp(App).use(router).use(i18n).mount('#app');

// Fade out the inline splash once the app has rendered its first frame.
requestAnimationFrame(() => {
  const loader = document.getElementById('app-loader');
  if (!loader) return;
  loader.classList.add('done');
  setTimeout(() => loader.remove(), 350);
});

<template>
  <a class="skip" href="?view=projects" @click.prevent="navigate('projects')"><span>{{ $t('skip') }}</span></a>
  <SiteHeader :view="view" @navigate="navigate" @language="setLanguage" />
  <main>
    <div id="panel-home" role="tabpanel" aria-labelledby="tab-home" tabindex="0" :hidden="view !== 'home'">
      <HeroSection @projects="navigate('projects')" />
      <GithubObservatory :store="github" />
    </div>
    <div
      id="panel-projects"
      role="tabpanel"
      aria-labelledby="tab-projects"
      tabindex="0"
      :hidden="view !== 'projects'"
    >
      <ProjectExplorer :store="github" />
      <ProjectsSection />
    </div>
    <div id="panel-blog" role="tabpanel" aria-labelledby="tab-blog" tabindex="0" :hidden="view !== 'blog'">
      <BlogSection :post="post" @open="(slug) => navigate('blog', slug)" @back="() => navigate('blog')" />
    </div>
    <div id="panel-about" role="tabpanel" aria-labelledby="tab-about" tabindex="0" :hidden="view !== 'about'">
      <AboutSection />
    </div>
  </main>
  <SiteFooter @home="navigate('home')" />
  <div class="sr-only" id="theme-status" role="status" aria-live="polite"></div>
  <div class="sr-only" id="language-status" role="status" aria-live="polite"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AboutSection from '../components/AboutSection.vue';
import BlogSection from '../components/BlogSection.vue';
import GithubObservatory from '../components/GithubObservatory.vue';
import HeroSection from '../components/HeroSection.vue';
import ProjectExplorer from '../components/ProjectExplorer.vue';
import ProjectsSection from '../components/ProjectsSection.vue';
import SiteFooter from '../components/SiteFooter.vue';
import SiteHeader from '../components/SiteHeader.vue';
import { useGithub } from '../composables/useGithub';
import { useLanguage } from '../composables/useLanguage';
import { useTheme } from '../composables/useTheme';
import { posts, routeFromUrl, views, type PostSlug, type View } from '../core/routing';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const { initTheme } = useTheme();
const { setLanguage, initFromRoute } = useLanguage();
const github = useGithub();

const excerpts: Record<PostSlug, string> = {
  api: 'blogApiExcerpt',
  live: 'blogLiveExcerpt',
  desktop: 'blogDesktopExcerpt',
};

const view = computed<View>(() => {
  const v = route.query.view;
  if (v === 'portfolio') return 'home';
  return (views as readonly string[]).includes(v as string) ? (v as View) : 'home';
});

const post = computed<PostSlug | null>(() => {
  const p = route.query.post;
  return view.value === 'blog' && typeof p === 'string' && p in posts ? (p as PostSlug) : null;
});

function navigate(next: View, nextPost: PostSlug | null = null): void {
  const query: Record<string, string> = { ...(route.query as Record<string, string>), view: next };
  if (next === 'blog' && nextPost) query.post = nextPost;
  else delete query.post;
  router.push({ query }).catch(() => {});
  window.scrollTo({ top: 0 });
}

function updateMetadata(): void {
  document.title = post.value
    ? `${t(posts[post.value])} | memelser`
    : view.value === 'home'
      ? String(t('metaTitle'))
      : `${t(view.value)} | memelser`;
  const description = post.value
    ? excerpts[post.value]
    : view.value === 'blog'
      ? 'metaBlogDescription'
      : 'metaDescription';
  document.querySelector('meta[name="description"]')?.setAttribute('content', String(t(description)));
}

watch([view, post, locale], updateMetadata);

onMounted(() => {
  initTheme();
  initFromRoute();
  // Honor legacy hash links (#proyectos, #sobre, #blog-*) on first load.
  const initial = routeFromUrl(window.location.href);
  const queryView = route.query.view;
  if (!queryView || queryView === 'portfolio') {
    router
      .replace({
        query: {
          ...route.query,
          view: initial.view,
          ...(initial.post ? { post: initial.post } : {}),
        },
      })
      .catch(() => {});
  }
  updateMetadata();
  void github.load();
});
</script>

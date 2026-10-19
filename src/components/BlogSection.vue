<template>
  <section id="blog" class="blog section" aria-labelledby="blog-heading">
    <div v-if="!post" id="blog-index">
      <div class="blog-heading">
        <h1 id="blog-heading" tabindex="-1">{{ $t('blog') }}</h1>
        <p>{{ $t('metaBlogDescription') }}</p>
      </div>
      <div class="article-grid">
        <a
          v-for="article in articles"
          :key="article.slug"
          class="article-preview"
          :href="`?view=blog&post=${article.slug}`"
          @click.prevent="open(article.slug)"
        >
          <span class="article-symbol" aria-hidden="true">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" v-html="article.icon"></svg>
          </span>
          <span class="article-category">{{ $t(article.category) }}</span>
          <h2>{{ $t(article.title) }}</h2>
          <p>{{ $t(article.excerpt) }}</p>
          <span class="article-read">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1v15" />
            </svg>
            <span>{{ $t('readArticle') }}</span>
          </span>
        </a>
      </div>
    </div>
    <article
      v-for="article in articles"
      :id="`article-${article.slug}`"
      v-show="post === article.slug"
      :key="`reader-${article.slug}`"
      class="article-reader"
      :aria-labelledby="`article-${article.slug}-title`"
    >
      <a class="reader-back" href="?view=blog" @click.prevent="back">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5-7 7 7 7M3 12h18" /></svg>
        <span>{{ $t('backBlog') }}</span>
      </a>
      <span class="article-category">{{ $t(article.category) }}</span>
      <h1 :id="`article-${article.slug}-title`" tabindex="-1">{{ $t(article.title) }}</h1>
      <p class="article-lead">{{ $t(article.excerpt) }}</p>
      <div class="article-prose">
        <p>{{ $t(article.body) }}</p>
        <h2>{{ $t('blogDesignHeading') }}</h2>
        <p>{{ $t(article.design) }}</p>
        <h2>{{ $t('blogPracticeHeading') }}</h2>
        <p>{{ $t(article.practice) }}</p>
      </div>
      <div class="article-source">
        <span>{{ $t('relatedProject') }}</span>
        <a :href="`https://github.com/nglmercer/${article.repo}`" target="_blank" rel="noopener noreferrer">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 19c-5 1-5-3-7-3M15 22v-4c0-1-.3-2-1-2 4-.5 6-2 6-6 0-1-.4-2-1-3 .2-1 .2-2-.2-3-2 0-3 1-3 1a12 12 0 0 0-7 0S7 4 5 4c-.4 1-.4 2-.2 3-.6 1-1 2-1 3 0 4 2 5.5 6 6-.7.5-1 1-1 2v4" />
          </svg>
          {{ article.repo }}
        </a>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import type { PostSlug } from '../core/routing';

defineProps<{ post: PostSlug | null }>();
const emit = defineEmits<{
  (e: 'open', post: PostSlug): void;
  (e: 'back'): void;
}>();

const articles = [
  {
    slug: 'api' as PostSlug,
    category: 'aiCategory',
    title: 'blogApiTitle',
    excerpt: 'blogApiExcerpt',
    body: 'blogApiBody',
    design: 'blogApiDesign',
    practice: 'blogApiPractice',
    repo: 'freellmapiV2',
    icon: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>',
  },
  {
    slug: 'live' as PostSlug,
    category: 'streamCategory',
    title: 'blogLiveTitle',
    excerpt: 'blogLiveExcerpt',
    body: 'blogLiveBody',
    design: 'blogLiveDesign',
    practice: 'blogLivePractice',
    repo: 'wshook-extension',
    icon: '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3M8 9v6l4-3z"/>',
  },
  {
    slug: 'desktop' as PostSlug,
    category: 'desktopPractice',
    title: 'blogDesktopTitle',
    excerpt: 'blogDesktopExcerpt',
    body: 'blogDesktopBody',
    design: 'blogDesktopDesign',
    practice: 'blogDesktopPractice',
    repo: 'webview-napi',
    icon: '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5M7 21h10"/>',
  },
];

function open(slug: PostSlug): void {
  emit('open', slug);
}

function back(): void {
  emit('back');
}
</script>

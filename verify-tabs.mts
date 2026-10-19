import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { posts, routeFromUrl, views } from './src/core/routing';

assert.deepEqual(routeFromUrl('https://example.test/'), { view: 'home', post: null });
assert.deepEqual(routeFromUrl('https://example.test/?view=portfolio'), { view: 'home', post: null });
assert.deepEqual(routeFromUrl('https://example.test/#proyectos'), { view: 'projects', post: null });
assert.deepEqual(routeFromUrl('https://example.test/#contacto'), { view: 'about', post: null });
assert.deepEqual(routeFromUrl('https://example.test/?view=blog&post=api&lang=ja'), { view: 'blog', post: 'api' });
assert.deepEqual(routeFromUrl('https://example.test/?view=blog&post=invalid'), { view: 'blog', post: null });
assert.deepEqual(routeFromUrl('https://example.test/?view=home&post=api'), { view: 'home', post: null });
assert.deepEqual(routeFromUrl('https://example.test/#blog'), { view: 'blog', post: null });

// The Vue shell must preserve the four tab panels, the three article routes,
// and the ?view= / ?post= URL contract from the legacy page.
const viewSource = readFileSync(new URL('./src/views/PortfolioView.vue', import.meta.url), 'utf8');
for (const v of views) {
  assert(viewSource.includes(`id="panel-${v}"`), `Missing tab panel: ${v}`);
  assert(viewSource.includes(`aria-labelledby="tab-${v}"`), `Missing tab label link: ${v}`);
}
assert(viewSource.includes("navigate('blog', slug)"), 'Blog previews must route to article views');
for (const slug of Object.keys(posts)) {
  assert(
    readFileSync(new URL('./src/components/BlogSection.vue', import.meta.url), 'utf8').includes(`slug: '${slug}'`),
    `Missing article route: ${slug}`,
  );
}
const header = readFileSync(new URL('./src/components/SiteHeader.vue', import.meta.url), 'utf8');
assert(header.includes('role="tablist"'), 'Tabs must keep the tablist pattern');
assert(header.includes('ArrowRight'), 'Tabs must keep arrow-key navigation');
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
assert(html.includes('<div id="app">'), 'index.html must mount the Vue app');
assert(html.includes('/src/main.ts'), 'index.html must load the TS entry');

console.log('Verified four tab panels, three article routes, keyboard tabs, and the ?view=/?post= URL contract.');

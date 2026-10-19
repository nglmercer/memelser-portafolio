import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { normalizeLanguage, resolveLanguage, t } from './src/core/language';
import { translations } from './src/locales/translations';

const locales = Object.keys(translations);
const keys = Object.keys(translations.es).sort();
for (const [locale, dictionary] of Object.entries(translations)) {
  assert.deepEqual(Object.keys(dictionary).sort(), keys, `${locale}: incomplete dictionary`);
  for (const [key, value] of Object.entries(dictionary)) assert(value.trim().length, `${locale}.${key}: empty translation`);
  for (const key of ['stars', 'snapshot', 'themeChanged']) {
    assert.deepEqual(dictionary[key].match(/\{\w+\}/g), translations.es[key].match(/\{\w+\}/g));
  }
}

// Every locale must be selectable in the Vue header (radio per language).
const header = readFileSync(new URL('./src/components/SiteHeader.vue', import.meta.url), 'utf8');
assert(header.includes('supportedLanguages'), 'Header must render one choice per supported language');
assert(header.includes('LANGUAGE_NAMES'), 'Header must show localized language names');

// Every $t('key') used in SFC templates must exist in the dictionaries.
const vueFiles: string[] = [];
const collect = (dir: string): void => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) collect(path);
    else if (entry.name.endsWith('.vue')) vueFiles.push(path);
  }
};
collect(new URL('./src', import.meta.url).pathname);
const used = new Set<string>();
for (const file of vueFiles) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/\$t\('([^']+)'\)/g)) used.add(match[1]);
  for (const match of source.matchAll(/(?<![\w$.])t\('([^']+)'\)/g)) used.add(match[1]);
}
assert(used.size > 50, `Expected dozens of translated keys, found ${used.size}`);
for (const key of used) {
  if (key.startsWith('theme') && key !== 'theme' && key !== 'themeChanged') continue; // dynamic theme' + Name keys
  assert(keys.includes(key), `Unknown i18n key used in SFC: ${key}`);
}

// Language helpers keep their legacy contract.
assert.equal(normalizeLanguage(' PT_br '), 'pt');
assert.equal(normalizeLanguage('zh-Hans-CN'), 'zh');
assert.equal(normalizeLanguage('not-supported'), null);
assert.equal(resolveLanguage('fr', 'de', ['en']), 'fr');
assert.equal(resolveLanguage('xx', 'pt-BR', ['en']), 'pt');
assert.equal(resolveLanguage(null, null, ['xx', 'ja-JP']), 'ja');
assert.equal(resolveLanguage(null, null, ['xx']), 'es');
assert(t('stars', { count: '25' }, 'es').includes('25'));
assert(t('githubSnapshot', { date: 'x' }, 'en').includes('x'));

console.log(`Verified ${locales.length} complete locales, ${used.size} SFC translation keys, and language helpers.`);

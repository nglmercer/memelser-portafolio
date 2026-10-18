import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {translations} from './src/translations.js';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const locales = Object.keys(translations);
const keys = Object.keys(translations.es).sort();
for (const [locale, dictionary] of Object.entries(translations)) {
  assert.deepEqual(Object.keys(dictionary).sort(), keys, `${locale}: incomplete dictionary`);
  for (const [key, value] of Object.entries(dictionary)) assert(value.trim().length, `${locale}.${key}: empty translation`);
  for (const key of ['stars', 'snapshot', 'themeChanged']) {
    assert.deepEqual(dictionary[key].match(/\{\w+\}/g), translations.es[key].match(/\{\w+\}/g));
  }
}
const menuLanguages = [...html.matchAll(/<input[^>]*name="language" value="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(menuLanguages.sort(), [...locales].sort());
assert(!/<title>[^<]*<span/.test(html), 'Markup must not appear inside the document title');
for (const match of html.matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)) assert(keys.includes(match[1]), `Unknown HTML key: ${match[1]}`);

// Exercise the actual initialization and switching code without a browser dependency.
class Element extends EventTarget {
  constructor(attributes = {}) {super();this.attributes = {...attributes};this.dataset = {};this.textContent = '';this.value = attributes.value || '';this.checked = false;
    for (const [key, value] of Object.entries(attributes)) if (key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
  }
  setAttribute(key, value) {this.attributes[key] = value;}
}
const elements = [...html.matchAll(/<[a-z][^>]*\bdata-i18n(?:-aria)?="[^>]*>/g)].map(match => {
  const attributes = Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(attr => [attr[1], attr[2]]));
  return new Element(attributes);
});
const radios = [...html.matchAll(/<input[^>]*>/g)].map(match => new Element(Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(attr => [attr[1], attr[2]]))));
const status = new Element();const themeStatus = new Element();const languageCode = new Element();const meta = new Element();const themeMeta = new Element();
const menus = ['theme', 'language'].map(name => {
  const menu = new EventTarget();menu.open = false;
  const summary = {focused:false,focus(){this.focused = true;}};
  const inputs = radios.filter(input => input.attributes.name === name);
  menu.querySelector = () => summary;menu.querySelectorAll = () => inputs;
  menu.contains = element => element === menu || element === summary || inputs.includes(element);
  return menu;
});
globalThis.document = Object.assign(new EventTarget(), {
  documentElement: {dataset:{}}, title: '',
  querySelectorAll: selector => {
    if (selector === '.preference-menu') return menus;
    if (selector.startsWith('input[name=')) return radios.filter(input => input.attributes.name === selector.match(/"([^"]+)"/)[1]);
    return elements.filter(element => selector === '[data-i18n]' ? element.dataset.i18n : element.dataset.i18nAria);
  },
  querySelector: selector => selector.includes('theme-color') ? themeMeta : meta,
  getElementById: id => ({'language-code':languageCode,'language-status':status,'theme-status':themeStatus})[id]
});
const windowEvents = new EventTarget();windowEvents.location = {href:'https://portfolio.example/?lang=en#proyectos'};
globalThis.window = windowEvents;
globalThis.history = {replaceState: (_, __, url) => {window.location.href = String(url);}};
Object.defineProperty(globalThis, 'navigator', {value:{languages:['de-DE','en-US']}, configurable:true});
globalThis.localStorage = {getItem:() => {throw new Error('Storage unavailable');},setItem:() => {throw new Error('Storage unavailable');}};
globalThis.CustomEvent = class extends Event {constructor(type, options) {super(type);this.detail = options.detail;}};
let languageEvents = 0;window.addEventListener('portfolio:languagechange', () => languageEvents++);
const {normalizeLanguage, resolveLanguage, t, setLanguage} = await import('./src/i18n.js');
assert.equal(document.documentElement.lang, 'en', 'URL locale must override browser preference even with storage blocked');
assert.equal(normalizeLanguage(' PT_br '), 'pt');
assert.equal(normalizeLanguage('zh-Hans-CN'), 'zh');
assert.equal(normalizeLanguage('not-supported'), null);
assert.equal(resolveLanguage('fr', 'de', ['en']), 'fr');
assert.equal(resolveLanguage('xx', 'pt-BR', ['en']), 'pt');
assert.equal(resolveLanguage(null, null, ['xx', 'ja-JP']), 'ja');
assert.equal(resolveLanguage(null, null, ['xx']), 'es');

// Preserve stateful 3D button labels when the visitor changes language.



for (const locale of locales) {
  const radio = radios.find(input => input.attributes.name === 'language' && input.value === locale);
  radio.checked = true;radio.dispatchEvent(new Event('change'));
  assert.equal(languageCode.textContent, locale.toUpperCase());
  assert.equal(radios.filter(input => input.attributes.name === 'language' && input.checked).length, 1);
  assert.equal(document.documentElement.lang, locale);
  assert.equal(document.documentElement.dir, locale === 'ar' ? 'rtl' : 'ltr');
  assert.equal(document.title, translations[locale].metaTitle);
  assert.equal(meta.attributes.content, translations[locale].metaDescription);
  assert.equal(status.textContent, translations[locale].languageChanged);


  assert.equal(new URL(window.location.href).searchParams.get('lang'), locale);
  assert.equal(new URL(window.location.href).hash, '#proyectos');
  for (const element of elements) {
    if (element.dataset.i18n) {
      assert(element.textContent.trim().length);
      assert(!/\{\w+\}/.test(element.textContent), `${locale}: unresolved placeholder`);
    }
    if (element.dataset.i18nAria) assert.equal(element.attributes['aria-label'], translations[locale][element.dataset.i18nAria]);
  }
}
assert.equal(languageEvents, locales.length + 1);
const saved = new Map();globalThis.localStorage = {getItem:key => saved.get(key),setItem:(key,value) => saved.set(key,value)};
setLanguage('fr');
assert.equal(saved.get('memelser.language'), 'fr');
assert.equal(t('stars', {count:25}, 'en'), '25 GitHub stars');
assert.equal(t('pause', {}, 'unsupported'), translations.es.pause);
console.log(`Verified ${locales.length} complete locales, ${keys.length} keys each, detection, persistence, RTL, metadata, numbers, dates.`);

// Check theme state, palette readability, and custom disclosure behavior.
const css = readFileSync(new URL('./src/style.css', import.meta.url), 'utf8');
const baseTokens = {};const overrides = {};
for (const match of css.matchAll(/:root(?:\[data-theme=(\w+)\])?\{([^}]+)\}/g)) {
  const target = match[1] ? (overrides[match[1]] ||= {}) : baseTokens;
  for (const declaration of match[2].split(';')) {
    const separator = declaration.indexOf(':');
    if (separator > 0) target[declaration.slice(0,separator).trim()] = declaration.slice(separator+1).trim();
  }
}
const tokens = name => ({...baseTokens,...overrides[name]});
globalThis.getComputedStyle = root => ({getPropertyValue:key => tokens(root.dataset.theme)[key] || ''});
let themeEvents = 0;window.addEventListener('portfolio:themechange', () => themeEvents++);
const {themes, normalizeTheme, setTheme} = await import('./src/preferences.js');
assert.equal(normalizeTheme('invalid'), 'light');
assert.deepEqual(radios.filter(input => input.attributes.name === 'theme').map(input => input.value), themes);
function luminance(hex) {
  const values = hex.slice(1).match(/../g).map(value => parseInt(value,16)/255).map(value => value <= .04045 ? value/12.92 : ((value+.055)/1.055)**2.4);
  return values[0]*.2126 + values[1]*.7152 + values[2]*.0722;
}
for (const name of themes) {
  const radio = radios.find(input => input.attributes.name === 'theme' && input.value === name);
  radio.checked = true;radio.dispatchEvent(new Event('change'));
  assert.equal(document.documentElement.dataset.theme, name);
  assert.equal(saved.get('memelser.theme'), name);
  assert.equal(radios.filter(input => input.attributes.name === 'theme' && input.checked).length, 1);
  assert.equal(themeMeta.attributes.content, tokens(name)['--bg']);
  assert(!/\{\w+\}/.test(themeStatus.textContent));
  for (const [fg,bg] of [['--text','--bg'],['--muted','--surface'],['--accent-ink','--accent'],['--on-accent-muted','--accent']]) {
    const a=luminance(tokens(name)[fg]),b=luminance(tokens(name)[bg]);
    assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5, `${name}: insufficient contrast for ${fg}`);
  }
}
assert.equal(themeEvents, themes.length + 1);
globalThis.localStorage = {getItem:() => {throw new Error('Unavailable');},setItem:() => {throw new Error('Unavailable');}};
setTheme('violet');assert.equal(document.documentElement.dataset.theme, 'violet');
const [themeMenu,languageMenu] = menus;
themeMenu.open=true;languageMenu.open=true;themeMenu.dispatchEvent(new Event('toggle'));
assert.equal(languageMenu.open, false, 'Opening a menu must close the other');
const escape = new Event('keydown', {cancelable:true});Object.defineProperty(escape,'key',{value:'Escape'});
themeMenu.dispatchEvent(escape);assert.equal(themeMenu.open,false);assert.equal(themeMenu.querySelector('summary').focused,true);
themeMenu.open=true;const outside = new Event('pointerdown');document.dispatchEvent(outside);assert.equal(themeMenu.open,false);
languageMenu.open=true;const click = new Event('click');Object.defineProperty(click,'detail',{value:1});languageMenu.querySelectorAll('input')[0].dispatchEvent(click);assert.equal(languageMenu.open,false);
languageMenu.open=true;const keyboardClick = new Event('click');Object.defineProperty(keyboardClick,'detail',{value:0});languageMenu.querySelectorAll('input')[0].dispatchEvent(keyboardClick);assert.equal(languageMenu.open,true, 'Keyboard selection must retain arrow-key traversal');
console.log('Verified five palettes, readable contrast, persistence without storage, theme notifications, dropdown exclusivity, Escape focus, and pointer dismissal.');

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { normalizeLanguage, persistLanguage, supportedLanguages } from '../core/language';

export { supportedLanguages };

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  hi: 'हिन्दी',
};

export function useLanguage() {
  const { locale } = useI18n();
  const route = useRoute();
  const router = useRouter();

  const current = computed(() => String(locale.value));

  function applyDom(language: string): void {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }

  function setLanguage(value: unknown): void {
    const language = normalizeLanguage(value) ?? 'es';
    locale.value = language;
    persistLanguage(language);
    applyDom(language);
    router.replace({ query: { ...route.query, lang: language } }).catch(() => {});
  }

  function initFromRoute(): void {
    const lang = normalizeLanguage(route.query.lang);
    if (lang) {
      locale.value = lang;
      persistLanguage(lang);
    }
    applyDom(String(locale.value));
  }

  return { current, setLanguage, initFromRoute, applyDom };
}

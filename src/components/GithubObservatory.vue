<template>
  <div class="visual-loading" v-if="store.loading || store.error.value">
    <p id="github-data-status" role="status">{{ $t('loadingGithub') }}</p>
    <button
      v-if="store.error.value"
      id="github-retry"
      type="button"
      @click="store.load()"
    >
      {{ $t('retry') }}
    </button>
  </div>
  <div v-if="store.data.value" id="github-visuals">
    <section class="github-observatory" aria-labelledby="github-activity-heading">
      <div class="visual-heading">
        <h2 id="github-activity-heading">{{ $t('githubActivity') }}</h2>
        <a href="https://github.com/nglmercer" target="_blank" rel="noopener noreferrer">{{ $t('viewGithub') }}</a>
        <div class="activity-filters compact-activity-filter">
          <details id="period-picker" class="preference-menu">
            <summary class="period-trigger" :aria-label="String($t('activityPeriod'))">
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M7 3v4M17 3v4M3 11h18" />
              </svg>
              <span id="period-label">{{ periodLabel }}</span>
              <svg class="icon period-chevron" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div class="period-panel">
              <fieldset id="period-options">
                <legend class="sr-only">{{ $t('activityPeriod') }}</legend>
                <label class="period-choice">
                  <input
                    type="radio"
                    name="activity-period"
                    value="recent"
                    :checked="store.activePeriod.value === 'recent'"
                    @change="store.selectPeriod('recent')"
                  />
                  <span>{{ $t('last365') }}</span>
                </label>
                <label v-for="year in store.years.value" :key="year" class="period-choice">
                  <input
                    type="radio"
                    name="activity-period"
                    :value="year"
                    :checked="store.activePeriod.value === year"
                    @change="store.selectPeriod(year)"
                  />
                  <span>{{ year }}</span>
                </label>
              </fieldset>
              <details id="custom-period">
                <summary>{{ $t('customRange') }}</summary>
                <form id="date-range-form" @submit.prevent="submitRange">
                  <label for="range-start">{{ $t('startDate') }}</label>
                  <input
                    id="range-start"
                    v-model="rangeStart"
                    type="date"
                    required
                    :min="historyMin"
                    :max="historyMax"
                  />
                  <label for="range-end">{{ $t('endDate') }}</label>
                  <input
                    id="range-end"
                    v-model="rangeEnd"
                    type="date"
                    required
                    :min="historyMin"
                    :max="historyMax"
                  />
                  <button type="submit">{{ $t('applyDates') }}</button>
                </form>
                <p v-if="store.rangeError.value" id="range-error" role="alert">{{ $t('invalidDateRange') }}</p>
              </details>
            </div>
          </details>
        </div>
      </div>
      <div id="github-stat-grid">
        <div class="github-stat">
          <strong>{{ formatNumber(store.data.value.stats.publicRepos) }}</strong>
          <span>{{ $t('publicRepos') }}</span>
        </div>
        <div class="github-stat">
          <strong>{{ formatNumber(store.data.value.stats.stars) }}</strong>
          <span>{{ $t('earnedStars') }}</span>
        </div>
        <div class="github-stat">
          <strong>{{ formatNumber(store.totals.value.contributions) }}</strong>
          <span>{{ $t('contributionsCount') }}</span>
        </div>
        <div class="github-stat">
          <strong>{{ formatNumber(store.totals.value.activeDays) }}</strong>
          <span>{{ $t('activeDays') }}</span>
        </div>
      </div>
      <div class="github-chart-layout">
        <div class="activity-chart">
          <div class="chart-heading">
            <h3 id="activity-range-heading">{{ $t('selectedActivity') }}</h3>
            <span id="calendar-detail" aria-live="polite">{{ calendarDetail }}</span>
          </div>
          <div class="heatmap-scroll">
            <div id="heatmap" role="group" :aria-label="String($t('selectedActivity'))">
              <button
                v-for="(day, i) in store.rangeDays.value"
                :key="day.date"
                type="button"
                class="heat-day"
                :data-level="day.level"
                :title="`${formatDate(day.date)} / ${formatNumber(day.count)} ${$t('contributionsCount')}`"
                :aria-label="`${formatDate(day.date)} / ${formatNumber(day.count)} ${$t('contributionsCount')}`"
                :tabindex="i === dayIndex ? 0 : -1"
                @pointerenter="dayIndex = i"
                @focus="dayIndex = i"
                @keydown="onHeatKey($event, i)"
              ></button>
            </div>
          </div>
          <div class="heat-legend">
            <span>{{ $t('lowActivity') }}</span>
            <i data-level="0"></i><i data-level="1"></i><i data-level="2"></i><i data-level="3"></i><i data-level="4"></i>
            <span>{{ $t('highActivity') }}</span>
          </div>
          <div id="monthly-bars" role="img" :aria-label="monthlyLabel">
            <div v-for="bar in monthlyBars" :key="bar.month" class="month-col">
              <span class="month-bar" :style="{ height: bar.height + 'px' }" :title="`${bar.month} / ${formatNumber(bar.count)}`"></span>
              <span class="month-label">{{ bar.label }}</span>
            </div>
          </div>
        </div>
        <div class="language-chart">
          <h3>{{ $t('githubLanguages') }}</h3>
          <svg id="language-donut" viewBox="0 0 180 180" role="img" :aria-label="donutLabel">
            <circle cx="90" cy="90" r="64" fill="none" stroke="var(--line)" stroke-width="24" />
            <circle
              v-for="(slice, i) in donutSlices"
              :key="slice.lang"
              cx="90"
              cy="90"
              r="64"
              fill="none"
              :stroke="palette[i % palette.length]"
              stroke-width="24"
              :stroke-dasharray="`${slice.share * 402.124} 402.124`"
              :stroke-dashoffset="-slice.offset * 402.124"
              transform="rotate(-90 90 90)"
            >
              <title>{{ slice.lang }}: {{ formatNumber(slice.count) }}</title>
            </circle>
            <text x="90" y="96" text-anchor="middle" fill="var(--text)" font-size="29" font-family="var(--display)">
              {{ languageEntries.length }}
            </text>
          </svg>
          <div id="language-legend">
            <div v-for="(entry, i) in languageEntries" :key="entry[0]" class="language-row">
              <i :style="{ background: palette[i % palette.length] }"></i>
              <span>{{ entry[0] }}</span>
              <span>{{ formatNumber(entry[1]) }}</span>
            </div>
          </div>
          <p>{{ $t('languageBasis') }}</p>
        </div>
      </div>
      <p id="snapshot-date" class="snapshot-date">
        {{ $t('githubSnapshot', { date: formatDate(store.data.value.snapshot) }) }}
      </p>
    </section>
    <section class="commit-section" aria-labelledby="commits-heading">
      <div class="visual-heading">
        <h2 id="commits-heading">{{ $t('recentCommits') }}</h2>
        <p>{{ $t('recentCommitsHint') }}</p>
      </div>
      <div id="commit-feed">
        <a
          v-for="commit in store.data.value.commits.slice(0, 8)"
          :key="commit.sha"
          class="commit-row"
          :href="commit.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="commit-message" dir="auto">{{ commit.message }}</div>
          <div class="commit-meta">
            <span>{{ commit.repo }}</span>
            <code>{{ commit.sha.slice(0, 7) }}</code>
            <time>{{ formatDate(commit.date.slice(0, 10)) }}</time>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { GithubStore } from '../composables/useGithub';

const props = defineProps<{ store: GithubStore }>();
const { locale, t } = useI18n();

const dayIndex = ref(0);
const rangeStart = ref('');
const rangeEnd = ref('');

watch(
  () => props.store.rangeDays.value.length,
  () => {
    dayIndex.value = Math.max(0, props.store.rangeDays.value.length - 1);
    if (props.store.rangeDays.value.length) {
      rangeStart.value = props.store.rangeDays.value[0].date;
      rangeEnd.value = props.store.rangeDays.value.at(-1)!.date;
    }
  },
  { immediate: true },
);

function formatNumber(value: number): string {
  return new Intl.NumberFormat(locale.value).format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(locale.value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value + 'T12:00:00Z'));
}

const calendarDetail = computed(() => {
  const day = props.store.rangeDays.value[dayIndex.value];
  if (!day) return '';
  return `${formatDate(day.date)} / ${formatNumber(day.count)}`;
});

const monthlyBars = computed(() => {
  const monthly = new Map<string, number>();
  for (const d of props.store.rangeDays.value) {
    monthly.set(d.date.slice(0, 7), (monthly.get(d.date.slice(0, 7)) ?? 0) + d.count);
  }
  const max = Math.max(1, ...monthly.values());
  return [...monthly].map(([month, count]) => ({
    month,
    count,
    height: (count / max) * 90 + 4,
    label: new Intl.DateTimeFormat(locale.value, { month: 'short', timeZone: 'UTC' }).format(
      new Date(month + '-15T12:00:00Z'),
    ),
  }));
});

const monthlyLabel = computed(
  () =>
    `${locale.value}: ` +
    [...monthlyBars.value].map((b) => `${b.month} ${formatNumber(b.count)}`).join(', '),
);

const palette = ['#3974ef', '#c083ee', '#e8ae45', '#55b9b2', '#ed8678', '#91a64e', '#758fae', '#b6a1c5'];

const languageEntries = computed(() =>
  props.store.data.value ? Object.entries(props.store.data.value.languages) : [],
);

const donutSlices = computed(() => {
  const total = languageEntries.value.reduce((s, [, v]) => s + v, 0);
  let offset = 0;
  return languageEntries.value.map(([lang, count]) => {
    const share = total ? count / total : 0;
    const slice = { lang, count, share, offset };
    offset += share;
    return slice;
  });
});

const donutLabel = computed(
  () => `${locale.value}: ` + languageEntries.value.map(([l, c]) => `${l} ${formatNumber(c)}`).join(', '),
);

const periodLabel = computed(() => {
  const period = props.store.activePeriod.value;
  if (period === 'recent') return String(t('last365'));
  if (period === 'custom' && props.store.rangeDays.value.length) {
    return `${formatDate(props.store.rangeDays.value[0].date)} – ${formatDate(props.store.rangeDays.value.at(-1)!.date)}`;
  }
  return period;
});

const historyMin = computed(() => props.store.data.value?.history[0].date ?? '');
const historyMax = computed(() => props.store.data.value?.snapshot ?? '');

function submitRange(): void {
  props.store.applyCustomRange(rangeStart.value, rangeEnd.value);
}

function onHeatKey(event: KeyboardEvent, i: number): void {
  const rtl = document.documentElement.dir === 'rtl';
  const step: Record<string, number> = {
    ArrowUp: -1,
    ArrowDown: 1,
    ArrowLeft: rtl ? 7 : -7,
    ArrowRight: rtl ? -7 : 7,
    Home: -props.store.rangeDays.value.length,
    End: props.store.rangeDays.value.length,
  };
  const delta = step[event.key];
  if (delta !== undefined) {
    event.preventDefault();
    dayIndex.value = Math.max(0, Math.min(props.store.rangeDays.value.length - 1, i + delta));
  }
}
</script>

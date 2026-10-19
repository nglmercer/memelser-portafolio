import { computed, ref } from 'vue';
import { activityTotals, selectActivity, type ActivityDay } from '../core/activityRange';
import type { GithubData, GithubRepo } from '../types';

export type Period = string; // 'recent' | year | 'custom'

async function fetchGithub(): Promise<GithubData> {
  const response = await fetch('/api/github');
  if (!response.ok) throw new Error('githubError');
  return (await response.json()) as GithubData;
}

export function useGithub() {
  const data = ref<GithubData | null>(null);
  const loading = ref(true);
  const error = ref(false);
  const rangeDays = ref<ActivityDay[]>([]);
  const activePeriod = ref<Period>('recent');
  const rangeError = ref(false);

  // Project explorer state
  const search = ref('');
  const index = ref(0);
  const previewMode = ref<'demo' | 'repo'>('demo');

  const filtered = computed<GithubRepo[]>(() => {
    if (!data.value) return [];
    const query = search.value.trim().toLowerCase();
    if (!query) return data.value.repos;
    return data.value.repos.filter((r) =>
      [r.name, r.description ?? '', r.language ?? '', ...r.topics].join(' ').toLowerCase().includes(query),
    );
  });

  const selection = computed<GithubRepo | null>(() => filtered.value[index.value] ?? null);

  const totals = computed(() =>
    rangeDays.value.length ? activityTotals(rangeDays.value) : { contributions: 0, activeDays: 0 },
  );

  const years = computed<string[]>(() => {
    if (!data.value) return [];
    return [...new Set(data.value.history.map((d) => d.date.slice(0, 4)))].sort().reverse();
  });

  function refreshRange(start: string, end: string): boolean {
    if (!data.value) return false;
    try {
      const chosen = selectActivity(data.value.history, start, end);
      if (!chosen.length) throw new Error('invalidDateRange');
      rangeDays.value = chosen;
      rangeError.value = false;
      return true;
    } catch {
      rangeError.value = true;
      return false;
    }
  }

  function selectPeriod(value: string): void {
    if (!data.value) return;
    const start = value === 'recent' ? data.value.days[0].date : `${value}-01-01`;
    const end =
      value === 'recent'
        ? data.value.days.at(-1)!.date
        : value === data.value.snapshot.slice(0, 4)
          ? data.value.snapshot
          : `${value}-12-31`;
    if (refreshRange(start, end)) activePeriod.value = value;
  }

  function applyCustomRange(start: string, end: string): boolean {
    const ok = refreshRange(start, end);
    if (ok) activePeriod.value = 'custom';
    return ok;
  }

  function keepSelection(fn: () => void): void {
    const id = selection.value?.id ?? null;
    fn();
    if (id !== null) {
      const next = filtered.value.findIndex((r) => r.id === id);
      index.value = Math.max(0, next);
    } else {
      index.value = 0;
    }
  }

  function step(delta: number): void {
    if (!filtered.value.length) return;
    index.value = (index.value + delta + filtered.value.length) % filtered.value.length;
  }

  function frameUrl(language: string): string {
    const repo = selection.value;
    if (!repo) return 'about:blank';
    const live = previewMode.value === 'demo' && repo.demo;
    return live ? repo.demo! : `/project-frame.html?id=${repo.id}&lang=${language}`;
  }

  async function load(): Promise<void> {
    loading.value = true;
    error.value = false;
    try {
      data.value = await fetchGithub();
      rangeDays.value = data.value.days;
      activePeriod.value = 'recent';
      index.value = 0;
    } catch {
      error.value = true;
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    loading,
    error,
    rangeDays,
    activePeriod,
    rangeError,
    search,
    index,
    previewMode,
    filtered,
    selection,
    totals,
    years,
    refreshRange,
    selectPeriod,
    applyCustomRange,
    keepSelection,
    step,
    frameUrl,
    load,
  };
}

export type GithubStore = ReturnType<typeof useGithub>;

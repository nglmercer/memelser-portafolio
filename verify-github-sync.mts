import assert from 'node:assert/strict';
import type { ActivityDay } from './src/core/activityRange';
import type { GithubData } from './src/types';
import {
  buildSnapshot,
  computeLanguages,
  computeStats,
  mapCommit,
  mapRepo,
  type ApiCommitItem,
  type ApiRepo,
} from './scripts/lib/github';

const days: ActivityDay[] = [
  { date: '2026-09-29', count: 3, level: 2 },
  { date: '2026-09-30', count: 0, level: 0 },
];

const previous = {
  snapshot: '2026-09-30',
  profile: 'https://github.com/nglmercer',
  repos: [
    {
      id: 1, name: 'demo-app', fullName: 'nglmercer/demo-app', description: 'Old desc',
      url: 'https://github.com/nglmercer/demo-app', language: 'Rust', stars: 5, forks: 1,
      isFork: false, topics: [], updated: '2026-01-01T00:00:00Z',
      demo: 'https://demo.example/app', homepage: null, archived: false,
    },
  ],
  days,
  commits: [],
  stats: { publicRepos: 1, ownedRepos: 1, forkedRepos: 0, stars: 5, contributions: 3, activeDays: 1 },
  languages: { Rust: 1 },
  history: days,
} as unknown as GithubData;

const apiRepos: ApiRepo[] = [
  {
    id: 1, name: 'demo-app', full_name: 'nglmercer/demo-app', description: 'New desc',
    html_url: 'https://github.com/nglmercer/demo-app', language: 'Rust',
    stargazers_count: 7, forks_count: 2, fork: false, topics: ['cli'],
    updated_at: '2026-10-01T00:00:00Z', homepage: null, archived: false,
  },
  {
    id: 2, name: 'forked', full_name: 'other/forked', description: null,
    html_url: 'https://github.com/other/forked', language: 'TypeScript',
    stargazers_count: 100, forks_count: 0, fork: true, topics: [],
    updated_at: '2026-10-01T00:00:00Z', homepage: 'https://example.com', archived: false,
  },
];

const apiCommits: ApiCommitItem[] = [
  {
    sha: 'abc123', html_url: 'https://github.com/nglmercer/demo-app/commit/abc123',
    repository: { full_name: 'nglmercer/demo-app' },
    commit: { message: 'feat: thing\n\nbody', author: { date: '2026-10-01T10:00:00Z' } },
  },
];

// Curated demo links survive the refresh; fresh fields win.
const mapped = mapRepo(apiRepos[0], new Map(previous.repos.map((r) => [r.id, r])));
assert.equal(mapped.description, 'New desc');
assert.equal(mapped.stars, 7);
assert.equal(mapped.demo, 'https://demo.example/app');
assert.deepEqual(mapped.topics, ['cli']);

// Repos without curated data fall back to their GitHub homepage.
const mappedFork = mapRepo(apiRepos[1], new Map(previous.repos.map((r) => [r.id, r])));
assert.equal(mappedFork.demo, 'https://example.com');

// Commit messages use the subject line only.
assert.deepEqual(mapCommit(apiCommits[0]), {
  sha: 'abc123',
  message: 'feat: thing',
  repo: 'nglmercer/demo-app',
  url: 'https://github.com/nglmercer/demo-app/commit/abc123',
  date: '2026-10-01T10:00:00Z',
});

const snapshot = buildSnapshot({
  user: 'nglmercer',
  apiRepos,
  apiCommits,
  profileUrl: 'https://github.com/nglmercer',
  previous,
  snapshotDate: '2026-10-01',
});
assert.equal(snapshot.repos.length, 2);
assert.equal(snapshot.commits.length, 1);
// Stars count owned repos only; fork stars must not leak in.
assert.equal(snapshot.stats.stars, 7);
assert.equal(snapshot.stats.publicRepos, 2);
assert.equal(snapshot.stats.forkedRepos, 1);
// History carries forward untouched so the calendar stays consistent.
assert.deepEqual(snapshot.days, days);
assert.deepEqual(snapshot.history, days);
assert.deepEqual(snapshot.languages, { Rust: 1 });
assert.deepEqual(computeLanguages([]), {});
assert.deepEqual(computeStats([], []), {
  publicRepos: 0, ownedRepos: 0, forkedRepos: 0, stars: 0, contributions: 0, activeDays: 0,
});

console.log('Verified GitHub sync mapping: curated links preserved, stats/languages correct, history carried forward.');

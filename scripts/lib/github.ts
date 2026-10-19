import type { ActivityDay } from '../../src/core/activityRange';
import type { GithubCommit, GithubData, GithubRepo, GithubStats } from '../../src/types';

/** Raw shapes returned by the GitHub REST API (only the fields we use). */
export interface ApiRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  topics?: string[];
  updated_at: string;
  homepage: string | null;
  archived: boolean;
}

export interface ApiCommitItem {
  sha: string;
  html_url: string;
  repository: { full_name: string };
  commit: { message: string; author: { date: string } | null };
}

const API = 'https://api.github.com';
const HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'memelser-portfolio-sync',
};

function authHeaders(token?: string): Record<string, string> {
  return token ? { ...HEADERS, Authorization: `Bearer ${token}` } : { ...HEADERS };
}

async function getJson<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(url, { headers: authHeaders(token) });
  if (response.status === 401 || response.status === 403) {
    throw new Error(`GitHub API rejected the request (${response.status}). Check GITHUB_TOKEN and rate limits.`);
  }
  if (!response.ok) throw new Error(`GitHub API ${response.status} for ${url}`);
  return (await response.json()) as T;
}

/** All public repos for a user, newest activity first, across every page. */
export async function fetchAllRepos(user: string, token?: string): Promise<ApiRepo[]> {
  const repos: ApiRepo[] = [];
  for (let page = 1; ; page++) {
    const batch = await getJson<ApiRepo[]>(
      `${API}/users/${encodeURIComponent(user)}/repos?per_page=100&page=${page}&type=all&sort=updated`,
      token,
    );
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

/** Most recent commits authored by the user across all their repos. */
export async function fetchRecentCommits(user: string, token: string | undefined, limit: number): Promise<ApiCommitItem[]> {
  const data = await getJson<{ items: ApiCommitItem[] }>(
    `${API}/search/commits?q=${encodeURIComponent(`author:${user}`)}&sort=author-date&order=desc&per_page=${limit}`,
    token,
  );
  return data.items ?? [];
}

export async function fetchProfileUrl(user: string, token?: string): Promise<string> {
  const profile = await getJson<{ html_url: string }>(`${API}/users/${encodeURIComponent(user)}`, token);
  return profile.html_url;
}

/** Map one API repo to the snapshot shape. Curated `demo` links survive via `previous`. */
export function mapRepo(api: ApiRepo, previous: Map<number, GithubRepo>): GithubRepo {
  const old = previous.get(api.id);
  const homepage = api.homepage && /^https:\/\//.test(api.homepage) ? api.homepage : null;
  return {
    id: api.id,
    name: api.name,
    fullName: api.full_name,
    description: api.description,
    url: api.html_url,
    language: api.language,
    stars: api.stargazers_count,
    forks: api.forks_count,
    isFork: api.fork,
    topics: api.topics ?? [],
    updated: api.updated_at,
    demo: old?.demo ?? homepage,
    homepage: old?.homepage ?? homepage,
    archived: api.archived,
  };
}

export function mapCommit(item: ApiCommitItem): GithubCommit {
  return {
    sha: item.sha,
    message: item.commit.message.split('\n')[0],
    repo: item.repository.full_name,
    url: item.html_url,
    date: item.commit.author?.date ?? '',
  };
}

export function computeStats(repos: GithubRepo[], days: ActivityDay[]): GithubStats {
  const owned = repos.filter((r) => !r.isFork);
  return {
    publicRepos: repos.length,
    ownedRepos: owned.length,
    forkedRepos: repos.length - owned.length,
    stars: owned.reduce((s, r) => s + r.stars, 0),
    contributions: days.reduce((s, d) => s + d.count, 0),
    activeDays: days.filter((d) => d.count > 0).length,
  };
}

/** Owned repos by primary language (repos without a detected language are skipped). */
export function computeLanguages(repos: GithubRepo[]): Record<string, number> {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.isFork || !repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  return Object.fromEntries([...counts].sort((a, b) => b[1] - a[1]));
}

export interface SnapshotInput {
  user: string;
  apiRepos: ApiRepo[];
  apiCommits: ApiCommitItem[];
  profileUrl: string;
  /** Previous snapshot: supplies curated demo links plus days/history, which REST cannot rebuild. */
  previous: GithubData;
  snapshotDate: string;
}

/** Merge fresh API data with the carried-forward history into the snapshot shape. */
export function buildSnapshot(input: SnapshotInput): GithubData {
  const previousById = new Map(input.previous.repos.map((r) => [r.id, r]));
  const repos = input.apiRepos.map((api) => mapRepo(api, previousById));
  const commits = input.apiCommits.map(mapCommit);
  return {
    snapshot: input.snapshotDate,
    profile: input.profileUrl as unknown as GithubData['profile'],
    repos,
    days: input.previous.days,
    commits,
    stats: computeStats(repos, input.previous.days),
    languages: computeLanguages(repos),
    history: input.previous.history,
  };
}

export async function fetchSnapshot(
  user: string,
  token: string | undefined,
  previous: GithubData,
  commitLimit = 20,
): Promise<GithubData> {
  const [apiRepos, apiCommits, profileUrl] = await Promise.all([
    fetchAllRepos(user, token),
    fetchRecentCommits(user, token, commitLimit),
    fetchProfileUrl(user, token),
  ]);
  return buildSnapshot({
    user,
    apiRepos,
    apiCommits,
    profileUrl,
    previous,
    snapshotDate: new Date().toISOString().slice(0, 10),
  });
}

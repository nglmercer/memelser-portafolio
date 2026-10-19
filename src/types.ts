export interface GithubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  isFork: boolean;
  topics: string[];
  updated: string;
  demo: string | null;
  homepage: string | null;
  archived: boolean;
}

export interface GithubCommit {
  sha: string;
  message: string;
  repo: string;
  url: string;
  date: string;
}

export interface GithubStats {
  publicRepos: number;
  ownedRepos: number;
  forkedRepos: number;
  stars: number;
  contributions: number;
  activeDays: number;
}

export interface GithubData {
  snapshot: string;
  profile: { login: string; url: string };
  repos: GithubRepo[];
  days: import('./core/activityRange').ActivityDay[];
  commits: GithubCommit[];
  stats: GithubStats;
  languages: Record<string, number>;
  history: import('./core/activityRange').ActivityDay[];
}

export type Messages = Record<string, Record<string, string>>;

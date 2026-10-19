import { readFileSync, writeFileSync } from 'node:fs';
import type { GithubData } from '../src/types';
import { fetchSnapshot } from './lib/github';

// Usage: GITHUB_TOKEN=ghp_... npm run github:sync
// Refreshes repos, stars, languages and recent commits in public/github-data.json.
// Curated demo links and the contribution history carry over untouched.
const user = process.env.GITHUB_USER || 'nglmercer';
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.warn('No GITHUB_TOKEN set — running unauthenticated (60 req/hour). Set one for 5,000 req/hour.');
}

const previous = JSON.parse(readFileSync('public/github-data.json', 'utf8')) as GithubData;
const snapshot = await fetchSnapshot(user, token, previous);
writeFileSync('public/github-data.json', JSON.stringify(snapshot, null, 2) + '\n');
console.log(
  `Synced ${snapshot.repos.length} repos, ${snapshot.commits.length} commits, ${snapshot.stats.stars} stars (${snapshot.snapshot}).`,
);

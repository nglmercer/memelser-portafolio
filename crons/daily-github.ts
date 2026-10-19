import { defineScheduled } from 'void';
import { kv } from 'void/kv';
import type { GithubData } from '../src/types';
import { fetchSnapshot } from '../scripts/lib/github';
import fallback from '../public/github-data.json';

export const cron = '0 6 * * *'; // Daily at 06:00 UTC.

// Refreshes the public GitHub snapshot and caches it in KV for a week,
// so one slow or failed sync never leaves the site without data.
// Secrets come from `void secret put GITHUB_TOKEN` (and optionally GITHUB_USER).
export default defineScheduled(async (_controller, bindings) => {
  const secrets = bindings as unknown as Record<string, string | undefined>;
  const user = secrets.GITHUB_USER ?? 'nglmercer';
  const previous = ((await kv.get<GithubData>('github:snapshot')) ?? fallback) as GithubData;
  const snapshot = await fetchSnapshot(user, secrets.GITHUB_TOKEN, previous);
  await kv.put('github:snapshot', snapshot, { ttl: 60 * 60 * 24 * 7 });
});

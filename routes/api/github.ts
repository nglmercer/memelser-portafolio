import { defineHandler } from 'void';
import { kv } from 'void/kv';
import type { GithubData } from '../../src/types';
import snapshot from '../../public/github-data.json';

// Serves the daily-synced snapshot from KV when present,
// falling back to the bundled snapshot so the page never breaks.
export const GET = defineHandler(async (c) => {
  c.header('Cache-Control', 'public, max-age=300');
  try {
    const cached = await kv.get<GithubData>('github:snapshot');
    if (cached?.repos?.length) return c.json(cached);
  } catch {
    /* KV unavailable — serve the bundled snapshot below. */
  }
  return c.json(snapshot);
});

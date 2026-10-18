import { defineHandler } from 'void';
import snapshot from '../../public/github-data.json';

// Preserve the verified snapshot; no GitHub token or external service required.
export const GET = defineHandler((c) => {
  c.header('Cache-Control', 'public, max-age=300');
  return c.json(snapshot);
});

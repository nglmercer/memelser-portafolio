import { defineEnv, string } from 'void/env';

export default defineEnv({
  // Read-only GitHub token for the daily sync (public data only).
  // Local: put GITHUB_TOKEN=... in .env — never commit it.
  // Production: `void secret put GITHUB_TOKEN`.
  GITHUB_TOKEN: string().optional(),
  GITHUB_USER: string().default('nglmercer'),
});

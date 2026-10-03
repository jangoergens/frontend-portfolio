# Top Comment Finder

A SvelteKit app that finds the most liked comments on a YouTube video.

Install dependencies from the repository root with `pnpm install --frozen-lockfile`. Copy `.env.example` to `.env` in this directory, then run `pnpm --filter top-comment-finder start`.

Development mode returns sample comments without external credentials. Production mode requires `GOOGLE_API_MODE=production` and a server-side `GOOGLE_API_KEY` for the YouTube Data API. The app does not use a database.

For validation, run `pnpm check`, `pnpm lint`, and `pnpm test` from the root. Install Chromium with `pnpm install-test-browser` first. Root browser tests build the app and start its preview server on port 4444, forcing development mode.

Before production use, review the API quota and rate-limit follow-up in [the maintenance report](../../MAINTENANCE.md).

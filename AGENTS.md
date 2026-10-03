# Working in this repository

## Layout

- `apps/personal-website`: SvelteKit personal website.
- `apps/top-comment-finder`: SvelteKit YouTube comment finder, including a server API.
- `apps/tcf-chrome-extension`: plain JavaScript Manifest V3 extension; no workspace package.
- Root configuration owns pnpm, Turborepo, TypeScript, ESLint, Prettier, and Playwright.

## Development

- Use the Node version in `.nvmrc` and the exact pnpm version in `package.json`.
- Install with `pnpm install --frozen-lockfile`. Update manifests and `pnpm-lock.yaml` together.
- Use `pnpm --filter <app> start` for a single app. `pnpm start` starts all web apps.
- Copy `apps/top-comment-finder/.env.example` to `.env` for local development. Use development mode for tests; never require production credentials in CI.
- Run `pnpm check`, `pnpm lint`, `pnpm build`, and `pnpm test` for changes affecting shared tooling. Install Chromium first with `pnpm install-test-browser`; CI also installs system dependencies.
- `pnpm test` builds the apps through Turborepo before starting their preview servers. For direct app tests, build that app first.
- Format every changed text file exactly once after finishing edits. Pass explicit file paths to Prettier; do not format the whole repository for a narrow change. Check formatting afterward without rewriting.
- Keep dependency versions exact. Review native dependency build permissions in `pnpm-workspace.yaml` when updating packages.
- Do not cache formatting or end-to-end tests. Include generated build paths and relevant environment variables in Turbo configuration when adding tasks.

## Change boundaries

- Never create pull requests. Prepare implementation, validation, and a draft description for the user.
- Do not deploy, publish, or change external service data unless explicitly requested.
- Use supported MCP tools or CLIs for external services; do not write custom HTTP/SDK scripts or retrieve access tokens as a workaround.
- Keep environment files and credentials out of Git and logs. `GOOGLE_API_KEY` belongs only on the server.
- Follow the existing Svelte 5 component conventions.
- Review `MAINTENANCE.md` for dependency and deployment decisions.
- When commands return a session ID, poll until they exit. Quiet output does not mean failure.
- For command approval, use a reusable prefix at a stable subcommand boundary. Keep deployment, publishing, migration, and destructive approvals narrowly scoped.

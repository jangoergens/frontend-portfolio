# Frontend Portfolio

A pnpm workspace with two web apps, coordinated by Turborepo, and a small Chrome extension.

| Directory                   | Purpose                                              | Stack                                               |
| --------------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `apps/personal-website`     | Personal website scaffold                            | SvelteKit 3, Svelte 5, Tailwind 4                   |
| `apps/top-comment-finder`   | Find the most liked comments on a YouTube video      | SvelteKit 3, Svelte 5, Tailwind 4, YouTube Data API |
| `apps/tcf-chrome-extension` | Open the current YouTube video in Top Comment Finder | Chrome Manifest V3, JavaScript                      |

## Getting started

Use the Node version in `.nvmrc` (`nvm install && nvm use`). Node 24.21.0 is the default; Node 22.23.3 or newer within Node 22 is also supported. CI checks both LTS lines. Use the exact pnpm version declared by `packageManager` in `package.json`; Corepack can select it with `corepack pnpm` if your pnpm installation does not.

```sh
pnpm install --frozen-lockfile
cp apps/top-comment-finder/.env.example apps/top-comment-finder/.env
pnpm --filter top-comment-finder start
```

Development mode returns sample comments and requires no external credentials. Production mode requires a server-side `GOOGLE_API_KEY` for the YouTube Data API. There is no database dependency.

Use `pnpm --filter personal-website start` to run the other app. `pnpm start` launches both apps; Vite selects available development ports. The SvelteKit preview ports are 5555 for the personal website and 4444 for Top Comment Finder.

## Validation

```sh
pnpm install-test-browser
pnpm all
```

`pnpm all` runs type checks, lint, production builds, and browser tests. Install dependencies separately first. On Linux, Playwright may also require system libraries: `pnpm exec playwright install-deps chromium`. CI uses `pnpm exec playwright install --with-deps chromium`.

Individual commands are `pnpm check`, `pnpm lint`, `pnpm build`, and `pnpm test`. Browser tests build the apps through Turborepo and then start preview servers. Direct filtered app tests require an existing build. Tests use sample comments, regardless of production settings in a local `.env` file.

ESLint, TypeScript, Playwright, and Prettier are shared root development dependencies. App-specific Prettier settings remain inside each app. `pnpm format` formats the repository; for a narrow change, use `pnpm exec prettier --write <changed-file-paths>` instead.

## Maintenance

Read [AGENTS.md](./AGENTS.md) for repository working conventions and [MAINTENANCE.md](./MAINTENANCE.md) for the investigation, completed migrations, compatibility choices, and follow-up work. Renovate proposes dependency updates for review; major migrations should be validated separately.

The Vercel workflow deploys Top Comment Finder when matching changes reach `main`. It requires the configured Vercel secrets. Local validation does not deploy anything.

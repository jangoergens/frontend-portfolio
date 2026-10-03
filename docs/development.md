# Development and testing

## Setup

Use `nvm install && nvm use` to select the Node version in `.nvmrc`.
Use the exact pnpm version declared by `packageManager` in `package.json`;
Corepack can select it with `corepack pnpm`.

Install from the repository root with `pnpm install --frozen-lockfile`.
For Top Comment Finder, copy `apps/top-comment-finder/.env.example` to `.env`
in the same directory. Development mode uses sample comments without credentials.

| Command                                  | Purpose                    |
| ---------------------------------------- | -------------------------- |
| `pnpm --filter personal-website start`   | Start the personal website |
| `pnpm --filter top-comment-finder start` | Start Top Comment Finder   |
| `pnpm start`                             | Start both apps            |

`pnpm start` runs `turbo run start`. The `start` task in `turbo.json` is persistent
and uncached, so Turborepo runs both development servers concurrently using its
task graph. Press Ctrl+C to stop them together. The filtered commands run a single
app directly; neither app requires the other development server.

Vite selects available development ports. Preview servers use port 5555 for the
personal website and 4444 for Top Comment Finder.

## Validation

```sh
pnpm install-test-browser
pnpm all
```

`pnpm all` runs type checks, lint, builds, server and extension unit tests, and browser tests.
Individual commands are `pnpm check`, `pnpm lint`, `pnpm build`, and `pnpm test`.
Linux may also need `pnpm exec playwright install-deps chromium`; CI installs Chromium
with system dependencies using `pnpm exec playwright install --with-deps chromium`.

Root browser tests build the apps through Turborepo. Build the relevant app before
running filtered app tests directly. Top Comment Finder browser tests force development
mode; server tests mock YouTube responses and use local memory. No production credentials
are required. Run server tests alone with `pnpm --filter top-comment-finder test:server`
or extension tests with `pnpm test:extension`.

For personal website contact tests, see [site maintenance](personal-website.md#testing).

## Formatting and conventions

ESLint, TypeScript, Playwright, and Prettier are shared root dependencies.
App-specific Prettier settings live inside each app. Format changed files with
`pnpm exec prettier --write <changed-file-paths>`, then check them with
`pnpm exec prettier --check <changed-file-paths>`.

See [AGENTS.md](../AGENTS.md) for repository conventions.

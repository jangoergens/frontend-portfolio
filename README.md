# Frontend Portfolio

A pnpm workspace with two web apps, coordinated by Turborepo, and a small Chrome extension.

| Directory                   | Purpose                                              | Stack                                               |
| --------------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `apps/personal-website`     | Personal website scaffold                            | SvelteKit 3, Svelte 5, Tailwind 4                   |
| `apps/top-comment-finder`   | Find the most liked comments on a YouTube video      | SvelteKit 3, Svelte 5, Tailwind 4, YouTube Data API |
| `apps/tcf-chrome-extension` | Open the current YouTube video in Top Comment Finder | Chrome Manifest V3, JavaScript                      |

## Getting started

Use the Node version in `.nvmrc` (`nvm install && nvm use`). This workspace requires Node 24.21.0 or newer within Node 24; the root and app manifests enforce that range. CI and deployment use `.nvmrc` as their single version source. Vercel uses the current Node 24 release selected by the app's `engines.node`. Use the exact pnpm version declared by `packageManager` in `package.json`; Corepack can select it with `corepack pnpm` if your pnpm installation does not.

```sh
pnpm install --frozen-lockfile
cp apps/top-comment-finder/.env.example apps/top-comment-finder/.env
pnpm --filter top-comment-finder start
```

Development mode returns sample comments and requires no external credentials. Production mode requires `GOOGLE_API_MODE=production` and a server-side `GOOGLE_API_KEY` for the YouTube Data API. Caching and quota controls use bounded memory within each running instance; no Redis service is required. See the [Top Comment Finder README](./apps/top-comment-finder/README.md) for setup and limits.

Use `pnpm --filter personal-website start` to run the other app. `pnpm start` launches both apps; Vite selects available development ports. The SvelteKit preview ports are 5555 for the personal website and 4444 for Top Comment Finder.

## Validation

```sh
pnpm install-test-browser
pnpm all
```

`pnpm all` runs type checks, lint, production builds, server and extension unit tests, and browser tests. Install dependencies separately first. On Linux, Playwright may also require system libraries: `pnpm exec playwright install-deps chromium`. CI uses `pnpm exec playwright install --with-deps chromium`.

Individual commands are `pnpm check`, `pnpm lint`, `pnpm build`, and `pnpm test`. Browser tests build the apps through Turborepo and then start preview servers. Direct filtered app browser tests require an existing build. Browser tests use sample comments, regardless of production settings in a local `.env` file; server tests exercise production behavior with mocked YouTube responses and an in-memory store. No production credentials are required.

ESLint, TypeScript, Playwright, and Prettier are shared root development dependencies. App-specific Prettier settings remain inside each app. `pnpm format` formats the repository; for a narrow change, use `pnpm exec prettier --write <changed-file-paths>` instead.

## Maintenance

Read [AGENTS.md](./AGENTS.md) for repository working conventions. App setup, quota controls, and extension testing live in their READMEs. The personal website remains a demo scaffold.

Renovate groups minor, patch, digest, and pin updates on the first day of each month in `Europe/Berlin`; major upgrades remain separate. Existing branches follow the same schedule. Automerge is disabled and releases require a known publication timestamp and a one-day delay. Security fixes bypass the monthly schedule but retain that delay and manual review. Enable GitHub Dependabot alerts and grant Renovate access separately for that integration to work.

Keep TypeScript within the supported SvelteKit, svelte-check, and typescript-eslint peer ranges; review those peers together before upgrading to TypeScript 7. Node types follow the primary Node 24 runtime. Dependency build permissions in `pnpm-workspace.yaml` allow only the native tooling used here: Tailwind's oxide and esbuild. Review changes to those permissions during upgrades.

pnpm enforces a one-day release delay, including frozen installs. The exact-version exception for ESLint 10.12.0 remains necessary until **2026-10-03 at 20:09 UTC**. Remove `minimumReleaseAgeExclude` from `pnpm-workspace.yaml` on or after **2026-10-04**, then verify `pnpm install --frozen-lockfile`. The exception does not cover future versions. Run `pnpm audit` and `pnpm outdated --recursive` during dependency reviews.

## Assets and adapters

The personal website uses `@sveltejs/adapter-static` and emits a fully prerendered site in `apps/personal-website/build`. Top Comment Finder uses the explicitly pinned `@sveltejs/adapter-vercel` with the Node 24 runtime and emits `.vercel/output` inside its app directory.

Both apps self-host `Inter-Latin-Variable.woff2`, a subset of the original Inter variable font. It preserves variable weights, Latin and extended Latin characters (including German and Vietnamese), combining accents, punctuation, currency symbols, and common arrows. Other scripts use the existing system-font fallback. CSS and font preloads reference the same WOFF2 asset.

To regenerate the font from the original `Inter-VariableFont_slnt,wght.ttf`, install `fonttools[woff]` in a temporary environment and run:

```sh
pyftsubset Inter-VariableFont_slnt,wght.ttf \
  --output-file=Inter-Latin-Variable.woff2 --flavor=woff2 \
  --unicodes='U+0000-024F,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2212,U+FEFF,U+FFFD' \
  --layout-features='*' --name-IDs='*' --name-languages='*' \
  --notdef-outline --recommended-glyphs
```

Copy the generated font to each app's `static/fonts` directory. The original TTF is available in Git history.

Top Comment Finder imports SVG icons directly and uses a pre-generated 96×96 WebP logo displayed at 48×48 for sharp rendering on high-density screens. The original `src/lib/assets/logo.png` remains as its source. There is no build-time image-processing plugin or Sharp dependency.

## Production deployment

The `Test` workflow deploys Top Comment Finder on pushes to `main` only after its `Validate` job passes type checks, lint, builds, and all tests on Node 24. Deployment checks that the tested commit is still the latest `main` commit and serializes production deployments. Pull requests and manual test runs do not deploy. The workflow requires the existing `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` secrets; local validation does not deploy anything.

The app's `vercel.json` disables automatic Git deployments from `main`, leaving the validated CLI workflow in control of production; other branches can still create previews. This uses Vercel's documented [`git.deploymentEnabled`](https://vercel.com/docs/project-configuration/git-configuration#gitdeploymentenabled) setting.

Configure branch protection to require the `Validate` check, replacing any old Node 22/24 matrix checks. In Vercel, confirm the project's root directory is `apps/top-comment-finder`, select the Node 24 runtime, and follow the [app's production setup steps](./apps/top-comment-finder/README.md#production-setup-on-vercel). Verify that Vercel reads this app's configuration and has no deploy hooks or other automation that bypasses the workflow. These account settings are not controlled by this repository.

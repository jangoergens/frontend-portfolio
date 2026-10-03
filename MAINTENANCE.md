# Maintenance investigation

Investigated and modernized on 2026-10-03. The follow-up upgrades are separate commits: blog removal, SvelteKit 3/TypeScript 6, Tailwind 4, and Node 24/pnpm 12. The user's original cleanup commit was rebased onto `origin/main` before these changes.

## Repository layout

The workspace now has two web apps: a SvelteKit personal website scaffold and a SvelteKit YouTube comment finder. `apps/tcf-chrome-extension` is a plain JavaScript Manifest V3 extension with no package manifest. There are no shared packages; the empty physical `packages/` directory and its unused workspace glob were removed.

The blog had a Vercel production workflow but GitHub returned no recorded runs. The user confirmed it was absent from their Vercel dashboard and requested removal. The blog, its example post/assets, deployment workflow, Astro tooling, and archived Skeleton v2 dependencies were removed together. External Vercel project state was not changed.

`AGENTS.md`, root/app READMEs, and this report describe the current layout, validation, environment handling, and maintenance decisions.

## Completed modernization

| Area                        | Current state                                                                                                                                                                                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime and package manager | Node 24.21.0 is the default; Node 22.23.3+ remains supported. pnpm 12.8.1 is pinned with integrity metadata. CI checks both LTS lines and uses frozen installs.                                                                                                                     |
| SvelteKit                   | Both apps use Kit 3.0.0 and adapter-auto 8.0.0, Svelte 5.57.1, and Vite 8.3.2. Configuration moved into the Vite plugin; imports use `#lib`, TypeScript extends `$app/tsconfig`, and environment imports use the new API.                                                           |
| Server environment          | Top Comment Finder declares its private runtime variables in `src/env.ts`. API keys remain server-only; optional credentials retain the existing HTTP 503 response when production settings are missing. Invalid modes fail validation.                                             |
| TypeScript                  | Updated to 6.0.3, the latest release compatible with Kit 3, svelte-check, and typescript-eslint. Node types match the primary Node 24 runtime.                                                                                                                                      |
| Styling                     | Both apps use Tailwind 4.3.3 with its Vite integration. Removed Tailwind 3 and app PostCSS/autoprefixer configs/dependencies. Fonts and manual dark mode use CSS configuration; renamed utilities, explicit borders, and sRGB gradient interpolation preserve the intended styling. |
| Lint and formatting         | Shared ESLint 10 flat configuration, typed Svelte linting, and current Prettier plugins. Removed Astro-only plugins. Tailwind formatting reads each app's CSS configuration.                                                                                                        |
| Image tooling               | Used Vite image tooling and Sharp are current; unused personal-website image tooling was removed. Dependency-update exclusions were removed.                                                                                                                                        |
| Unused database             | Removed unused Supabase CLI/SDK/client/types, credentials, and stale database documentation.                                                                                                                                                                                        |
| Tasks and tests             | Build outputs cover SvelteKit and Vercel artifacts. Sync/type checks always run because Kit 3 generates `$app` files inside app `node_modules`. Formatting and browser tests are also uncached. Tests use sample comments without credentials.                                      |
| API behavior                | Video IDs are validated, query parameters encoded, JSON error responses use 400/503/502 statuses, and upstream fetches have timeouts. Kit's deprecated JSON helper was replaced with `Response.json`.                                                                               |
| Automation                  | Actions and Vercel CLI are pinned, permissions limited, and shared build inputs included. Renovate proposes updates with automerge disabled.                                                                                                                                        |

The [Kit 3 migration guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-3), [Tailwind 4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide), and [pnpm migration guide](https://pnpm.io/migration) informed these migrations.

Renovate now schedules routine updates for the first day of each month in `Europe/Berlin`, including updates to existing branches. Minor, patch, digest, and pin updates are grouped; major upgrades remain separate. Automerge is disabled. Releases must be at least one day old and have a known publication timestamp before they qualify. Security fixes bypass the monthly schedule but retain the one-day delay and manual review. GitHub currently reports Dependabot alerts disabled; enable those alerts and grant Renovate read access to them for its security-fix integration to work. Changing repository configuration does not enable the GitHub setting.

## Dependency health and configuration

The final full-workspace `pnpm audit --json` reports **zero advisories**. Initially there were 174 findings (2 critical, 80 high, 72 moderate, 20 low); the first pass reduced these to two high transitive findings. Removing Astro/blog dependencies and migrating away from Tailwind 3 removed those remaining dependency chains. An audit result describes the dependency tree at the time of checking, not all application risks.

Both temporary overrides are gone:

- `@sveltejs/kit>cookie: 0.7.2` patched the old Kit 2 dependency. Kit 3 resolves `cookie@2.0.1` normally.
- `rollup@<4.59.0: 4.64.0` avoided a stale vulnerable peer from the old lockfile. The regenerated lockfile has no installed Rollup package; Vite 8 uses Rolldown, and the image tooling's Rollup peer is optional.

`onlyBuiltDependencies` was an installation-script allowlist, not a list of application builds. pnpm 12 replaces it with [the `allowBuilds` map](https://pnpm.io/settings/build#allowbuilds): only `@tailwindcss/oxide` (Tailwind native tooling), `esbuild` (build tooling), and `sharp` (image processing) are allowed. The Astro compiler entry was removed with the blog. Unreviewed dependency scripts fail installation under pnpm 12's default strict policy.

pnpm 12 checks locked dependencies against its one-day minimum release age. The workspace explicitly retains that delay and strict enforcement. Exact ESLint 10.12.0, Turbo 2.11.7, and corresponding platform-package exceptions permit the already selected and validated releases, which were published less than a day before this maintenance run. Remove these exceptions after 2026-10-04; they do not exempt future versions.

`pnpm outdated --recursive` reports only these intentional differences:

- **TypeScript 6.0.3 versus registry latest 7.0.2.** Kit 3 declares TypeScript `^6`, svelte-check supports 5/6, and [typescript-eslint supports versions below 6.1](https://typescript-eslint.io/users/dependency-versions/). Revisit TypeScript 7 when all integrations support it.
- **Node types 24.19.1 versus registry latest 26.6.4.** Types follow the supported Node 24 LTS runtime, rather than the newer Node major.

No archived direct dependency line remains. Skeleton v2 was removed with the blog; older major versions alone were not treated as evidence that projects were abandoned.

## Remaining production and product concerns

1. **Protect YouTube API quota before more production work.** A public request can still fetch up to 100 pages. There is no rate limiter, cache, total request budget, or request deduplication. Per-fetch timeouts do not bound the total duration. Choose deployment-appropriate infrastructure, restrict the API key to its intended API/use, and add mocked production-path coverage for pagination, missing credentials, and upstream failures. No live YouTube calls were made.
2. **Gate production deployment on validation.** The remaining Top Comment Finder Vercel workflow triggers directly on matching pushes to `main` and is not gated by the Test workflow. Review branch protection, Vercel project root/Node settings, and whether Vercel Git integration duplicates the workflow. No production deployment or external setting was changed.
3. **Review the extension during product work.** It has JavaScript lint coverage but needs a manual unpacked-extension test and hostname/video-ID handling review. The personal website remains a demo scaffold.
4. **Keep coordinated upgrades compatible.** Review TypeScript 7 when upstream peers allow it. Re-run `pnpm outdated --recursive` and `pnpm audit` regularly and remove the dated release-age exceptions.

## Validation and limits

Both apps pass Svelte type checks with zero errors/warnings and production builds. All 23 Playwright tests pass: 3 personal-website tests and 20 comment-finder tests. New checks cover desktop/mobile layout, the Inter font, persistent manual dark mode, heading gradients, controls, and comment-card borders/shadows. Existing API, search URL, and navigation tests remain.

Validation covers Node 22.23.3 and Node 24.21.0 with pnpm 12.8.1, lint/format checks, and a frozen-lockfile install. Changed files were formatted once with explicit paths. Temporary Node/Corepack shims and pnpm stores avoid changing the machine's global tooling; browser validation required localhost access outside the sandbox.

GitHub Actions, real production YouTube requests, manual Chrome extension behavior, and Vercel deployment were not executed locally. No push or pull request was created.

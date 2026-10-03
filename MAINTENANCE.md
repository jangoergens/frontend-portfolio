# Maintenance investigation

Investigated on 2026-10-03. The unused blog and its deployment workflow were subsequently removed at the user's request; the user confirmed that it is absent from their Vercel dashboard, and GitHub returned no deployment workflow runs. The blog-specific findings below record the initial investigation. This is a first maintenance pass, with larger product and styling migrations left explicit below.

## Repository layout

The workspace has three independent web apps: a SvelteKit personal website scaffold, a SvelteKit YouTube comment finder, and a static Astro blog with one example Markdown post. A fourth directory contains a plain JavaScript Manifest V3 Chrome extension with no package manifest. There are no shared packages; the empty `packages/` workspace glob was removed.

The original README omitted the personal website and Chrome extension, described a database that the running app does not use, and the blog README was upstream template text. Root and app documentation now describe the actual repository. `AGENTS.md` records working conventions, validation, credential handling, and the user's rule against creating pull requests.

## Concerns found and changes made

| Finding                                                                                                         | First-pass change                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI used pnpm 8.15.1 against a pnpm 10 lockfile and package-manager declaration                                  | Pin pnpm 10.34.6 with integrity metadata; CI reads the declaration and installs with a frozen lockfile                                                    |
| Node 22.14.0 was pinned; Node 24 was excluded                                                                   | Pin Node 22.23.3 locally, support Node 24.21.0+, and configure CI for both LTS lines                                                                      |
| ESLint 8 had reached end-of-life, with duplicated legacy configs                                                | Upgrade to ESLint 10 and shared flat config, retaining type-aware linting for SvelteKit source/tests                                                      |
| Astro 4, early Svelte 5, and old Vite/build tooling had numerous audit findings                                 | Upgrade Astro to 7.3.5, Svelte to 5.57.1, Vite to 8.3.2, and compatible integrations and tooling                                                          |
| Blog was missing from `pnpm check`                                                                              | Add an Astro check task; migrate the content loader, post IDs, render API, Zod import, generated types, and TypeScript configuration                      |
| Deprecated Astro Tailwind integration                                                                           | Remove it; the existing PostCSS configuration supplies Tailwind 3                                                                                         |
| Old image tooling and Sharp, with Renovate updates disabled                                                     | Update used image tooling and Sharp, remove unused personal-website image tooling, and re-enable update proposals                                         |
| Supabase CLI, SDK, client, generated types, and credentials had no consumers                                    | Remove the unused database setup and documentation                                                                                                        |
| Separate `svelte-preprocess` dependency for standard Vite preprocessing                                         | Use the Svelte Vite plugin's `vitePreprocess`                                                                                                             |
| Shared developer dependencies duplicated in every app                                                           | Move ESLint, formatter, TypeScript, and Playwright tooling to the root                                                                                    |
| Browser tests depended on secrets; personal-website end-to-end file contained no test cases                     | Force sample-comment mode, add a navigation smoke test, set explicit preview URLs and longer startup timeouts, and install browser system libraries in CI |
| Turbo tasks omitted SvelteKit build outputs and cached mutating formatting commands                             | Correct build outputs, separate sync outputs from compiled output, mark dev servers persistent, and disable caching for formatting and browser tests      |
| Comments API accepted arbitrary IDs, returned HTTP 200 for errors, and serialized a Promise on upstream failure | Validate IDs, encode query parameters, return JSON with error statuses, add per-fetch timeouts, and test development API responses and invalid IDs        |
| Deprecated SvelteKit store imports and nonreactive video route parameter                                        | Use `$app/state`, derive the route parameter, and resolve internal navigation paths                                                                       |
| Deployment workflows used floating Vercel CLI versions and missed shared lockfile changes                       | Pin the CLI and Actions, set read-only token permissions, quote the token through an environment variable, and cover shared build inputs                  |
| Grouped dependency updates could auto-merge without manual review                                               | Keep Renovate proposals, disable automerge, and remove update exclusions                                                                                  |

The lockfile was refreshed through pnpm, including transitive dependencies within their declared ranges. Two narrow overrides address retained vulnerable versions: SvelteKit's `cookie` uses 0.7.2, and vulnerable Rollup 4 versions resolve to 4.64.0. Remove these overrides when upstream dependency resolution no longer needs them, after rechecking audit and validation.

## Dependency health

The full workspace `pnpm audit` counts changed as follows. These are dependency-tree findings, not a count of demonstrated application exploits.

| Severity | Before | After |
| -------- | -----: | ----: |
| Critical |      2 |     0 |
| High     |     80 |     2 |
| Moderate |     72 |     0 |
| Low      |     20 |     0 |
| Total    |    174 |     2 |

Two high-severity transitive advisories remain. Do not suppress them or represent this repository as having a clean audit:

- `astro > http-cache-semantics@4.2.0`: [GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp), shared-cache response disclosure through `max-stale` handling. No patched version is published in the advisory. The blog generates static public HTML and has no user sessions or shared authenticated response cache; that lowers the apparent exposure for this app, an inference from its source and deployment mode. Recheck before adding SSR, authentication, or response caching.
- `tailwindcss > chokidar > braces@3.0.3`: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack exhaustion from deeply nested patterns. No patched version is published in the advisory. The dependency is used by build tooling with repository-controlled patterns. Avoid passing untrusted patterns into it and revisit with the Tailwind migration or an upstream fix.

Archived or intentionally retained release lines:

- **Skeleton v2** (`@skeletonlabs/skeleton@2.11.0`, `@skeletonlabs/tw-plugin@0.4.1`): the [v2 documentation is archived](https://v2.skeleton.dev/). The overall Skeleton project is still active; the retained v2 line should be treated as legacy. The blog uses its generated heading/button/theme CSS. A migration requires visual review, so this pass preserves the theme and selects esbuild's CSS minifier because Vite 8's Lightning CSS rejects some v2 selectors.
- **Tailwind 3.4.19**: retained across all apps to avoid an unreviewed styling migration. The deprecated [Astro Tailwind integration](https://docs.astro.build/en/guides/integrations-guide/tailwind/) was removed. Plan Tailwind 4 and the blog theme together; older major version alone does not establish that a package is abandoned.
- **SvelteKit 2.70.3 / adapter-auto 7.0.1**: retained as a compatible pair. Adapter-auto 8 requires SvelteKit 3. Review the Kit 3 migration separately rather than accepting a peer mismatch.
- **TypeScript 5.9.3**: retained within framework peer requirements. The latest registry major is newer; update only alongside integration compatibility checks.

ESLint 8 was already [end-of-life](https://eslint.org/version-support/); that line has been removed. Current image tooling and Sharp are updated, rather than labelled unmaintained merely because their old versions were stale.

## Follow-up priorities

1. **Protect YouTube API quota before further production work.** A single public request still fetches up to 100 pages, with no rate limiter, cache, total request budget, or request deduplication. Per-fetch timeouts now exist, but do not bound the total duration. Choose infrastructure appropriate for the production deployment, restrict the API key to its intended API/use, and add mocked production-path coverage for pagination, missing credentials, and upstream failures. This pass tested the development API and made no live YouTube calls.
2. **Migrate the blog's theme and Tailwind.** Replace archived Skeleton v2 CSS or migrate to a supported Skeleton release; compare headings, buttons, spacing, typography, and dark mode. Then remove the CSS minifier compatibility setting and reconsider the `braces` advisory.
3. **Make production deploys depend on passing validation.** The existing Vercel workflows still trigger directly on matching pushes to `main`; they are not gated by the Test workflow. Check branch protection, Vercel project roots, Node settings, and whether Vercel Git integration duplicates these deployments. No external deployment settings were inspected or changed.
4. **Expand coverage with product development.** The blog has type/build checks but no browser suite. The Chrome extension has JS lint coverage, but needs a manual unpacked-extension test and hostname/ID handling review. The personal website is still a demo scaffold.
5. **Review the next coordinated majors.** SvelteKit 3/adapter 8, Tailwind 4/Skeleton, and a newer TypeScript require separate compatibility and behavior checks. Re-run `pnpm outdated --recursive` and `pnpm audit` regularly; current status is not a permanent guarantee.

## Validation and limits

Local validation used Node 22.23.3 and pnpm 10.34.6. All three apps passed type checks with no diagnostics, all three production builds passed, and 20 Playwright tests passed: 2 personal-website tests and 18 comment-finder tests, including two API checks. Changed files were formatted once with explicit paths, followed by lint and formatting checks. A frozen-lockfile install was checked after the final dependency changes.

The sandbox blocks localhost connections, so browser validation required approved execution outside it. Corepack shims and pnpm cache/store files used temporary directories to avoid the machine's incompatible global pnpm. GitHub Actions, Node 24, production YouTube requests, Chrome extension behavior, and Vercel deployments were not executed locally. The CI matrix is configured to validate Node 24 on GitHub.

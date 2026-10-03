# Maintenance and deployment

## Dependencies

Keep versions exact and update manifests with `pnpm-lock.yaml`. Review the SvelteKit,
svelte-check, and typescript-eslint peer ranges together before upgrading TypeScript.
Node types follow the Node 24 runtime. Review native build permissions in
`pnpm-workspace.yaml`; currently only Tailwind's oxide and esbuild are allowed.

Renovate groups minor, patch, digest, and pin updates on the first day of each month
in `Europe/Berlin`. Major upgrades remain separate; existing branches follow the same
schedule. Automerge is disabled. Releases need a known publication timestamp and a
one-day delay. Security fixes bypass the monthly schedule but retain the delay and
manual review. Enable GitHub Dependabot alerts and grant Renovate access separately.

pnpm also enforces a one-day release delay, including frozen installs. The exact-version
exception for ESLint 10.12.0 is needed until **2026-10-03 at 20:09 UTC**. On or after
**2026-10-04**, remove `minimumReleaseAgeExclude` from `pnpm-workspace.yaml` and verify
`pnpm install --frozen-lockfile`. Run `pnpm audit` and `pnpm outdated --recursive`
during dependency reviews.

## Production deployment

The personal website uses `@sveltejs/adapter-static` and outputs
`apps/personal-website/build`. Top Comment Finder uses `@sveltejs/adapter-vercel`
with Node 24 and outputs `.vercel/output` in its app directory.

The `Test` workflow deploys both web apps on pushes to `main` after `Validate`
passes. It checks that the tested commit is still the latest `main` commit and
serializes production deployments. Pull requests and manual test runs do not deploy.
The workflow requires `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` secrets
for Top Comment Finder. The personal website shares the organization and token
and uses its own `VERCEL_PERSONAL_WEBSITE_PROJECT_ID` secret. Each app has a separate
deployment concurrency group.

The app's `vercel.json` disables automatic Git deployments from `main`; other branches
can create previews. Require the `Validate` check in branch protection. In Vercel, use
`apps/top-comment-finder` as the root directory and Node 24 as the runtime. CI reads
`.nvmrc`; Vercel selects its Node 24 release through the app's `engines.node`.
Check that deploy hooks or other automation do not bypass validation. These account
settings are managed outside the repository.

The personal website's `vercel.json` disables all automatic Git deployments and
serves its static build with extensionless URLs. Create its Vercel project through
the CLI, with root directory `apps/personal-website`; no Git integration is needed.
See [personal website hosting](personal-website.md#hosting-on-vercel) for build
settings, environment variables, and domain migration.

See [Top Comment Finder production setup](top-comment-finder.md#production-setup)
for environment variables and quota configuration.

## Shared assets

Both apps self-host `Inter-Latin-Variable.woff2`, preserving variable weights, Latin
and extended Latin characters, combining accents, punctuation, currency symbols,
and common arrows. Other scripts use system-font fallbacks. Keep CSS and font
preloads pointing to the same asset.

To regenerate from `Inter-VariableFont_slnt,wght.ttf` in Git history, install
`fonttools[woff]` in a temporary environment and run:

```sh
pyftsubset Inter-VariableFont_slnt,wght.ttf \
  --output-file=Inter-Latin-Variable.woff2 --flavor=woff2 \
  --unicodes='U+0000-024F,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2212,U+FEFF,U+FFFD' \
  --layout-features='*' --name-IDs='*' --name-languages='*' \
  --notdef-outline --recommended-glyphs
```

Copy the result to each app's `static/fonts` directory.
Top Comment Finder uses a 96×96 WebP logo displayed at 48×48; its source is
`src/lib/assets/logo.png`. SVG icons are imported directly. There is no build-time
image-processing dependency.

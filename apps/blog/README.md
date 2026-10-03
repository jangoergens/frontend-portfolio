# Blog

A static Astro blog with Svelte components. Posts live in `src/content/posts`; `src/content.config.ts` loads them with Astro's content layer.

Install dependencies from the repository root with `pnpm install --frozen-lockfile`, then run `pnpm --filter blog start`. Use `pnpm --filter blog check` and `pnpm --filter blog build` to validate changes.

The blog retains Tailwind 3 and the archived Skeleton v2 theme. Read [the maintenance report](../../MAINTENANCE.md) before migrating its styling.

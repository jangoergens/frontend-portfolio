# Personal Website

A SvelteKit personal website scaffold with a demo home page and an about page. The static adapter prerenders both pages into `build/`; hosting needs no Node server.

Install dependencies from the repository root with `pnpm install --frozen-lockfile`, then run `pnpm --filter personal-website start`.

For validation, run `pnpm check`, `pnpm lint`, and `pnpm test` from the root. Install Chromium with `pnpm install-test-browser` first. Root browser tests build the app and start its preview server on port 5555.

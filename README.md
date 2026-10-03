# Frontend Portfolio

A personal website, a YouTube comment finder, and its companion Chrome extension.
Built with SvelteKit, Svelte, and Tailwind in a pnpm workspace.

| Project                                                 | Description                                          |
| ------------------------------------------------------- | ---------------------------------------------------- |
| [Personal Website](apps/personal-website/README.md)     | Personal website and project showcase                |
| [Top Comment Finder](apps/top-comment-finder/README.md) | Find the most liked comments on a YouTube video      |
| [Chrome extension](apps/tcf-chrome-extension/README.md) | Open the current YouTube video in Top Comment Finder |

## Getting started

Use the Node version in `.nvmrc` and the pnpm version in `package.json`.
From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter personal-website start
```

For Top Comment Finder, copy `apps/top-comment-finder/.env.example` to `.env`
in the same directory, then run `pnpm --filter top-comment-finder start`.
Development uses sample comments and needs no API key.

Run `pnpm start` from the repository root to start both web apps together.
Turborepo manages the development servers as persistent, uncached tasks.
Press Ctrl+C to stop them. Use the filtered commands above to run either app on its own.

## Documentation

- [Development and testing](docs/development.md)
- [Maintenance and deployment](docs/maintenance.md)
- [Design guidelines](docs/design-guidelines.md) and [copywriting style](docs/copywriting-style.md)

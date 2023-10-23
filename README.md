# Frontend Portfolio

Welcome to my portfolio! This monorepo is powered by [Turborepo](https://turborepo.org) and contains a selection of my best frontend projects.

## Getting started

1. In `apps/top-comment-finder` copy the `.env.example` file to `.env`.
2. (Optional) Fill in the credentials.
3. Run the command `pnpm all` to install all dependencies, build the project, and run the test suite.
4. Run `pnpm start` to start all projects, or navigate to the project you want to run and run `pnpm start` there.

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a package manager. It includes the following packages/apps:

- [top-comment-finder](./apps/top-comment-finder): A website that finds the top comments under a YouTube video.

## Utilities Used

Common:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Renovate Bot](https://docs.renovatebot.com/) for automated dependency updates
- [Github Actions](https://github.com/features/actions) for CI/CD
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

Top Comment Finder:

- [Playwright](https://playwright.dev/) for end-to-end testing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for bundling
- [Supabase](https://supabase.com/) for hosting the PostgreSQL database
- [Svelte](https://svelte.dev/) for the frontend framework
- [Vercel](https://vercel.com/) for hosting

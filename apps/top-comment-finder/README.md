# Top Comment Finder

A SvelteKit app that finds the most liked comments on a YouTube video.
Results include up to 20 comments; videos with many comments may return a sample.

From the repository root:

```sh
pnpm install --frozen-lockfile
cp apps/top-comment-finder/.env.example apps/top-comment-finder/.env
pnpm --filter top-comment-finder start
```

Development uses sample comments and needs no API key. Production requires a
server-side YouTube Data API key.

See [production setup and quota controls](../../docs/top-comment-finder.md) and
[development and testing](../../docs/development.md).

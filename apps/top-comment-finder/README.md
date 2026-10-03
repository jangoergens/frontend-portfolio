# Top Comment Finder

A SvelteKit app that finds the most liked comments on a YouTube video.

Install dependencies from the repository root with `pnpm install --frozen-lockfile`. Copy `.env.example` to `.env` in this directory, then run `pnpm --filter top-comment-finder start`.

Development mode returns sample comments without external credentials. Production mode requires `GOOGLE_API_MODE=production` and a server-side `GOOGLE_API_KEY` for the YouTube Data API. Keep the key in server environment variables, outside Git. Caching and quota counters use bounded application memory; no Redis database, account, or credentials are required.

## Production setup on Vercel

1. Open the Top Comment Finder project in Vercel. Under **Settings → Environment Variables**, confirm these values in **Production**:

   | Variable          | Value                              |
   | ----------------- | ---------------------------------- |
   | `GOOGLE_API_MODE` | `production`                       |
   | `GOOGLE_API_KEY`  | Your existing YouTube Data API key |

2. Under **Settings → Build and Deployment**, confirm the root directory is `apps/top-comment-finder` and the Node.js version is **24.x**. The app manifest also selects Node 24 through `engines.node`; Vercel manages its minor and patch release.
3. Review the YouTube Data API quota for the key's project in Google Cloud. Application counters apply separately to each running Vercel instance and reset on cold starts; they cannot enforce a global daily budget. Google's project quota is the global cap across instances and other apps using that project. If you want a lower global cap, lower the relevant daily quota in Google Cloud, allowing for any other project consumers. See [YouTube quota documentation](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits) and [Google Cloud quota management](https://docs.cloud.google.com/docs/quotas/view-manage).
4. Apply the code through the test-gated deployment workflow. Environment-variable changes take effect only on a new deployment. No external settings are changed by the repository changes.

If the Google variables are already configured, the storage change requires no new Vercel variables. Upstash variables from the previous implementation are unused and can be removed if you added them.

For a credential-free Preview deployment, set `GOOGLE_API_MODE=development` in Vercel's **Preview** environment. To test real YouTube behavior in a staging/Preview deployment, configure production mode and the Google API key there. Each running instance has an independent cache and application budget, even when deployments use the same key.

After setup, manually search a real video on the staging deployment and verify comments load. A repeated search served by the same instance should show `X-Comments-Cache: HIT` in the browser's Network panel; a different instance may show `MISS`. This live smoke test verifies the credentials and YouTube connection that mocked tests cannot. The Chrome check is separate: load the extension unpacked and follow [its smoke-test instructions](../tcf-chrome-extension/README.md).

See [Vercel's environment-variable documentation](https://vercel.com/docs/environment-variables/managing-environment-variables) and [Node.js runtime documentation](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) for the platform settings.

## Quota controls

Cache entries, counters, and fetch locks share one memory store within a running server process. Separate instances and cold starts have independent state. Missing Google configuration or exhausted storage capacity returns HTTP 503 and prevents new YouTube calls. Counter updates and lock acquisition are synchronous within the process.

| Control                              | Default                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------- |
| Requests per client                  | 10 per 60-second fixed window per instance, including cached requests       |
| YouTube budget                       | 1,000 attempted `commentThreads.list` calls per 24-hour window per instance |
| Pages per video lookup               | At most 10, each containing up to 100 comments                              |
| Fetch deadline                       | 15 seconds across quota checks and all YouTube pages                        |
| Successful-result cache              | 15 minutes per instance, at most 100 videos                                 |
| Concurrent lookups of the same video | One request per instance; duplicates receive 503 with a short `Retry-After` |
| Memory bounds                        | At most 2,000 active quota counters and 100 active fetch locks per instance |

The quota window starts with its first charged call; it is an application budget, separate from Google's quota reset. Every attempted page fetch is charged, including upstream failures. Cache hits consume the client rate limit but no YouTube quota. Within an instance, the budget and cache are grouped by API key. Client addresses come from SvelteKit's adapter and are stored only as keyed hashes with expiring counters. An unavailable client address uses one shared conservative rate limit within that instance.

Expired entries are reclaimed as needed. A full cache evicts its oldest inserted entry. Live counters and locks are never evicted to make room: new entries receive 503 until capacity becomes available, preserving existing limits. Restarts clear all state. This simple approach reduces repeated calls but cannot guarantee a global client rate limit or application budget across Vercel instances. Use Google's project quota for the global cap; strict application-wide limits would require shared storage.

Adjust defaults in `src/lib/server/comments.ts` only after reviewing the project's actual Google quota and other applications using that project. Restrict the key to the YouTube Data API and to your server infrastructure where supported. Monitor Google quota usage; the in-memory budget cannot account for other instances or project consumers.

Results contain up to 20 comments sorted by likes. The 10-page cap means they may be a sample rather than the highest-liked comments across the entire video. The API preserves its JSON array response and reports this through `X-Comments-Partial`; the page displays a sample notice. Rate-limited responses use 429, unavailable configuration/capacity or exhausted application quota use 503, upstream failures use 502, and deadline failures use 504. Error responses do not expose credentials or upstream response bodies. HTTP responses use `Cache-Control: no-store`; the application cache remains in server memory.

## Validation

Run `pnpm check`, `pnpm lint`, `pnpm build`, and `pnpm test` from the root. Install Chromium with `pnpm install-test-browser` first. Root browser tests build the app and start its preview server on port 4444, forcing development mode.

Run `pnpm --filter top-comment-finder test:server` for credential-free server tests. They cover production pagination and ordering, per-client limits, per-instance quota exhaustion and reset, cache expiry and eviction, bounded counter/lock capacity, concurrent lookup locking, production without external storage, independent instances, missing configuration, malformed responses, upstream errors, and cancellation/deadlines. Tests use local memory and mocked YouTube responses; they do not call live services. A live staging smoke test remains necessary to verify production credentials.

Deployment and external GitHub/Vercel setup are documented in the [root README](../../README.md#production-deployment).

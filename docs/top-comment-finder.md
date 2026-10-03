# Top Comment Finder operations

## Production setup

In Vercel, set the root directory to `apps/top-comment-finder` and use Node 24.
Configure these server environment variables for Production:

| Variable          | Value                |
| ----------------- | -------------------- |
| `GOOGLE_API_MODE` | `production`         |
| `GOOGLE_API_KEY`  | YouTube Data API key |

Keep the key outside Git and restrict it to the YouTube Data API and server
infrastructure where supported. No external storage service is required.
Use the [validated deployment workflow](maintenance.md#production-deployment);
environment-variable changes require a new deployment.

For credential-free previews, set `GOOGLE_API_MODE=development` in the Preview
environment. To test real YouTube behavior in staging, use production mode and an
API key there.

Review the Google Cloud project's YouTube quota, including other apps using it.
Google's project quota is the global cap. Application counters apply per instance
and reset on cold starts; lower the project's daily quota if a lower global cap is needed.

After setup, search a real video on staging. A repeated search on the same instance
should show `X-Comments-Cache: HIT` in the Network panel; another instance may show
`MISS`. This verifies credentials and connectivity beyond mocked tests. Check the
[Chrome extension](../apps/tcf-chrome-extension/README.md#try-it-locally) separately.

## Quota controls

Cache entries, counters, and fetch locks share bounded memory in each server process.
Separate instances have independent state; restarts clear it.

| Control                              | Default per instance                                           |
| ------------------------------------ | -------------------------------------------------------------- |
| Client requests                      | 10 per 60-second fixed window, including cache hits            |
| YouTube budget                       | 1,000 attempted `commentThreads.list` calls per 24-hour window |
| Pages per lookup                     | At most 10, each with up to 100 comments                       |
| Fetch deadline                       | 15 seconds across quota checks and page fetches                |
| Successful-result cache              | 15 minutes, at most 100 videos                                 |
| Concurrent lookups of the same video | One; duplicates receive 503 with `Retry-After`                 |
| Storage bounds                       | 2,000 active quota counters and 100 active fetch locks         |

The budget window starts with its first charged call, separately from Google's reset.
Every attempted page fetch is charged, including upstream failures. Cache hits consume
the client limit but no YouTube quota. Budgets and caches are grouped by API key.
Client addresses are stored as expiring keyed hashes; unavailable addresses share a
conservative rate limit.

Expired entries are reclaimed as needed; full caches evict the oldest inserted entry.
Live counters and locks are never evicted to make room. Exhausted capacity blocks new
entries with 503. Limits cannot enforce a global budget or client rate limit across
instances; strict application-wide limits require shared storage. Monitor Google's
quota usage and review it before adjusting defaults in
`apps/top-comment-finder/src/lib/server/comments.ts`.

## API behavior and testing

Results are a JSON array of up to 20 comments sorted by likes. The page cap can return
a sample; `X-Comments-Partial` reports this and the page shows a notice. HTTP responses
use `Cache-Control: no-store`; the application cache remains in server memory.

| Status | Cause                                                                          |
| ------ | ------------------------------------------------------------------------------ |
| 400    | Invalid video ID                                                               |
| 403    | Comments disabled for the video                                                |
| 404    | Video unavailable or private                                                   |
| 429    | Client rate limit                                                              |
| 503    | Missing/invalid configuration, exhausted quota or storage, or duplicate lookup |
| 502    | Upstream failure                                                               |
| 504    | Deadline exceeded                                                              |

Error responses omit credentials and upstream response bodies. Missing configuration
or storage capacity prevents new YouTube calls.

Recognized YouTube errors include a stable `code` for disabled comments, unavailable
videos, exhausted YouTube quota, or configuration failures. The page maps those codes
to its own messages and falls back to the HTTP status when a proxy returns non-JSON.
Server logs record only the upstream HTTP status and an allowlisted reason, never
the API key, request URL, upstream message, or Google project metadata.

If production fails, inspect the Vercel function logs for `YouTube comment request
failed`. `API_KEY_INVALID` means Google rejected the configured key: replace
`GOOGLE_API_KEY` in Vercel's Production environment with a valid key for a project
with YouTube Data API v3 enabled, then redeploy through the validated workflow.
`API_KEY_HTTP_REFERRER_BLOCKED` means a browser-restricted key is being used by the
server; use a server key restricted to YouTube Data API v3 and to server IP addresses
where supported. `SERVICE_DISABLED` or `API_KEY_SERVICE_BLOCKED` requires checking
API enablement and the key's API restrictions. `quotaExceeded` requires checking the
Google project's quota rather than replacing the key. See Google's
[API error reference](https://developers.google.com/youtube/v3/docs/errors) and
[key restrictions documentation](https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys).

Server tests mock YouTube responses and cover pagination, ordering, limits, cache and
storage bounds, locking, configuration failures, and deadlines. They do not verify live
credentials. See [development and testing](development.md) for commands.

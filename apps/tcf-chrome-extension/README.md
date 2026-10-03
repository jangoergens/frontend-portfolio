# Top Comment Finder Chrome extension

Click the extension action while viewing a YouTube video to open it at `https://topcomments.jangoergens.de`.

Supported links include `/watch?v=...`, `/shorts/...`, `/live/...`, and `/embed/...` on `youtube.com`, `www.youtube.com`, `m.youtube.com`, and `music.youtube.com`, plus `youtu.be/...` share links. The extension validates the hostname, HTTP/HTTPS scheme, and 11-character video ID. Missing or malformed URLs, unrelated hosts, credentials, nonstandard ports, duplicate `v` parameters, and unsupported paths are ignored.

Run `pnpm test:extension` from the repository root for automated URL-handling tests. These also run in the full `pnpm test` command and CI.

For a manual smoke test, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select this directory. Click the action on watch, Shorts, live, and share links and check that each opens the correct video in Top Comment Finder. Repeat on a non-YouTube page and YouTube's home page; neither should open a tab. Inspect the service worker for errors. Automated tests use a mocked Chrome API and do not replace this browser check.

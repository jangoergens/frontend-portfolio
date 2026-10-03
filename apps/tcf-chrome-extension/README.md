# Top Comment Finder Chrome extension

Click the extension while viewing a YouTube video to open it in
[Top Comment Finder](https://topcomments.jangoergens.de).
Supports watch, Shorts, live, embed, and share links.

## Try it locally

Open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**,
and select this directory.

Check that supported video links open the correct video. Non-video pages and
invalid URLs should do nothing. Inspect the service worker for errors.

Run `pnpm test:extension` from the repository root for URL-handling tests.
These use a mocked Chrome API; also check the extension in Chrome.

# Personal website maintenance

## Content and assets

English and German copy live in `apps/personal-website/src/lib/i18n.ts`. Both languages
use the shared `src/lib/Home.svelte` and `src/lib/About.svelte` components. Theme and
layout rules live in `apps/personal-website/src/app.css`.

The site prerenders `/en`, `/de`, `/en/about`, and `/de/about`. Explicit language URLs
always keep their language. At `/` and the legacy `/about` URL, an early browser script
selects a saved manual preference, then the first supported browser language, then
English. It preserves query strings and section anchors. Without JavaScript, these
entry pages show English and both language versions remain available through links.

The topbar's DE / EN links preserve the current page and section and remember manual
choices when local storage is available. Update both translation objects together;
TypeScript checks that their keys match. Page titles, descriptions, accessibility labels,
and contact form text belong in the dictionary. Validation messages follow the selected
language with JavaScript; without it, the browser supplies native validation messages.
Formspree manages its own confirmation and CAPTCHA pages.

Each localized page includes a canonical URL, alternate language links, and a language
attribute in its static HTML. The root and legacy about page are the `x-default` entries.

To replace the avatar, change the `personalAvatar` import in `src/lib/Home.svelte`.
The image uses a square frame with a circular crop. The official logo in
`src/lib/assets/plancraft.svg` comes from the plancraft website; preserve its colors
and dark backing for contrast.

## Contact form

The form submits directly to Formspree and works without JavaScript or a server.
The endpoint is declared in `apps/personal-website/src/env.ts`, without a production default.

Set `FORMSPREE_ENDPOINT` in the app's ignored `.env` or hosting build environment.
The endpoint is public and embedded in the static build; rebuild after changing it.
A missing or empty value disables submission and shows an alternative contact link.
Manage the destination inbox and notifications in Formspree.

Name, email, and message use native required-field validation. Formspree handles
confirmation and CAPTCHA; the hidden `_gotcha` field provides additional spam filtering.

## Hosting on Vercel

Use a separate Vercel project with root directory `apps/personal-website`, framework
preset Other, Node 24, and source files outside the root directory included in the
build step. The app's `vercel.json` declares the install and build commands, serves
the static `build/` directory, and enables extensionless URLs such as `/about`.
Keep the existing static adapter.

Create the project through the Vercel CLI without connecting a Git repository.
Automatic Git deployments are disabled for all branches. Production deployments
run through the validated GitHub Actions workflow. Add the project's ID as the
repository secret `VERCEL_PERSONAL_WEBSITE_PROJECT_ID`; the organization and token
use the existing `VERCEL_ORG_ID` and `VERCEL_TOKEN` secrets.

Set `ENABLE_EXPERIMENTAL_COREPACK=1` in Production and Preview so Vercel uses the
pnpm version pinned by the root manifest. Set `FORMSPREE_ENDPOINT` in Production
to the form URL from Formspree. Leave it unset in Preview to disable submissions,
or set a preview-specific endpoint. These variables are read during the build.

Test the deployment URL, including direct navigation to `/about`, before adding
`jangoergens.de` and `www.jangoergens.de` to the Vercel project. Use the exact DNS
records displayed by Vercel in Cloudflare, with the website records in DNS-only
mode. Preserve unrelated DNS records and keep the Google hosting available until
the domain migration has been verified.

## Testing

Browser tests cover responsive layouts, contact navigation, keyboard access,
no-JavaScript content, theme persistence, language selection, localized metadata, and language switching.
Contact tests intercept submissions.
To test with a placeholder endpoint, run from the repository root:

```sh
FORMSPREE_ENDPOINT=https://formspree.io/f/localtest pnpm --filter personal-website build
FORMSPREE_ENDPOINT=https://formspree.io/f/localtest pnpm --filter personal-website test
```

Use the same endpoint for the build and tests. See [development](development.md)
for the full validation commands.

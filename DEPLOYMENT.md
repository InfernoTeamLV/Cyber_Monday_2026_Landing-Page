# Production release

Prepared November 25, 2026 (America/Los_Angeles). This independent campaign has
not been published as a live website. No Netlify site or custom domain has been
created or linked. Hosting ownership is awaiting the user's selection; the
connected Netlify team is `monica-hd9w0m0`. Other Inferno projects are not targets.

The source remote is
[InfernoTeamLV/Cyber_Monday_2026_Landing-Page](https://github.com/InfernoTeamLV/Cyber_Monday_2026_Landing-Page),
using `main`. GitHub source publication does not configure website hosting or
verify the remaining checkout flow. No automatic deployment is configured here.

## Build and package

Use Node 24 and npm 11 with the existing lockfile. On a fresh checkout, run
`npm ci`, then `npm run check` and `npm run security:check`. Do not deploy the
repository root or run Vite's development/preview server as a production server.

On this Windows checkout, the release command uses the project-scoped runtime:

```powershell
./scripts/package-release.ps1
```

It requires formatting, 25 tests, TypeScript, the production build, public-file
allowlist, size budgets and the current dependency audit to pass. It creates a
timestamped directory in ignored `.local/releases/` containing `site.zip` and
`manifest.json`. The ZIP contains only the ten built files, including `_headers`
and the font license, with `index.html` at its root. Every ZIP entry is read back
and checked against its source SHA-256. The manifest records the archive digest
and each file's digest and size, outside the public ZIP. Keep these together.

The prepared release is
`inferno-cyber-monday-20261126T020918913Z/site.zip` (52,001 bytes). Its UTC filename
is November 26; preparation was November 25 in the user's timezone. SHA-256:

```text
b396d1e4b4c7c92c58e33d498f2d0d09ad423d2d6064e6079fd75de0ca1bdf4f
```

## Hosting configuration

`netlify.toml` sets the build command to `npm run check`, publishes only `dist`,
and selects Node 24 / npm 11.11.1. It was validated against Netlify's official
`@netlify/config` 25.6.2 JSON schema bundled with the installed CLI 27.17.0. The
public schema endpoint was unreachable, so validation used that vendor schema.
See [Netlify file configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

`scripts/hosting-headers.mjs` generates `dist/_headers` during every build. HTML
and robots.txt revalidate on each use. Fingerprinted bundles have a one-year
immutable cache lifetime; build validation rejects non-fingerprinted bundle
names. The stable seal/favicon use one hour and fonts one day. Cache scopes do
not overlap. Strict CSP and existing security headers remain global. No server,
database, environment secrets, analytics or new runtime dependency is required.
See [Netlify custom headers](https://docs.netlify.com/manage/routing/headers/).

No catch-all SPA rewrite is configured: this page has no client-side routes.
Unknown/private paths should remain 404. Other hosts must apply equivalent HTTP
headers themselves; uploading `_headers` does not configure every hosting provider.

Search exclusion remains in HTML metadata, robots.txt and X-Robots-Tag. This
preserves the existing campaign setting and is not access control. Confirm the
indexing decision before changing it. HTTPS and deployed headers still require
verification on the chosen live host.

## Publication procedure

1. Select an independent project and its owning team; record its site ID, live
   URL and dashboard URL here. Confirm the approved offer and all three packages
   in Mindbody, including sale eligibility/window. Page copy does not configure
   vendor prices or schedule the sale.
2. Complete the authenticated checkout review below before launch sign-off.
3. Deploy the checked `dist` output or unpacked `site.zip`. On Netlify, use a draft
   deploy first, then publish the reviewed release to the selected project. No
   credentials belong in source, command arguments or this document. Linking
   writes `.netlify/state.json`; `.netlify/` is already ignored.
4. On the deployed HTTPS URL, verify the exact release assets, MIME types, CSP,
   permissions, indexing and cache headers. Confirm private/source/map paths
   return 404 and the host compresses text assets. Check the offer, selector,
   hosted fallback, error recovery, focus restoration and native checkout again.
5. Record deploy ID, artifact digest, tested URLs, owner and validation results.
   Keep the local archive/manifest and a known-good source revision for recovery.

If Git continuous deployment is connected later, document its production branch:
the next production push replaces a manual deploy. For a bad published release,
fix forward by reverting the source change and deploying a newly checked build;
do not restore an older Netlify deploy. A failed deploy does not replace the live
release. Keep the verified artifact/manifest and the GitHub source baseline
together; the ignored local release archives are not included in Git.

## Checkout sign-off still required

All three official package pages and their email sign-in transitions were
observed inside the panel. Authenticated payment review remains unverified. The
previous approved cart Continue returned to package selection and then sign-in;
it did not establish that payment controls work. Do not describe this release as
fully verified end to end or infer authentication/payment from a cart or frame.

The user must sign in directly, or provide vendor test facilities, to review
payment and cancellation without a purchase. Also verify physical phone/tablet
Safari and Chrome, soft keyboards and assistive technology. Chrome DevTools touch
checks should use 100% device-toolbar zoom. Identity providers and bank challenges
may require their own secure windows; do not override vendor security behavior.

Mindbody owns accounts, card entry, pricing, eligibility and transactions. Never
collect card data in the parent page or infer a successful purchase from a click,
frame load or redirect. See [verification evidence](VERIFICATION.md).

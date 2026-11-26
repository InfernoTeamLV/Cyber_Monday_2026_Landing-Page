# The Gift of Inferno — Cyber Monday

Independent campaign page with a checked production package. TNT, Planksgiving and Blackout are separate
projects. The page uses semantic HTML, CSS Grid, a local licensed Barlow Condensed
font, an optimized official Inferno seal and small TypeScript modules. There is
no runtime framework, backend, database or parent-page analytics.

The current design follows the user's latest artwork: a full-page orange and
burgundy background, static glowing instrument rings, horizontal IHP letterforms,
the official seal, oversized cream headline, corner traces and a glowing pill CTA.
The reference's mock browser frame and title bar are omitted. Artwork is inline
SVG and CSS; no new image downloads, fonts or JavaScript dependencies are required.

## Inline purchase flow

Get the gift card opens three local package cards in the right-hand panel:
$100 for $50, $250 for $125 and $500 for $250. Each card loads its official Mindbody
purchase page into one native iframe in that same panel. The package identifiers
and displayed campaign prices were matched to the supplied Pricing widget,
`c5732322c8`, on November 25, 2026. URLs live in src/gift-card-options.ts; HTML links
are checked against that configuration. Mindbody owns final prices, eligibility,
account information, cart contents, card entry and payment processing.

The original Pricing widget's branded Continue action explicitly opens hosted
checkout in a new tab. The official standalone purchase pages avoid that launcher:
all three were observed showing their package details and email sign-in inside
an iframe. The business already uses the same official purchase-link format on
its public pricing page. No vendor script, session-storage patch, guessed checkout
parameter or popup blocker is used to change vendor behavior.

One X activation closes the entire panel from the selector, checkout, loading or
error view and restores the original offer and CTA focus. It resets the selector
for the next opening while retaining the native checkout document. After reopening,
Return to checkout or selecting the same package restores that frame without
navigating again. Choosing a different package opens its official purchase page
in the same frame. Modified link clicks keep normal browser behavior.

The panel uses the full right column and up to 40rem of height, bounded by the
viewport. In the two-column layout it grows around the original offer center
without lengthening the page or moving the brand. Phones reserve a taller slot
below the brand. The X remains a transparent, heavier close icon over the
upper-right corner, inset 12px from the top, with a 44px target and keyboard focus.
The native frame scrolls internally; vendor document sizes cannot grow the page.
Reserve 64px above scrolling content so the X cannot cover vendor controls.

A white skeleton matching the frame pulses while the selected purchase page loads.
It has no visible loading text. A visually hidden polite status serves screen
readers; reduced motion disables the animation. The iframe load event reveals
vendor content, never payment success. Errors, frame-policy blocks or a 15-second
timeout show retry and an explicit official hosted fallback. Retry restarts the
selected package page. No minimum loading delay is added.

No iframe or Mindbody request is created when the page or local selector opens.
The checkout controller is imported only after Get the gift card. The original
verified widget URL remains the native fallback when page JavaScript is unavailable,
a modified CTA click requests navigation, or the local module fails. Normal
package selection uses the embedded official purchase pages.

## Local development

Use project-scoped Node 24 and the exact lockfile dependencies. The system runtime
is unchanged. On this Windows checkout, .local/node24.txt may contain an available
Node 24 executable. The helper selects it for its child process only:

```powershell
./scripts/run-local.ps1 -Task dev
./scripts/run-local.ps1 -Task check
./scripts/run-local.ps1 -Task preview
./scripts/run-local.ps1 -Task security:check
```

With Node 24 selected, the equivalent commands are npm ci, npm run dev,
npm run check, npm run preview and npm run security:check.

- Development: <http://127.0.0.1:5176/>
- Production-build preview: <http://127.0.0.1:4176/>
- Stop a foreground server with Ctrl+C.

## Performance, accessibility and security

Essential campaign copy and the homepage/hosted links remain in HTML. Gradients
and letterforms are CSS and inline vector paths. Media dimensions reserve space;
the local font is preloaded with font-display swap. Each I H P letter scales
smoothly by 4.5% and adopts the shared hover color, also tinting the linked Inferno
seal. The seal scales by the same amount on its own hover and keyboard focus,
preserving its rotation. An isolated multiply blend tints only its white areas.
Reduced motion disables scaling and transitions while retaining color feedback.
Cyber Monday appears in a pill inside the ring above IHP, without a duplicate
page eyebrow or footer. Monday 11/30 only. No exclusions. remains the approved
terms, placed directly below the CTA as requested.

The page supports narrow phones, container-based reflow for enlarged text,
keyboard navigation, visible focus, a skip link and forced colors. Inactive offer
copy remains in layout with visibility hidden, aria-hidden and inert. The selector
and embedded checkout have accessible headings; native account and payment fields
belong to Mindbody, and the parent never reads their values or authentication state.

npm run check runs formatting, behavior/security tests, TypeScript, production
build and public asset/size checks. Budgets remain 100 KiB for all public output,
4 KiB initial JavaScript and 8 KiB total first-party JavaScript, uncompressed.
Vendor content inside the iframe is separate from the first-party budget.

Production CSP permits only local scripts, styles, images and fonts, and the
exact official go.mindbodyonline.com frame origin. Parent forms, objects, framing,
inline/evaluated JavaScript and inline production CSS remain blocked. Only Vite
HMR adds inline CSS and its loopback socket in development. Payment permission
is scoped to the official frame. The generated dist/_headers must be applied by
the chosen host; a file alone does not prove deployed enforcement.

The old parent widget loader and its broader script/image/style allowances are
removed. The controller accepts only the three exact configured purchase URLs.
It ignores cross-origin messages and never infers payment from a page load,
redirect, click, query parameter or client-side state. Secrets, vendor downloads,
QA fixtures and project-private files are excluded from production.

See [verification evidence](VERIFICATION.md) for checked behavior and limits.
Font licensing is retained in public/fonts/BARLOW-LICENSE.txt. Preview indexing
remains blocked by metadata, robots.txt and X-Robots-Tag.

## Production package

`./scripts/package-release.ps1` runs the complete checks and current dependency
audit, then creates a verified ZIP and SHA-256 manifest in ignored `.local/releases/`.
The archive contains only `dist/` contents. `netlify.toml` supplies the isolated
build settings; generated `_headers` supplies security and cache policy. HTML
revalidates, hashed bundles use immutable caching, and stable media use shorter
lifetimes. No hosting project has been created or linked.

See [production deployment instructions](DEPLOYMENT.md) for the prepared artifact,
ownership, indexing, launch checks and recovery procedure.

## Before publication

All package-to-email transitions and the native $100 cart were reviewed inside
the panel. Payment, account and eligibility flows still need controlled vendor
data or the user's assistance before end-to-end sign-off. In Chrome DevTools,
use 100% device-toolbar preview zoom for touch testing: scaled iPad emulation
stalled embedded taps, while unscaled tablet and phone tests reached sign-in.
Federated identity providers and bank authentication may require their own secure
windows; those vendor requirements are not overridden.

Reconfirm each live package's price, redemption terms, availability and identity
against the campaign configuration. Static campaign cards do not automatically
sync from Mindbody. Confirm sale timezone/window, HTTPS, actual production headers
and indexing. Source is maintained on `main` in
[the campaign repository](https://github.com/InfernoTeamLV/Cyber_Monday_2026_Landing-Page).
No live website deployment has been created. Choose
hosting separately, publish only dist/, and record deployment ownership and a known
good commit/build for rollback. Neighboring campaigns are not deployment targets.

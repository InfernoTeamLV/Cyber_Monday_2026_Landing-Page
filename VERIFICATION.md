# Cyber Monday development verification

Checked November 25, 2026. Independent local project. Neighboring TNT,
Planksgiving and Blackout applications are outside this change. Nothing was deployed.

## Production release preparation

November 25, 2026: formatting, all 25 tests, TypeScript, Vite build, publish
allowlist and budgets passed. A fresh online dependency audit found zero known
vulnerabilities. The ten-file public output is now 75,574 bytes; the additional
399 bytes are hosting cache rules. Initial JavaScript stays 2,895 bytes, total
JavaScript 6,307 bytes, and initial page/assets 65,056 bytes. No rendered styling,
checkout logic or dependencies changed in this preparation.

The ZIP is 52,001 bytes. Every entry was read back and matched to the checked
build's SHA-256; archive and per-file hashes are retained in its manifest. The
Netlify config passed its vendor JSON schema. Generated headers retain strict
CSP and add non-overlapping cache scopes: revalidated HTML, immutable hashed
bundles, and shorter lifetimes for stable font/image URLs. These are prepared
host rules, not evidence of an actual deployed CDN response.

Fresh production-fixture review returned all nine served assets with 200,
matching hashes and correct MIME types. All six checked security headers matched.
The six private/source/map probes returned 404. A pattern scan of 27 source/build
files found no matching private-key/common-token/hardcoded-secret patterns; this
does not establish that every possible vulnerability or secret is absent.

Fresh axe-core 4.14.1 checks found no automated first-party violations for the
offer and selector at 320 x 568, 768 x 1024, 1600 x 900, and 320px with root text
doubled. No horizontal overflow was observed in the measured phone/tablet/text
states or desktop offer. Tablet dismissal closed the whole panel once and
restored CTA focus. Initial page and selector created no iframe. The seal
decoded at 256 x 256. Screenshot: `.local/production-release.jpg`.

Separate performance-only cold fixture samples measured LCP 84ms at 1600 x 900
and 564ms at 390 x 844 with the existing simulated 150ms response latency and
aggregate 200,000 byte/second cap. Both had CLS 0 and no tasks over 50ms. These
are single local samples on desktop CPU without slowdown, not Lighthouse scores
or field performance. Axe was excluded from timing runs. Audit-on-resize reports
were excluded from these timing samples.

Public deployment, actual CDN caching/compression/HTTPS and authenticated vendor
payment still need verification. No cloud resources were created. Search
exclusion is preserved pending the indexing decision. See [deployment notes](DEPLOYMENT.md).

## Latest visual revision

Matched the newest reference's artwork without its mock browser frame, title bar,
traffic-light controls or outer window border. The full-page composition now uses
orange/burgundy gradients, static glowing SVG rings, horizontal IHP letters, the
official seal, larger cream headline, dot/trace details and a glowing pill CTA.
Existing offer wording and Mindbody integration are retained; the approved Monday
11/30 terms sit directly below the button as requested. Hover tinting/scaling,
reduced motion, keyboard access and one-click checkout dismissal remain supported.

No dependencies, fonts, image downloads, security policies or checkout logic were
changed. All 23 tests, formatting, TypeScript, the production build and asset budgets
passed. Public output is 75,175 bytes; initial JavaScript remains 2,895 bytes.

The terms follow the CTA in both DOM and visual order, with a 1.25rem gap
(20px at the checked default text size). The button retains its `aria-describedby`
reference to the terms. Latest page screenshot: `.local/terms-below-button.jpg`.

The IHP row anchors H to the circle's center. A static 25% translation of I
compensates for its extra SVG sidebearing, making the painted I–H and H–P gaps
equal. Measurements of the actual SVG paths gave matching gaps of 16.639px at
320px, 20.972px at 768px and 44.658px at 1600px. H stayed within 0.04px of the
circle's axis. Desktop measurements were taken after hover transitions settled.
The letter-spacing screenshot is `.local/ihp-visible-gaps.jpg`.

Production-build axe review found no automated violations in the offer and selector
at 320 x 568, 705 x 559, 768 x 1024, 1600 x 900, and 320px with doubled root text.
No horizontal overflow was observed. Additional visual viewport checks included
390 x 844, 820 x 1180 and 1024 x 768. The final 705px layout was checked after reducing
the split-layout breakpoint and fits its 559px height. Small phones scroll naturally.
The 320px CTA is 257 x 64px; the close control remains 44 x 44px. At doubled text,
long content wraps and scrolls, with matching 194px menu client/scroll widths.

At tablet width, the native $100 package displayed inside a 336.875 x 576px frame,
with matching vendor client/scroll widths and an 8px gap below the X. Its Continue
button remained within the visible frame. One close restored the offer and CTA
focus. Keyboard Return opened/closed the selector with visible 3px focus outlines.
No authenticated payment or purchase was performed during this styling revision.

Gradient contrast still requires manual review. Adjacent-background samples on
phone and desktop gave minimum heading contrast 7.83:1, description 7.62:1 and
terms 10.31:1. These samples supplement automated checks, not a complete audit.

One cold production-fixture sample each measured LCP 88ms at 390 x 844, 112ms at
1600 x 900, and 528ms at 390px with simulated 150ms response latency and an aggregate
200,000 byte/second cap. All three measured CLS 0 and no tasks over 50ms. There was
no CPU slowdown; these are local lab samples, not field metrics or Lighthouse scores.
The observer was excluded from the public build and axe was not used in timing runs.

Screenshots: `.local/redesign-desktop.jpg`, `.local/redesign-phone.jpg`.
Earlier security, integration and repeated performance evidence below predates
this visual revision unless explicitly identified as current build sizes.

## Checkout and responsive controls

Get the gift card opens three local cards. Each selects its exact allowlisted
official Mindbody purchase URL in one native iframe. Supplied widget `c5732322c8`
remains the configuration reference and no-JavaScript fallback.

| Gift card | Price | Official pricing-option ID |
| --------- | ----- | -------------------------- |
| $100      | $50   | po_11AXjPEx2ki2BzdaX       |
| $250      | $125  | po_11AXjPEx2ki2BzdbY       |
| $500      | $250  | po_11AXjPEx2ki2BzdcZ       |

Business `bus_11AXjPEx2ki2C6Zu1`, identifiers and prices were matched against the
supplied widget on November 25. Mindbody owns final prices and eligibility;
static cards do not automatically synchronize with the vendor.

Fixed an observed tablet overlap: scrolling the cart could move My Account under
our X. The panel now reserves 64px above scrolling contents. The transparent X
has a 44px target and an 8px gap above the iframe. The iframe cannot scroll under
it. This reduces vendor content height by 64px; native content remains scrollable.

One X activation closes the entire panel and restores the CTA and focus.
Reopening resets the selector; Return to checkout retains the native document.
Selecting another card navigates the same iframe. Loading uses an accessible,
text-free pulsing skeleton, reduced-motion CSS, a 15-second timeout, retry and an
explicit official fallback. A frame load never means payment success.

All three package-to-email transitions were reviewed inside the production-build
fixture. In the development preview, the $100 package reached Your cart
inside the panel. Promo-code and gift-card fields opened and returned correctly;
the Cancellation Policy dialog opened and closed internally. Cart display alone
does not establish that the visitor is authenticated. No codes, credentials
or payment details were entered by the agent and no purchase was submitted.

### Chrome DevTools touch reproduction

The user reported that Continue did nothing in device mode. Native Windows Chrome
testing reproduced this in an isolated checkout-only window: iPad Mini 768 x 1024
at 75% preview zoom, with no observed navigation or new requests after a tap.
The standalone Mindbody page continued normally in the same device mode.

Changing only device-toolbar Zoom to 100% allowed the embedded $100 package's
Continue tap to reach email sign-in. The iPhone SE 375 x 667 preset, displayed at
its unscaled size, also advanced the $500 package to sign-in using a native tap.
This points to scaled touch emulation; it does not establish a real-device browser
defect or physical-device success. Repeat touch tests at 100% toolbar zoom.
Google describes device mode as an approximation:
<https://developer.chrome.com/docs/devtools/device-mode>.

Evidence remains in ignored `.local/chrome-tablet-touch100.jpg` and
`.local/chrome-phone-touch100.jpg`. No vendor script, storage, query-flag or popup
interception workaround was introduced.

## Security check

- Current `npm run security:check`: **0 known dependency vulnerabilities**, including
  development dependencies. Dependencies and lockfile were unchanged.
- Pattern scan of 24 source/build text files found no matching private-key,
  common credential-token or hard-coded secret-assignment patterns. This scoped
  scan cannot prove the absence of every secret or vulnerability.
- First-party source uses no dynamic HTML/code execution, payment message handler
  or browser credential storage. Exact HTTPS package destinations have tampering
  and unsafe-scheme tests.
- Production CSP allows local scripts/styles/images/fonts and only the official
  `go.mindbodyonline.com` frame origin. Inline/evaluated scripts, inline production
  CSS, objects, parent forms and framing are blocked. Development adds only HMR
  styles and its loopback socket.
- All six configured security headers matched the production fixture. Private
  environment/Git/source/lockfile/QA/source-map paths returned 404 there. The build
  allowlist excludes private files, QA tools, vendor downloads and source maps.
- The parent never reads vendor credentials, card values, session tokens or payment
  state. Mindbody remains responsible for account and payment processing.

A public host must apply `dist/_headers` or equivalent policies. HTTPS and actual
deployed enforcement have not been tested. Vendor code and bank authentication
are outside the first-party dependency audit. No external penetration test was run.

## Performance and assets

`npm run check` passed formatting, 23 behavior/security tests, TypeScript, the
production build, asset allowlist and size budgets. Node 24.22.2 and npm 11.11.1
are project-scoped; the system runtime was unchanged.

| Build measurement                                   | Bytes, uncompressed |
| --------------------------------------------------- | ------------------- |
| Initial first-party JavaScript                      | 2,895               |
| Optional checkout chunk                             | 3,412               |
| Total first-party JavaScript                        | 6,307               |
| Initial page and assets, including favicon          | 65,056              |
| Entire public output, including license and headers | 75,175              |

Budgets remain 4 KiB initial JavaScript, 8 KiB total first-party JavaScript and
100 KiB public output. In the audited build, all nine served files returned 200, had appropriate
MIME types and matched their on-disk SHA-256 digests. The seal decoded at 256 x 256;
the local WOFF2 loaded once through its matching preload. Media dimensions reserve
space. No remote fonts, parent analytics or runtime framework are needed.

Initial page and local selector create no iframe or Mindbody requests. Checkout
code is imported on demand; vendor requests start only after package selection.
Vendor resources are separate from first-party sizes and timings.

### Earlier-design browser performance measurements

The repeated timing runs below preceded the visual redesign. JavaScript, font and
image assets are unchanged; HTML and CSS have changed. The sizes above reflect
the current build; the latest design's loading samples are recorded at the top.

Production-build fixture, Chromium, three cold/no-store runs per condition.
Native PerformanceObserver measurements; desktop CPU without slowdown. The ignored
observer adds small overhead; axe was not loaded during performance runs. Text
resources used Brotli; fonts and WebP were served directly.

| Condition                           | LCP range | Median LCP | CLS | Tasks over 50ms |
| ----------------------------------- | --------- | ---------- | --- | --------------- |
| 390 x 844, loopback                 | 96-116ms  | 108ms      | 0   | 0               |
| 768 x 1024, loopback                | 76-124ms  | 96ms       | 0   | 0               |
| 1440 x 900, loopback                | 120-148ms | 124ms      | 0   | 0               |
| 390 x 844, simulated slower network | 504-564ms | 540ms      | 0   | 0               |

The slower-network fixture adds 150ms response latency and caps aggregate transfer
at 200,000 bytes/second, approximately 1.6 Mbps. This is not a physical mobile device,
standard Lighthouse profile, Lighthouse score or field Core Web Vitals result.
The keyboard sample's longest recorded event interaction was 32ms; this is not
field INP. Actual CDN caching/compression and live vendor loading remain deployment
checks. Detailed sanitized measurements are ignored local QA artifacts.

## Accessibility and styling

Fixed two findings: checkout retains an h1 with an h2 menu heading, and package
links derive accessible names from visible text instead of mismatched overrides.
Terms now read exactly **Monday 11/30 only. No exclusions.**, as requested by the user.

Pinned axe-core 4.14.1 ran only in an ignored fixture, with WCAG A/AA, 2.1/2.2 AA
and best-practice rules. After fixes, no automated violations were reported for
offer and selector at 320 x 568, 390 x 844, 768 x 1024, 820 x 1180, 1024 x 768 and
1440 x 900, or 320px with root text doubled to 32px. Axe is absent from production.
Controlled frame-policy failures at 320px and 768px also had no automated
violations. Error recovery exposed the selected package fallback and 44px retry,
fallback and close targets; the skeleton disappeared.

No first-party horizontal overflow was observed. At 320px the selector scrolls
vertically, package targets exceed 44px height and the X is 44 x 44. At doubled
text, the 194px selector had matching scrollWidth and wrapped its cards; later
cards remained available by scrolling. This is controlled text resizing, not
actual browser zoom or a real soft-keyboard test.

Keyboard review verified the skip link, CTA activation, X focus, package links,
visible 3px focus outlines and restored CTA focus after closing. Hover effects
remain CSS-only. Reduced-motion and forced-color rules were reviewed; OS settings
were not changed.

Axe marks gradient contrast for manual review and cannot inspect the cross-origin
vendor frame automatically. Adjacent background samples from phone/tablet/desktop
screenshots had minimum normal-description/terms contrast of 7.0:1 and large-heading
contrast of 5.86:1. Package text uses checked solid surface colors. Samples supplement,
rather than certify, all contrast states. Manual frame review confirmed named fields
and reachable native controls; screen-reader and full vendor payment audits remain.

## Remaining payment and launch verification

The cart's Continue explicitly accepts the Cancellation Policy. The user approved
one activation of that control on the $50 cart. It returned to the package screen;
retrying the package Continue then displayed email sign-in inside the panel.
The user must sign in directly before authenticated payment controls can be
reviewed. This return remains an unresolved end-to-end verification concern.
No payment-screen, completed transaction or universal checkout claim is made.
A successful cart display is neither authentication proof nor purchase success.

Before launch, test physical-device Safari/Chrome, soft keyboards, assistive
technology, authenticated payment and cancellation with controlled vendor data.
Federated identity and bank authentication may require their own secure windows;
those requirements have not been overridden. Reconfirm offer terms, sale window,
timezone, prices, package IDs, HTTPS, deployed headers and indexing.

Publish only `dist/` when requested. Choose ownership and record a known-good
build/commit for recovery. The source repository is recorded in DEPLOYMENT.md;
no live website deployment exists.
The development page remains <http://127.0.0.1:5176/>.

# Inferno Cyber Monday engineering guidance

This is an independent Cyber Monday project. Keep its source, repository,
configuration and deployment separate from TNT, Planksgiving and The Blackout.

- Treat performance, responsive design, accessibility, scalability and security as
  acceptance criteria. Use semantic HTML, modern CSS and small TypeScript modules.
  Do not add a framework, backend, database or service worker without a requirement.
- Match the newest reference's full-page orange/burgundy artwork, glowing circular
  instrument rings, horizontal I H P lettering, official seal below, cream
  oversized headline and glowing pill CTA. Do not include the mock browser window,
  its title bar, traffic-light controls or surrounding window border. Use static
  inline SVG/CSS for the artwork and page-edge dot/trace details. Stack
  the panels on phones. Get the gift card replaces the offer with three local
  package cards. Each opens its verified official Mindbody purchase page inside
  the panel. One X activation always closes the entire panel and restores the
  original offer and CTA focus, resetting the selector for the next opening.
  Retain the native frame/document so Return to checkout can resume it.
- Checkout uses the full offer column and a larger, viewport-bounded height.
  In the two-column layout it expands vertically around the original offer's
  center without repositioning the brand or lengthening the page. Stacked phone
  layouts reserve a taller slot in the normal page flow. The inactive copy stays
  in layout with visibility hidden, aria-hidden and inert; the checkout fills its
  responsive slot absolutely and scrolls internally. Vendor sizing must not
  expand that slot. The X close icon is an
  absolute control at the upper-right of the panel. Reserve 64px above the
  scrolling selector and iframe so the X never covers vendor controls as they
  scroll. Keep that area free of a visible title or other header content.
  Use a thicker X with a transparent background, including on hover, inset
  12px from the top. There is no visible Gift cards heading or text button.
  Keep its accessible name, 44px minimum target and visible keyboard focus; retain
  the screen-reader heading that labels the checkout region.
- The Cyber Monday pill is inside the ring above the horizontal letters. Three
  equal columns keep the H on the ring and logo's center line at every size.
  Match the visible edge-to-edge I–H and H–P gaps while keeping H centered.
  Measure glyph paths rather than SVG boxes. I's static 25% translation compensates
  for its extra SVG sidebearing and leaves the shared hover scaling independent.
  Individual I H P letters smoothly scale on hover and change to the shared
  button/logo hover color.
  Hovering any letter also tints the logo's white areas. The logo smoothly scales
  on its own hover and keyboard focus while preserving its rotation and black
  artwork. Reduced motion disables scaling; keep these effects in CSS.
  The seal links to `https://infernopilates.com/` in the current tab and must remain
  keyboard-accessible, visibly focusable and exposed to assistive technology.
- Keep the separate page eyebrow and duplicate footer absent. The headline breaks
  after “The gift of”; terms appear directly below the CTA.
- The user revised the offer line to “All gift cards are 50% off.” The heading
  remains The gift of Inferno; the terms read Monday 11/30 only. No exclusions. Do not invent dates,
  scarcity, claims or additional offer terms. The supplied Pricing widget ID is
  `c5732322c8` is retained as the source reference and hosted fallback. Use the
  official per-package purchase URLs in src/gift-card-options.ts for the inline
  flow. Their identifiers and prices were matched to that widget on November 25, 2026. Keep HTML package links consistent with the verified configuration.
  Create one native iframe only after selecting a package; reuse it on resume.
  Do not reuse the Black Friday widget IDs or purchase links. Mindbody manages the
  widget's own copy, pricing and availability; changing page copy does not edit it.
  The widget's branded launcher opens hosted sign-in in a new tab. The official
  standalone purchase pages keep the email sign-in transition in the iframe for
  all three packages. Verify the authenticated cart/payment flow with controlled
  vendor data or the user's assistance before claiming end-to-end verification.
  Do not patch vendor code, block required identity/bank windows or manipulate
  vendor session storage. Keep the functioning purchase path available.
- Keep essential content in HTML so it remains readable without JavaScript. Keep
  changing campaign copy separate from behavior. Use local fonts and images, reserve
  their dimensions, and avoid third-party requests on initial load.
- Use semantic landmarks, accessible names, readable contrast, visible focus,
  keyboard access and reduced-motion support. Test 320/390px phones, tablet,
  desktop, landscape, long content and 200% zoom.
  In Chrome DevTools, repeat touch checks with device-toolbar Zoom at 100%.
  Scaled iPad emulation stalled cross-origin iframe taps during local QA, while
  unscaled phone/tablet taps reached sign-in. Verify physical devices separately;
  do not patch vendor code or browser security to mask an emulation issue.
- Mindbody must handle payment entry, prices, sale eligibility and purchase records
  when connected. Never infer payment success from a click, frame load, redirect
  or query parameter. Validate supplied external destinations and scope CSP to
  verified origins. Keep privileged credentials out of Git, bundles, logs and images.
  Production parent scripts, styles and images are self-hosted; only the official
  go.mindbodyonline.com frame origin is permitted. Do not inject vendor scripts
  into the parent or allow inline production CSS/JavaScript. Only development HMR
  needs inline CSS. A native frame load reveals the vendor page; it does not
  verify rendered application content or payment. Do not consume payment messages.
  While loading, show a text-free skeleton card matching the checkout footprint
  with a gentle opacity pulse. Keep the loading announcement available to screen
  readers, stop animation for reduced motion, and remove the skeleton on readiness
  or error. Do not delay a ready widget just to display the animation.
  Provide an honest timeout/error state with retry and the verified hosted fallback.
- Use project-scoped Node 24, exact supported dependencies and the lockfile.
  Do not change the system runtime or dependencies in neighboring projects.
- Run npm run check for code changes and npm run security:check after dependency
  changes. Add tests for meaningful behavior and failure cases, not presentation
  markup. Review the production build, mobile/keyboard behavior and asset budget.
- Bind local servers to loopback. The initial deliverable is a local development
  page; hosting and the final Mindbody experience remain undecided. Do not publish
  a campaign or create cloud resources until publication is requested.
- Before launch, verify approved copy, actual checkout, HTTPS, production security
  headers and the indexing decision. Document deployment ownership and rollback.
- Preserve unrelated work and report only checks actually performed.

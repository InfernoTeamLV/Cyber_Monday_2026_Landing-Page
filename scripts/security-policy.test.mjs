import assert from "node:assert/strict";
import test from "node:test";
import { contentSecurityPolicy, securityHeaders } from "../src/security-policy.ts";

const directive = (policy, name) =>
  policy.split("; ").find((item) => item.startsWith(`${name} `));

test("production allows only local scripts and the official Mindbody checkout frame", () => {
  const policy = contentSecurityPolicy();
  assert.equal(directive(policy, "script-src"), "script-src 'self'");
  assert.equal(
    directive(policy, "frame-src"),
    "frame-src https://go.mindbodyonline.com"
  );
  assert.equal(directive(policy, "connect-src"), "connect-src 'self'");
  assert.equal(directive(policy, "style-src"), "style-src 'self'");
  assert.doesNotMatch(directive(policy, "script-src"), /unsafe-|\*|google/);
  for (const expected of [
    "default-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'none'"
  ])
    assert.ok(policy.split("; ").includes(expected));
  assert.doesNotMatch(policy, /unsafe-eval|wss?:|\*/);
  assert.equal(securityHeaders["X-Content-Type-Options"], "nosniff");
  assert.equal(securityHeaders["X-Frame-Options"], "DENY");
  assert.equal(
    securityHeaders["Permissions-Policy"],
    'camera=(), microphone=(), geolocation=(), payment=(self "https://go.mindbodyonline.com")'
  );
});

test("development adds only HMR styles and its loopback connection", () => {
  const production = contentSecurityPolicy();
  const development = contentSecurityPolicy(true);
  assert.equal(
    development.replace(" ws://127.0.0.1:5176", "").replace(" 'unsafe-inline'", ""),
    production
  );
  assert.doesNotMatch(production, /5176/);
});

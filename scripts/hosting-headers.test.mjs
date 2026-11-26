import assert from "node:assert/strict";
import test from "node:test";
import { cacheRules, hostingHeaders } from "./hosting-headers.mjs";
import { contentSecurityPolicy, securityHeaders } from "../src/security-policy.ts";

test("immutable caching is restricted to fingerprinted build assets", () => {
  assert.equal(cacheRules["/assets/*"], "public, max-age=31536000, immutable");
  for (const [path, value] of Object.entries(cacheRules)) {
    if (path !== "/assets/*") assert.doesNotMatch(value, /immutable/, path);
  }
  assert.match(cacheRules["/"], /max-age=0, must-revalidate/);
  assert.equal(cacheRules["/"], cacheRules["/index.html"]);
  assert.equal(cacheRules["/*"], undefined, "Avoid overlapping cache directives");
});

test("the deploy header file retains the strict production security policy", () => {
  const [global, ...scopes] = hostingHeaders().trim().split("\n\n");
  assert.equal(global.split("\n")[0], "/*");
  for (const [name, value] of Object.entries({
    ...securityHeaders,
    "Content-Security-Policy": contentSecurityPolicy()
  })) {
    assert.ok(global.split("\n").includes(`  ${name}: ${value}`), name);
  }
  assert.doesNotMatch(global, /Cache-Control|unsafe-inline|unsafe-eval/);
  assert.equal(scopes.length, Object.keys(cacheRules).length);
  for (const scope of scopes) {
    const [path, header] = scope.split("\n");
    assert.equal(header, `  Cache-Control: ${cacheRules[path]}`);
  }
});

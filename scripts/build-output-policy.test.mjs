import assert from "node:assert/strict";
import test from "node:test";
import { isPublishableAsset } from "./build-output-policy.mjs";

test("only public page assets may be deployed", () => {
  for (const path of [
    "index.html",
    "_headers",
    "assets/index-abc123.js",
    "assets/index-abc123.css",
    "images/inferno-seal.webp",
    "fonts/barlow-condensed-latin-700-normal.woff2",
    "fonts/BARLOW-LICENSE.txt"
  ]) {
    assert.equal(isPublishableAsset(path), true, path);
  }
});

test("private files, traversal paths, source maps and nested exports are rejected", () => {
  for (const path of [
    ".env",
    ".git/config",
    ".local/design-reference.png",
    "assets/index.js.map",
    "assets/../secret.js",
    "images/export/customer-data.webp",
    "package-lock.json",
    "AGENTS.md",
    "fonts/license-and-customer-data.txt",
    "src/main.ts",
    "README.md"
  ]) {
    assert.equal(isPublishableAsset(path), false, path);
  }
});

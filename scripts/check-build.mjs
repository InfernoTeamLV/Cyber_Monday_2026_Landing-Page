import assert from "node:assert/strict";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { isPublishableAsset } from "./build-output-policy.mjs";
import { hostingHeaders } from "./hosting-headers.mjs";

await writeFile("dist/_headers", hostingHeaders());
const files = await readdir("dist", { recursive: true, withFileTypes: true });
let totalBytes = 0;
let jsBytes = 0;
for (const file of files.filter((entry) => entry.isFile())) {
  const relative = `${file.parentPath}/${file.name}`
    .replaceAll("\\", "/")
    .replace(/^.*?dist\//, "");
  assert.ok(isPublishableAsset(relative), `Unexpected public build file: ${relative}`);
  if (relative.startsWith("assets/")) {
    assert.match(
      relative,
      /-[\w-]{8}\.(?:js|css)$/,
      "Immutable asset must be fingerprinted"
    );
  }
  const bytes = await readFile(`dist/${relative}`);
  if (relative.endsWith(".js")) jsBytes += bytes.length;
  totalBytes += bytes.length;
  console.log(`${relative}: ${bytes.length} bytes (${gzipSync(bytes).length} gzip)`);
}
for (const required of [
  "dist/index.html",
  "dist/images/inferno-seal.webp",
  "dist/fonts/barlow-condensed-latin-700-normal.woff2"
]) {
  assert.ok((await readFile(required)).length > 0, required);
}
assert.ok(totalBytes < 100 * 1024, `Public output exceeds 100 KiB: ${totalBytes}`);
const html = await readFile("dist/index.html", "utf8");
const initialScripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^" ]+\.js)"/g)];
assert.ok(initialScripts.length > 0, "No built entry script was found.");
let initialJsBytes = 0;
for (const [, path] of initialScripts)
  initialJsBytes += (await readFile(`dist${path}`)).length;
assert.ok(
  initialJsBytes < 4 * 1024,
  `Initial JavaScript exceeds 4 KiB: ${initialJsBytes}`
);
assert.ok(jsBytes < 8 * 1024, `Total JavaScript exceeds 8 KiB: ${jsBytes}`);
console.log(
  `Build checks passed: ${totalBytes} bytes total; ${initialJsBytes} bytes initial JavaScript; ${jsBytes} bytes total JavaScript.`
);

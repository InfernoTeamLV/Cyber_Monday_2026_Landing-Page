const rootFiles = new Set(["index.html", "favicon.svg", "robots.txt", "_headers"]);

export function isPublishableAsset(path) {
  return (
    rootFiles.has(path) ||
    path === "fonts/BARLOW-LICENSE.txt" ||
    /^(?:assets\/[\w-]+\.(?:js|css)|fonts\/[\w-]+\.woff2|images\/[\w-]+\.webp)$/.test(
      path
    )
  );
}

import { contentSecurityPolicy, securityHeaders } from "../src/security-policy.ts";

// Cache scopes do not overlap: Netlify combines matching header values.
// Stable media filenames must revalidate sooner than fingerprinted bundles.
export const cacheRules = {
  "/": "public, max-age=0, must-revalidate",
  "/index.html": "public, max-age=0, must-revalidate",
  "/robots.txt": "public, max-age=0, must-revalidate",
  "/favicon.svg": "public, max-age=3600",
  "/images/*": "public, max-age=3600",
  "/fonts/*": "public, max-age=86400",
  "/assets/*": "public, max-age=31536000, immutable"
};

export function hostingHeaders() {
  const headers = {
    ...securityHeaders,
    "Content-Security-Policy": contentSecurityPolicy()
  };
  return (
    `/*\n${Object.entries(headers)
      .map(([name, value]) => `  ${name}: ${value}`)
      .join("\n")}\n\n` +
    Object.entries(cacheRules)
      .map(([path, value]) => `${path}\n  Cache-Control: ${value}\n`)
      .join("\n")
  );
}

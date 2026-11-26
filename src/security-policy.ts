export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    'camera=(), microphone=(), geolocation=(), payment=(self "https://go.mindbodyonline.com")',
  "X-Robots-Tag": "noindex, nofollow"
};

export function contentSecurityPolicy(development = false): string {
  return [
    "default-src 'none'",
    "script-src 'self'",
    // Vite injects styles for development HMR; production uses only external CSS.
    `style-src 'self'${development ? " 'unsafe-inline'" : ""}`,
    "img-src 'self'",
    "font-src 'self'",
    `connect-src 'self'${development ? " ws://127.0.0.1:5176" : ""}`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-src https://go.mindbodyonline.com",
    "frame-ancestors 'none'",
    "form-action 'none'"
  ].join("; ");
}

import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { contentSecurityPolicy, securityHeaders } from "./src/security-policy.ts";

export default defineConfig({
  build: { sourcemap: false, assetsInlineLimit: 0 },
  server: {
    host: "127.0.0.1",
    port: 5176,
    strictPort: true,
    fs: {
      strict: true,
      allow: [fileURLToPath(new URL(".", import.meta.url))],
      deny: [
        "**/.env*",
        "**/.git/**",
        "**/.local/**",
        "**/.npm/**",
        "**/*.{pem,key,crt}",
        "**/AGENTS.md",
        "**/README.md",
        "**/scripts/**",
        "**/package*.json"
      ]
    },
    headers: {
      ...securityHeaders,
      "Content-Security-Policy": contentSecurityPolicy(true)
    }
  },
  preview: {
    host: "127.0.0.1",
    port: 4176,
    strictPort: true,
    headers: {
      ...securityHeaders,
      "Content-Security-Policy": contentSecurityPolicy()
    }
  }
});

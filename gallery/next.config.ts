import type { NextConfig } from "next";

// PAGES_BASE is set by scripts/build-pages.mjs. The static build has no server, so route.local.ts drops out of it.
const base = process.env.PAGES_BASE;
const nextConfig: NextConfig = base
  ? { output: "export", distDir: "out", basePath: base, trailingSlash: true, env: { NEXT_PUBLIC_BASE: base } }
  : { pageExtensions: ["tsx", "ts", "local.ts"] };

export default nextConfig;

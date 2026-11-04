import type { NextConfig } from "next";

// PAGES_BASE is set by scripts/build-pages.mjs for the static GitHub Pages build.
const base = process.env.PAGES_BASE;
const nextConfig: NextConfig = base
  ? { output: "export", distDir: "out", basePath: base, trailingSlash: true, images: { unoptimized: true }, env: { NEXT_PUBLIC_BASE: base } }
  : {};

export default nextConfig;

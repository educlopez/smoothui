import withBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
  headers() {
    return [
      {
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
        ],
        source: "/r/(.*)",
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      {
        hostname: "img.logo.dev",
        protocol: "https",
      },
      {
        hostname: "ik.imagekit.io",
        protocol: "https",
      },
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
      {
        hostname: "pbs.twimg.com",
        protocol: "https",
      },
      {
        hostname: "abs.twimg.com",
        protocol: "https",
      },
      {
        hostname: "unavatar.io",
        protocol: "https",
      },
    ],
  },
  reactStrictMode: true,
  redirects() {
    return [
      // Redirect removed matrix-card component to home page
      {
        destination: "/",
        permanent: true,
        source: "/docs/components/matrix-card",
      },
      // Specific redirects for renamed components (must come before generic patterns)
      {
        destination: "/docs/components/morph-surface",
        permanent: true,
        source: "/docs/components/ai-input",
      },
      {
        destination: "/docs/components/animated-o-t-p-input",
        permanent: true,
        source: "/doc/components/animated-otp-input",
      },
      {
        destination: "/docs/blocks/logo-clouds",
        permanent: true,
        source: "/doc/blocks/logo-cloud",
      },
      {
        destination: "/docs/blocks/team-sections",
        permanent: true,
        source: "/doc/blocks/team",
      },
      {
        destination: "/docs/components/accordion",
        permanent: true,
        source: "/doc/basic/basic-accordion",
      },
      // Redirect /doc to /docs
      {
        destination: "/docs",
        permanent: true,
        source: "/doc",
      },
      // Redirecciones de categorías a /docs/components/
      {
        destination: "/docs/components/:component",
        permanent: true,
        source: "/doc/basic/:component",
      },
      {
        destination: "/docs/components/:component",
        permanent: true,
        source: "/doc/text/:component",
      },
      {
        destination: "/docs/components/:component",
        permanent: true,
        source: "/doc/ai/:component",
      },
      {
        destination: "/docs/components/:component",
        permanent: true,
        source: "/doc/components/:component",
      },
      // Redirect /doc/blocks/:block to /docs/blocks/:block
      {
        destination: "/docs/blocks/:block",
        permanent: true,
        source: "/doc/blocks/:block",
      },
      // Redirección genérica para cualquier otra ruta /doc/* -> /docs/*
      {
        destination: "/docs/:path*",
        permanent: true,
        source: "/doc/:path*",
      },
      // Redirect Guides
      {
        destination: "/docs/guides/installation",
        permanent: true,
        source: "/doc/installation",
      },
      {
        destination: "/docs/guides/design-principles",
        permanent: true,
        source: "/doc/design-principles",
      },
      {
        destination: "/docs/guides/mcp",
        permanent: true,
        source: "/doc/mcp",
      },
      {
        destination: "/docs/guides/changelog",
        permanent: true,
        source: "/doc/changelog",
      },
      {
        destination: "/docs/components/",
        permanent: true,
        source: "/doc/text",
      },
      {
        destination: "/docs/components/",
        permanent: true,
        source: "/doc/basic",
      },
      {
        destination: "/docs/components/",
        permanent: true,
        source: "/doc/ai",
      },
    ];
  },
  rewrites() {
    return [
      {
        destination: "/llms.mdx/:path*",
        source: "/docs/:path*.mdx",
      },
    ];
  },
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "twoslash",
    "shiki",
    "@takumi-rs/core",
  ],
};

let nextConfig = withMDX({ ...config });

if (process.env.ANALYZE === "true") {
  nextConfig = withBundleAnalyzer()(nextConfig);
}

export default nextConfig;

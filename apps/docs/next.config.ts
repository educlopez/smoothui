import withBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "twoslash",
    "shiki",
    "@takumi-rs/core",
  ],
  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // biome-ignore lint/suspicious/useAwait: "redirects is async"
  async redirects() {
    return [
      // Specific redirects for renamed components (must come before generic patterns)
      {
        source: "/doc/components/animated-otp-input",
        destination: "/docs/components/animated-o-t-p-input",
        permanent: true,
      },
      {
        source: "/doc/blocks/logo-cloud",
        destination: "/docs/blocks/logo-clouds",
        permanent: true,
      },
      {
        source: "/doc/blocks/team",
        destination: "/docs/blocks/team-sections",
        permanent: true,
      },
      {
        source: "/doc/basic/basic-accordion",
        destination: "/docs/components/accordion",
        permanent: true,
      },
      // Redirect /doc to /docs
      {
        source: "/doc",
        destination: "/docs",
        permanent: true,
      },
      // Redirecciones de categorías a /docs/components/
      {
        source: "/doc/basic/:component",
        destination: "/docs/components/:component",
        permanent: true,
      },
      {
        source: "/doc/text/:component",
        destination: "/docs/components/:component",
        permanent: true,
      },
      {
        source: "/doc/ai/:component",
        destination: "/docs/components/:component",
        permanent: true,
      },
      {
        source: "/doc/components/:component",
        destination: "/docs/components/:component",
        permanent: true,
      },
      // Redirect /doc/blocks/:block to /docs/blocks/:block
      {
        source: "/doc/blocks/:block",
        destination: "/docs/blocks/:block",
        permanent: true,
      },
      // Redirección genérica para cualquier otra ruta /doc/* -> /docs/*
      {
        source: "/doc/:path*",
        destination: "/docs/:path*",
        permanent: true,
      },
      // Redirect Guides
      {
        source: "/doc/installation",
        destination: "/docs/guides/installation",
        permanent: true,
      },
      {
        source: "/doc/design-principles",
        destination: "/docs/guides/design-principles",
        permanent: true,
      },
      {
        source: "/doc/mcp",
        destination: "/docs/guides/mcp",
        permanent: true,
      },
      {
        source: "/doc/changelog",
        destination: "/docs/guides/changelog",
        permanent: true,
      },
      {
        source: "/doc/text",
        destination: "/docs/components/",
        permanent: true,
      },
      {
        source: "/doc/basic",
        destination: "/docs/components/",
        permanent: true,
      },
      {
        source: "/doc/ai",
        destination: "/docs/components/",
        permanent: true,
      },
    ];
  },
  // biome-ignore lint/suspicious/useAwait: "rewrites is async"
  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
    ];
  },
  // biome-ignore lint/suspicious/useAwait: "headers is async"
  async headers() {
    return [
      {
        source: "/r/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
        ],
      },
    ];
  },
};

let nextConfig = withMDX({ ...config });

if (process.env.ANALYZE === "true") {
  nextConfig = withBundleAnalyzer()(nextConfig);
}

export default nextConfig;

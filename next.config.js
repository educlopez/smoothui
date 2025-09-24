const fs = require("fs")
const path = require("path")

function getComponentSlugs() {
  const filePath = path.join(__dirname, "src/app/doc/data/components.ts")
  const slugs = new Set()
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8")
    // This regex matches: slug: "something"
    const matches = [...content.matchAll(/slug:\s*['"`]?([\w-]+)['"`]?/g)]
    matches.forEach((match) => slugs.add(match[1]))
  }
  return Array.from(slugs)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },

  // Turbopack configuration (replaces deprecated experimental.turbo)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Image optimization
  images: {
    unoptimized: false,
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "github.com" },
    ],
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,

  // Headers for better caching - optimized for static content
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      // Static pages - cache for 1 year since they're generated at build time
      {
        source: "/doc/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Home page and other static pages
      {
        source: "/((?!api|_next|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // API routes - short cache for analytics
      {
        source: "/api/analytics",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      // OG image generation - longer cache since it's expensive
      {
        source: "/api/og",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // Static assets - cache for 1 year
      {
        source:
          "/(.*).(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    const slugs = getComponentSlugs()
    return slugs.map((slug) => ({
      source: `/doc/${slug}`,
      destination: `/doc/components/${slug}`,
      permanent: true,
    }))
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      }
    }

    return config
  },
}

const withVercelToolbar = require("@vercel/toolbar/plugins/next")()

module.exports = withVercelToolbar(nextConfig)

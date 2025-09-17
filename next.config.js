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
    unoptimized: false, // Enable Next.js image optimization
    formats: ["image/webp", "image/avif"], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "www.lummi.ai" },
      { hostname: "github.com" },
      { hostname: "images.unsplash.com" },
    ],
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,

  // Headers for better caching
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
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/doc/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=7200",
          },
        ],
      },
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
      {
        source: "/_next/image(.*)",
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
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
          motion: {
            test: /[\\/]node_modules[\\/](motion|framer-motion|popmotion)[\\/]/,
            name: "motion",
            chunks: "all",
            priority: 20,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: "radix",
            chunks: "all",
            priority: 15,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
            priority: 5,
          },
        },
      }
    }

    return config
  },
}

const withVercelToolbar = require("@vercel/toolbar/plugins/next")()

module.exports = withVercelToolbar(nextConfig)

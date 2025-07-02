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
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "www.lummi.ai" },
      { hostname: "github.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    const slugs = getComponentSlugs()
    return slugs.map((slug) => ({
      source: `/doc/${slug}`,
      destination: `/doc/components/${slug}`,
      permanent: true,
    }))
  },
}

const withVercelToolbar = require("@vercel/toolbar/plugins/next")()

module.exports = withVercelToolbar(nextConfig)

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
}

const withVercelToolbar = require("@vercel/toolbar/plugins/next")()

module.exports = withVercelToolbar(nextConfig)

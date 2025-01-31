/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "www.lummi.ai" },
    ],
  },
}

const withVercelToolbar = require("@vercel/toolbar/plugins/next")()

module.exports = withVercelToolbar(nextConfig)

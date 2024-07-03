/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
}

const withVercelToolbar = require("@vercel/toolbar/plugins/next")()

module.exports = withVercelToolbar(nextConfig)

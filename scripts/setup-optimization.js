#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

console.log("🚀 Setting up SmoothUI Vercel Optimization...\n")

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local")
const envExamplePath = path.join(process.cwd(), ".env.example")

// Create .env.example if it doesn't exist
if (!fs.existsSync(envExamplePath)) {
  const envExample = `# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here

# Optional: Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
`
  fs.writeFileSync(envExamplePath, envExample)
  console.log("✅ Created .env.example file")
}

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log("⚠️  .env.local file not found!")
  console.log(
    "📝 Please create .env.local with your Upstash Redis credentials:"
  )
  console.log("   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url_here")
  console.log("   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here")
  console.log("")
  console.log(
    "🔗 Get your Upstash credentials from: https://console.upstash.com/"
  )
} else {
  console.log("✅ .env.local file found")
}

// Check package.json for required dependencies
const packageJsonPath = path.join(process.cwd(), "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

const requiredDeps = ["@upstash/redis"]
const missingDeps = requiredDeps.filter((dep) => !packageJson.dependencies[dep])

if (missingDeps.length > 0) {
  console.log("⚠️  Missing required dependencies:")
  missingDeps.forEach((dep) => console.log(`   - ${dep}`))
  console.log("")
  console.log("📦 Install them with:")
  console.log(`   pnpm add ${missingDeps.join(" ")}`)
} else {
  console.log("✅ All required dependencies are installed")
}

console.log("\n🎯 Optimization Setup Complete!")
console.log("")
console.log("📋 Next Steps:")
console.log("1. Set up Upstash Redis database: https://console.upstash.com/")
console.log("2. Add Upstash credentials to .env.local")
console.log("3. Install dependencies: pnpm install")
console.log("4. Build and deploy: pnpm run build && vercel deploy --prod")
console.log("")
console.log("📊 Expected Results:")
console.log("- ISR Reads: ~0 (from 1.1M+)")
console.log("- Fast Origin Transfer: Minimal (from 10.76GB+)")
console.log("- Edge Requests: Optimized (from 808K+)")
console.log("")
console.log("📖 Read OPTIMIZATION_GUIDE.md for detailed information")

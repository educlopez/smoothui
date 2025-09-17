#!/usr/bin/env node

const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const publicDir = path.join(__dirname, "..", "public")

// Asset optimization configuration
const optimizations = [
  {
    input: "smoothiegif.webp",
    outputs: [
      { format: "webp", quality: 80, suffix: "-optimized" },
      { format: "avif", quality: 75, suffix: "-avif" },
    ],
  },
  {
    input: "readme.png",
    outputs: [
      { format: "webp", quality: 85, suffix: "-optimized" },
      { format: "avif", quality: 80, suffix: "-avif" },
    ],
  },
  {
    input: "og.jpg",
    outputs: [
      { format: "webp", quality: 85, suffix: "-optimized" },
      { format: "avif", quality: 80, suffix: "-avif" },
    ],
  },
  {
    input: "dynamic-og.png",
    outputs: [
      { format: "webp", quality: 85, suffix: "-optimized" },
      { format: "avif", quality: 80, suffix: "-avif" },
    ],
  },
]

async function optimizeAsset(inputFile, outputs) {
  const inputPath = path.join(publicDir, inputFile)

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  File not found: ${inputFile}`)
    return
  }

  const stats = fs.statSync(inputPath)
  const originalSize = (stats.size / 1024 / 1024).toFixed(2)
  console.log(`\n📁 Processing: ${inputFile} (${originalSize} MB)`)

  for (const output of outputs) {
    const outputFile = inputFile.replace(
      /\.[^.]+$/,
      `${output.suffix}.${output.format}`
    )
    const outputPath = path.join(publicDir, outputFile)

    try {
      await sharp(inputPath)
        .toFormat(output.format, { quality: output.quality })
        .toFile(outputPath)

      const newStats = fs.statSync(outputPath)
      const newSize = (newStats.size / 1024 / 1024).toFixed(2)
      const savings = (
        ((stats.size - newStats.size) / stats.size) *
        100
      ).toFixed(1)

      console.log(`  ✅ ${outputFile}: ${newSize} MB (${savings}% smaller)`)
    } catch (error) {
      console.error(`  ❌ Failed to optimize ${outputFile}:`, error.message)
    }
  }
}

async function main() {
  console.log("🚀 Starting asset optimization...\n")

  // Check if sharp is available
  try {
    require("sharp")
  } catch (error) {
    console.error("❌ Sharp is not installed. Run: npm install sharp")
    process.exit(1)
  }

  for (const asset of optimizations) {
    await optimizeAsset(asset.input, asset.outputs)
  }

  console.log("\n✨ Asset optimization complete!")
  console.log("\n💡 Next steps:")
  console.log("1. Update your components to use the optimized versions")
  console.log("2. Consider using Next.js Image component with format selection")
  console.log("3. Test the optimized assets in your application")
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { optimizeAsset, optimizations }

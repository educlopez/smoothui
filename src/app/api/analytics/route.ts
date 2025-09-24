import { NextRequest, NextResponse } from "next/server"

import { KVStorage } from "@/lib/kv"

export const runtime = "edge"

// Track page views
export async function POST(request: NextRequest) {
  try {
    const { type, pageId, componentId } = await request.json()

    if (!type || !pageId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case "pageView":
        result = await KVStorage.incrementPageViews(pageId)
        break
      case "copy":
        result = await KVStorage.incrementCopyCount(pageId)
        if (componentId) {
          await KVStorage.incrementComponentCopies(componentId)
        }
        break
      case "componentView":
        if (componentId) {
          result = await KVStorage.incrementComponentViews(componentId)
        }
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get("pageId")
    const componentId = searchParams.get("componentId")
    const type = searchParams.get("type")

    if (!type) {
      return NextResponse.json(
        { error: "Missing type parameter" },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case "pageViews":
        if (!pageId)
          return NextResponse.json({ error: "Missing pageId" }, { status: 400 })
        result = await KVStorage.getPageViews(pageId)
        break
      case "copyCount":
        if (!pageId)
          return NextResponse.json({ error: "Missing pageId" }, { status: 400 })
        result = await KVStorage.getCopyCount(pageId)
        break
      case "componentStats":
        if (!componentId)
          return NextResponse.json(
            { error: "Missing componentId" },
            { status: 400 }
          )
        result = await KVStorage.getComponentStats(componentId)
        break
      case "globalStats":
        result = await KVStorage.getGlobalStats()
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Analytics GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

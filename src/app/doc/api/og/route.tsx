import { ImageResponse } from "next/og"

import { domain } from "@/lib/domain"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")

  return new ImageResponse(
    (
      <div
        style={{
          backgroundImage: `url(${domain}/dynamic-og.png)`,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            marginLeft: 200,
            marginRight: 200,
            marginBottom: 140,
            display: "flex",
            fontSize: 110,
            fontFamily: "Inter",
            letterSpacing: "-0.05em",
            fontStyle: "normal",
            color: "white",
            lineHeight: "130px",
            whiteSpace: "pre-wrap",
          }}
        >
          {title && title.length > 100 ? title.slice(0, 97) + "..." : title}
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    }
  )
}

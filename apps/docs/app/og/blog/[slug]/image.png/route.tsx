import { blogSource } from "@docs/lib/source";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const revalidate = false;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  const post = blogSource.getPage([slug]);

  if (!post) {
    notFound();
  }

  return new ImageResponse(
    <div
      style={{
        backgroundColor: "#171717",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "80px",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          display: "flex",
          fontSize: "40px",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        Smooth<span style={{ color: "#fe65b0" }}>UI</span>
        <span
          style={{
            alignSelf: "center",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "24px",
            marginLeft: "16px",
            textTransform: "none",
          }}
        >
          Blog
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            fontSize: "56px",
            fontWeight: 700,
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {post.data.title}
        </h1>
        {post.data.description ? (
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "24px",
              margin: 0,
            }}
          >
            {post.data.description}
          </p>
        ) : null}
      </div>
    </div>,
    {
      height: 630,
      width: 1200,
    }
  );
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

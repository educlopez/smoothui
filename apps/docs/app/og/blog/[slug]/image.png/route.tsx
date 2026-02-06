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
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#171717",
        padding: "80px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "40px",
          fontWeight: 700,
          color: "#ffffff",
          textTransform: "uppercase",
        }}
      >
        Smooth<span style={{ color: "#fe65b0" }}>UI</span>
        <span
          style={{
            marginLeft: "16px",
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.6)",
            textTransform: "none",
            alignSelf: "center",
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
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {post.data.title}
        </h1>
        {post.data.description && (
          <p
            style={{
              fontSize: "24px",
              color: "rgba(255, 255, 255, 0.7)",
              margin: 0,
            }}
          >
            {post.data.description}
          </p>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

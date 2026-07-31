import type { ImageResponseOptions } from "next/server";
import type { ReactNode } from "react";

export interface GenerateProps {
  description?: ReactNode;
  title: ReactNode;
}

export function getImageResponseOptions(): ImageResponseOptions {
  return {
    height: 630,
    width: 1200,
  };
}

export function generate({ title, description }: GenerateProps) {
  return (
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
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "28px",
              margin: 0,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

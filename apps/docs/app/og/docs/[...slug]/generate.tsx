import type { ImageResponseOptions } from "next/server";
import type { ReactNode } from "react";

export type GenerateProps = {
  title: ReactNode;
  description?: ReactNode;
};

export function getImageResponseOptions(): ImageResponseOptions {
  return {
    width: 1200,
    height: 630,
  };
}

export function generate({ title, description }: GenerateProps) {
  return (
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
            fontSize: "64px",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: "28px",
              color: "rgba(255, 255, 255, 0.8)",
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

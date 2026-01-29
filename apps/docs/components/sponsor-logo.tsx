import { getSponsorSVGComponent } from "@docs/lib/sponsor-svgs";
import type { Sponsor } from "@docs/lib/sponsors";
import Image from "next/image";

interface SponsorLogoProps {
  sponsor: Sponsor;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function SponsorLogo({
  sponsor,
  className = "",
  width = 20,
  height = 20,
  style,
  onError,
}: SponsorLogoProps) {
  // Check if we have a theme-aware SVG component in the registry
  const SVGComponent = getSponsorSVGComponent(sponsor.logo, sponsor.name);

  // If we have a registered SVG component, render it with theme support
  if (SVGComponent && sponsor.logo.endsWith(".svg")) {
    return (
      <div
        className={`inline-flex shrink-0 items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <SVGComponent
          className="h-full w-full"
          height={height}
          style={style}
          width={width}
        />
      </div>
    );
  }

  // For non-SVG images or SVGs not in the registry, use Next.js Image component
  return (
    <Image
      alt={sponsor.name}
      className={className}
      height={height}
      onError={onError}
      src={sponsor.logo}
      style={style}
      width={width}
    />
  );
}

/**
 * Registry of theme-aware SVG logo components for sponsors
 *
 * HOW TO ADD A NEW SVG SPONSOR LOGO:
 *
 * Step 1: Create a new component function below (e.g., YourSponsorLogo)
 *   - Copy the SVG content from the logo file
 *   - Replace all fill="black" or fill="#000" with fill="currentColor"
 *   - Replace all stroke="black" or stroke="#000" with stroke="currentColor" (if applicable)
 *   - Add a <title> element with the sponsor name for accessibility
 *
 * Step 2: Add an entry to SPONSOR_SVG_REGISTRY mapping
 *   - You can map by logo path (e.g., "/your-sponsor.svg")
 *   - Or by sponsor name (e.g., "Your Sponsor")
 *   - Or both for flexibility
 *
 * That's it! The SponsorLogo component will automatically use your new SVG.
 *
 * Example:
 * ```tsx
 * function MyNewSponsorLogo({ className = "", width = 100, height = 100, style }: SVGLogoProps) {
 *   return (
 *     <svg className={className} width={width} height={height} style={style} viewBox="0 0 100 100" fill="none">
 *       <title>My New Sponsor logo</title>
 *       <path d="..." fill="currentColor" />
 *     </svg>
 *   );
 * }
 *
 * // Then in SPONSOR_SVG_REGISTRY:
 * "/my-new-sponsor.svg": MyNewSponsorLogo,
 * "My New Sponsor": MyNewSponsorLogo,
 * ```
 */

interface SVGLogoProps {
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

function ShadcnblocksLogo({
  className = "",
  width = 78,
  height = 90,
  style,
}: SVGLogoProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={height}
      style={style}
      viewBox="0 0 78 90"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Shadcnblocks.com logo</title>
      <path
        d="M46.7305 4.50982L43.6252 2.72955V17.49L46.7305 19.2924V4.50982Z"
        fill="currentColor"
      />
      <path
        d="M52.9854 8.14811L49.8765 6.34937V21.1287L52.9854 22.9127V8.14811Z"
        fill="currentColor"
      />
      <path
        d="M59.1814 11.7684L56.0762 9.9881V24.7485L59.1814 26.5325V11.7684Z"
        fill="currentColor"
      />
      <path
        d="M6.04712 26.0179L9.15238 27.8019V17.246L6.04712 19.0262V26.0179Z"
        fill="currentColor"
      />
      <path
        d="M2.93874 24.2184V20.8651L0 22.5491L2.93874 24.2184Z"
        fill="currentColor"
      />
      <path
        d="M77.889 22.5895L74.7985 20.8056V24.3883L71.6895 26.1685V19.0253L68.6027 17.245V27.9123L65.4937 29.6962V15.3874L62.3293 13.548V28.3305L65.1162 29.959V59.8636L64.9645 59.9561L62.3293 58.4424V61.4921L59.1833 63.2724V56.5474L56.078 54.7079V65.0743L52.9875 66.9101V52.8681L49.8785 51.0324V68.6945L46.7325 70.4748V49.1932L43.6273 47.3537V72.2547L40.5183 74.1127V45.5172L39.0008 44.5105L39.06 14.8159L40.5183 15.7079V0.947497L38.8898 0L37.5795 0.736529V15.5562L34.4372 17.3364V2.57602L31.3283 4.35629V19.1199L28.2193 20.9186V6.1953L25.1325 7.97557V22.6989L21.968 24.4829V9.77771L18.8775 11.6135V26.2807L15.7685 28.1202V13.393L12.3005 15.4397V29.578L12.7743 29.8444L12.889 59.9528L15.7685 61.6405V58.2872L18.8775 56.4477V63.4799L21.968 65.2786V54.6082L25.1325 52.7132V67.0591L28.2193 68.8986V50.8772L31.3283 49.0377V70.6786L34.4372 72.481V47.1797L37.5795 45.3439V74.3168L39.0008 75.1533V75.0941V89.969L77.9445 67.477L78 22.5853L77.889 22.5895Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Add more SVG logo components here as needed
// Example:
// function AnotherSponsorLogo({ className = "", width = 100, height = 100, style }: SVGLogoProps) {
//   return (
//     <svg className={className} width={width} height={height} style={style} viewBox="0 0 100 100" fill="none">
//       <title>Another Sponsor logo</title>
//       <path d="..." fill="currentColor" />
//     </svg>
//   );
// }

/**
 * Registry mapping sponsor logo paths or names to their SVG components
 *
 * To add a new SVG sponsor:
 * 1. Create the SVG component above (e.g., AnotherSponsorLogo)
 * 2. Add an entry here mapping the logo path or sponsor name to the component
 *
 * You can match by:
 * - Logo path (e.g., "/shadcnblocks.svg")
 * - Sponsor name (e.g., "Shadcnblocks.com")
 * - Or both for flexibility
 */
export const SPONSOR_SVG_REGISTRY: Record<
  string,
  React.ComponentType<SVGLogoProps>
> = {
  // Match by logo path
  "/shadcnblocks.svg": ShadcnblocksLogo,
  // Match by sponsor name (alternative/additional way to match)
  "Shadcnblocks.com": ShadcnblocksLogo,
  // Add more entries as needed:
  // "/another-sponsor.svg": AnotherSponsorLogo,
  // "Another Sponsor": AnotherSponsorLogo,
};

/**
 * Get the SVG component for a sponsor if it exists in the registry
 */
export function getSponsorSVGComponent(
  logoPath: string,
  sponsorName: string
): React.ComponentType<SVGLogoProps> | null {
  // Try to match by logo path first
  if (SPONSOR_SVG_REGISTRY[logoPath]) {
    return SPONSOR_SVG_REGISTRY[logoPath];
  }
  // Fallback to sponsor name
  if (SPONSOR_SVG_REGISTRY[sponsorName]) {
    return SPONSOR_SVG_REGISTRY[sponsorName];
  }
  return null;
}

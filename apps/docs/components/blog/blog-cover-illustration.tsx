import type { BlogCoverKind } from "@docs/lib/blog-cover";
import {
  Check,
  Code2,
  Layers,
  MousePointer2,
  Palette,
  Share2,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";

const ink = "#29272c";
const muted = "#a3a0a8";
const emphasis = "#4b5563";
const inset = "#e5e7eb";
const paper = "#ffffff";

function Tile({
  x,
  y,
  width = 84,
  height = 62,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
}) {
  return (
    <rect
      fill={paper}
      height={height}
      rx="12"
      stroke="#d8d5dc"
      width={width}
      x={x}
      y={y}
    />
  );
}

function Illustration({ kind }: { kind: BlogCoverKind }) {
  switch (kind) {
    case "audit":
      return (
        <>
          <g opacity="0.45">
            <Tile x={27} y={34} width={104} height={105} />
            <path
              d="M44 57h70M44 76h70M44 95h70M44 114h70"
              stroke={muted}
              strokeWidth="5"
            />
          </g>
          <path
            d="m146 82 10 9-10 9"
            fill="none"
            stroke={emphasis}
            strokeWidth="3"
          />
          <Tile x={180} y={22} width={112} height={128} />
          <rect fill={inset} height="40" rx="7" width="84" x="194" y="36" />
          <Check color={emphasis} height={28} width={28} x={221} y={41} />
          <path
            d="M196 94h65M196 107h78M196 120h46"
            stroke={ink}
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      );
    case "libraries":
      return (
        <>
          <Tile x={18} y={45} />
          <Tile x={118} y={25} height={104} />
          <Tile x={218} y={45} />
          <Layers color={muted} x={44} y={62} width={32} height={32} />
          <Sparkles color={emphasis} x={143} y={46} width={34} height={34} />
          <Code2 color={muted} x={244} y={62} width={32} height={32} />
          <path
            d="M138 98h44M140 110h40"
            stroke={emphasis}
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      );
    case "tabs":
      return (
        <>
          <Tile x={25} y={40} width={270} height={99} />
          <rect fill="#f0eef2" height="36" rx="10" width="244" x="38" y="53" />
          <rect fill={ink} height="30" rx="8" width="78" x="119" y="56" />
          <path
            d="M52 71h44M136 71h43M219 71h44"
            stroke={muted}
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M52 108h104M52 120h160"
            stroke="#d8d5dc"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M94 29h114m-8-5 8 5-8 5"
            fill="none"
            stroke={emphasis}
            strokeWidth="2"
          />
        </>
      );
    case "magnetic":
      return (
        <>
          <ellipse
            cx="155"
            cy="86"
            fill="none"
            rx="108"
            ry="65"
            stroke={muted}
            strokeDasharray="4 7"
          />
          <ellipse
            cx="155"
            cy="86"
            fill="none"
            rx="80"
            ry="45"
            stroke="#d8d5dc"
          />
          <rect
            fill={ink}
            height="52"
            rx="15"
            transform="rotate(-6 173 82)"
            width="130"
            x="108"
            y="56"
          />
          <path
            d="M136 81h67"
            stroke="white"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <MousePointer2
            color={emphasis}
            fill={inset}
            height={42}
            width={42}
            x={214}
            y={98}
          />
          <path
            d="m213 108-18-13"
            stroke={emphasis}
            strokeDasharray="3 4"
            strokeWidth="2"
          />
        </>
      );
    case "numbers":
      return (
        <>
          <Tile x={39} y={32} width={242} height={112} />
          <g fill="none" stroke={ink} strokeLinecap="round" strokeWidth="7">
            <path d="M76 63v52M113 62h30v25h-30v28h30M185 62h30v25h-30zM185 87h30v28h-30z" />
          </g>
          <rect fill={inset} height="75" rx="8" width="49" x="174" y="51" />
          <g
            fill="none"
            stroke={emphasis}
            strokeLinecap="round"
            strokeWidth="7"
          >
            <path d="M185 62h30v25h-30zM215 87v28h-30" />
          </g>
          <path
            d="m245 75 7-7 7 7m-14 31 7 7 7-7"
            fill="none"
            stroke={muted}
            strokeWidth="2"
          />
        </>
      );
    case "popover":
      return (
        <>
          <rect fill="#eeeaf0" height="34" rx="12" width="112" x="32" y="115" />
          <path d="M48 132h70" stroke={muted} strokeWidth="4" />
          <Tile x={112} y={20} width={176} height={111} />
          <rect fill={inset} height="47" rx="7" width="150" x="125" y="33" />
          <path
            d="m130 72 30-24 28 18 26-14 51 24"
            fill="none"
            stroke={emphasis}
            strokeWidth="3"
          />
          <path
            d="M128 97h110M128 111h74"
            stroke={ink}
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path d="m159 131-14 14-3-14" fill="white" stroke="#d8d5dc" />
        </>
      );
    case "scramble":
      return (
        <>
          <Tile x={28} y={33} width={264} height={114} />
          <g stroke={muted} strokeWidth="3">
            <path d="m53 57 19 18m-19 0 19-18M91 57v20m-9-10h20M119 58h17v17h-17zM155 58l10 19 10-19M194 57v20m-8-13h17M226 57h19v20" />
          </g>
          <path
            d="M51 115h35m10 0h26m10 0h37m10 0h28m10 0h47"
            stroke={ink}
            strokeLinecap="round"
            strokeWidth="9"
          />
          <path d="M273 100v28" stroke={emphasis} strokeWidth="3" />
        </>
      );
    case "social":
      return (
        <>
          <Tile x={29} y={48} width={262} height={85} />
          <rect fill={ink} height="59" rx="13" width="75" x="121" y="61" />
          <Share2 color={muted} x={55} y={78} width={26} height={26} />
          <Share2 color="white" x={145} y={77} width={28} height={28} />
          <MousePointer2 color={muted} x={239} y={78} width={26} height={26} />
          <path
            d="M77 153h150m-7-5 7 5-7 5"
            fill="none"
            stroke={emphasis}
            strokeWidth="2"
          />
        </>
      );
    case "account":
      return (
        <>
          <circle cx="82" cy="69" fill={inset} r="34" />
          <UserRound color={emphasis} height={38} width={38} x={63} y={50} />
          <Tile x={119} y={28} width={170} height={125} />
          <circle cx="141" cy="51" fill={ink} r="8" />
          <path
            d="M159 48h96M159 58h57M137 84h130M156 103h70M156 127h83"
            stroke={muted}
            strokeLinecap="round"
            strokeWidth="4"
          />
          <UserRound color={ink} x={134} y={96} width={15} height={15} />
          <SlidersHorizontal
            color={ink}
            x={134}
            y={119}
            width={15}
            height={15}
          />
        </>
      );
    case "motion":
      return (
        <>
          <path
            d="M38 125C90 125 98 40 160 40s62 85 122 85"
            fill="none"
            stroke="#cac5d0"
            strokeWidth="3"
          />
          <path
            d="M38 125C90 125 98 40 160 40"
            fill="none"
            stroke={emphasis}
            strokeWidth="4"
          />
          <rect
            fill={paper}
            height="30"
            rx="8"
            stroke={muted}
            width="30"
            x="23"
            y="110"
          />
          <rect
            fill={emphasis}
            height="38"
            rx="11"
            transform="rotate(15 160 40)"
            width="38"
            x="141"
            y="21"
          />
          <rect
            fill={paper}
            height="30"
            rx="8"
            stroke={muted}
            width="30"
            x="267"
            y="110"
          />
          <path d="M53 157h211" stroke={muted} strokeDasharray="3 8" />
        </>
      );
    case "craft":
      return (
        <>
          <Tile x={59} y={26} width={202} height={132} />
          <Palette color={ink} height={64} width={64} x={85} y={47} />
          <Sparkles color={emphasis} height={33} width={33} x={204} y={44} />
          <path
            d="M171 98h62M86 130h145"
            stroke={muted}
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="178" cy="69" fill={emphasis} r="7" />
        </>
      );
    case "hover":
      return (
        <>
          <rect
            fill="#e7e3eb"
            height="94"
            rx="12"
            transform="rotate(-9 118 96)"
            width="123"
            x="40"
            y="49"
          />
          <rect
            fill={inset}
            height="94"
            rx="12"
            transform="rotate(8 213 86)"
            width="123"
            x="151"
            y="38"
          />
          <Tile x={98} y={29} width={126} height={112} />
          <Sparkles color={emphasis} height={40} width={40} x={141} y={61} />
          <MousePointer2
            color={ink}
            fill="white"
            height={39}
            width={39}
            x={208}
            y={121}
          />
        </>
      );
    case "shadcn":
      return (
        <>
          <Tile x={25} y={31} width={116} height={120} />
          <path
            d="m48 118 65-65m-20 69 28-28"
            fill="none"
            stroke={ink}
            strokeLinecap="round"
            strokeWidth="9"
          />
          <Tile x={164} y={30} width={126} height={46} />
          <Tile x={164} y={91} width={57} height={59} />
          <Tile x={233} y={91} width={57} height={59} />
          <path
            d="M181 53h69"
            stroke={emphasis}
            strokeLinecap="round"
            strokeWidth="5"
          />
          <circle cx="192" cy="120" fill={emphasis} r="10" />
          <path
            d="m247 125 10-14 12 14"
            fill="none"
            stroke={ink}
            strokeWidth="3"
          />
        </>
      );
    case "keyframes":
      return (
        <>
          <Tile x={24} y={33} width={273} height={117} />
          <path d="M47 113h225" stroke={muted} strokeWidth="2" />
          <path
            d="M55 107C107 107 103 56 156 56s53 51 108 51"
            fill="none"
            stroke={emphasis}
            strokeWidth="3"
          />
          <g fill={ink}>
            <path d="m54 105 8 8-8 8-8-8zM156 105l8 8-8 8-8-8zM264 105l8 8-8 8-8-8z" />
          </g>
          <path
            d="m48 61-10 9 10 9m216-18 10 9-10 9"
            fill="none"
            stroke={muted}
            strokeWidth="3"
          />
        </>
      );
    case "components":
      return (
        <>
          <Tile x={26} y={24} width={166} height={55} />
          <Tile x={208} y={24} width={85} height={55} />
          <Tile x={26} y={95} width={85} height={65} />
          <Tile x={127} y={95} width={166} height={65} />
          <rect fill={ink} height="23" rx="8" width="95" x="41" y="40" />
          <rect fill={inset} height="23" rx="12" width="45" x="228" y="40" />
          <circle cx="260" cy="51" fill={emphasis} r="8" />
          <path
            d="m47 128 14 12 26-27"
            fill="none"
            stroke={emphasis}
            strokeWidth="4"
          />
          <path
            d="M144 114h100M144 129h125M144 144h70"
            stroke={muted}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </>
      );
    default:
      return (
        <>
          <Tile x={80} y={25} width={160} height={130} />
          <Code2 color={emphasis} height={54} width={54} x={133} y={50} />
          <path
            d="M104 121h112M104 136h74"
            stroke={muted}
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      );
  }
}

export function BlogCoverIllustration({ kind }: { kind: BlogCoverKind }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="180"
      viewBox="0 0 320 180"
      width="320"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Illustration kind={kind} />
    </svg>
  );
}

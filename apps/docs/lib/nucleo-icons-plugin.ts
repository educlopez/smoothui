import {
  IconAccessibilityFill24,
  IconAiFill24,
  IconAlbumFill24,
  IconBag24Fill24,
  IconBellFill24,
  IconBoltFill24,
  IconBookBookmarkFill24,
  IconBrainFill24,
  IconCalendarFill24,
  IconChatBubblePlusFill24,
  IconCheckboxChecked2Fill24,
  IconChevronDownFill24,
  IconClock2Fill24,
  IconCodeFill24,
  IconCompass2Fill24,
  IconCopyFill24,
  IconCursor2Fill24,
  IconDotsLoaderFill24,
  IconDownloadFill24,
  IconDropletFill24,
  IconExpandFill24,
  IconFileFill24,
  IconGlobe2Fill24,
  IconGrid3Fill24,
  IconHashtagFill24,
  IconHeartFill24,
  IconImageFill24,
  IconImagesFill24,
  IconKeyFill24,
  IconLayersFill24,
  IconLetterAFill24,
  IconLightbulbFill24,
  IconListCheckFill24,
  IconMagnetFill24,
  IconMagnifierFill24,
  IconMessage2Fill24,
  IconPaletteFill24,
  IconPeople3Fill24,
  IconPopcornFill24,
  IconPowerLevelFill24,
  IconRefresh2Fill24,
  IconRocketFill24,
  IconShareLeft3Fill24,
  IconSidebarRightFill24,
  IconSliders2Fill24,
  IconSparkleFill24,
  IconStarFill24,
  IconSunFill24,
  IconSwapNodesFill24,
  IconTagFill24,
  IconToggleFill24,
  IconTriangleWarningFill24,
  IconTrophyFill24,
  IconUploadFill24,
  IconUserFill24,
  IconWaveformLinesFill24,
  IconWrenchFill24,
} from "nucleo-core-fill-24";
import { createElement } from "react";

type NucleoIcon = React.ComponentType<{ className?: string; size?: number }>;

const LUCIDE_TO_NUCLEO: Record<string, NucleoIcon> = {
  Accessibility: IconAccessibilityFill24,
  Album: IconAlbumFill24,
  ArrowRightLeft: IconSwapNodesFill24,
  BadgeDollarSign: IconBoltFill24,
  Bell: IconBellFill24,
  BookOpen: IconBookBookmarkFill24,
  Bot: IconAiFill24,
  Brain: IconBrainFill24,
  Briefcase: IconBag24Fill24,
  Calendar: IconCalendarFill24,
  ChevronDown: IconChevronDownFill24,
  CircleDot: IconDotsLoaderFill24,
  Code: IconCodeFill24,
  Copy: IconCopyFill24,
  Download: IconDownloadFill24,
  Droplets: IconDropletFill24,
  FileText: IconFileFill24,
  Globe: IconGlobe2Fill24,
  Grid3x3: IconGrid3Fill24,
  Hash: IconHashtagFill24,
  Heart: IconHeartFill24,
  History: IconClock2Fill24,
  Image: IconImageFill24,
  Images: IconImagesFill24,
  KeyRound: IconKeyFill24,
  Lightbulb: IconLightbulbFill24,
  ListOrdered: IconListCheckFill24,
  Loader: IconDotsLoaderFill24,
  Magnet: IconMagnetFill24,
  MessageSquare: IconMessage2Fill24,
  MessageSquarePlus: IconChatBubblePlusFill24,
  MousePointer: IconCursor2Fill24,
  MousePointerClick: IconCursor2Fill24,
  MoveHorizontal: IconExpandFill24,
  Navigation: IconCompass2Fill24,
  Palette: IconPaletteFill24,
  PanelLeft: IconSidebarRightFill24,
  Popcorn: IconPopcornFill24,
  Power: IconPowerLevelFill24,
  RectangleEllipsis: IconDotsLoaderFill24,
  RefreshCw: IconRefresh2Fill24,
  Rocket: IconRocketFill24,
  Search: IconMagnifierFill24,
  Share2: IconShareLeft3Fill24,
  ShoppingCart: IconBag24Fill24,
  SlidersHorizontal: IconSliders2Fill24,
  Sparkles: IconSparkleFill24,
  Square: IconExpandFill24,
  SquareCheck: IconCheckboxChecked2Fill24,
  SquareStack: IconLayersFill24,
  Star: IconStarFill24,
  SunMedium: IconSunFill24,
  Tag: IconTagFill24,
  TextSearch: IconMagnifierFill24,
  ToggleLeft: IconToggleFill24,
  Triangle: IconTriangleWarningFill24,
  Trophy: IconTrophyFill24,
  Type: IconLetterAFill24,
  Upload: IconUploadFill24,
  User: IconUserFill24,
  Users: IconPeople3Fill24,
  Waves: IconWaveformLinesFill24,
  Wrench: IconWrenchFill24,
  Zap: IconBoltFill24,
};

function resolveIcon(name: string | undefined): React.ReactElement | undefined {
  if (!name) {
    return;
  }
  const Icon = LUCIDE_TO_NUCLEO[name];
  if (!Icon) {
    console.warn(`[nucleo-icons-plugin] Unknown icon: ${name}`);
    return;
  }
  return createElement(Icon, { className: "size-4" });
}

function replaceIcon(node: Record<string, unknown>): Record<string, unknown> {
  if (node.icon === undefined || typeof node.icon === "string") {
    node.icon = resolveIcon(node.icon as string | undefined);
  }
  return node;
}

export function nucleoIconsPlugin() {
  return {
    name: "smoothui:nucleo-icons",
    // biome-ignore lint/suspicious/noExplicitAny: matches fumadocs internal LoaderPlugin shape
    transformPageTree: {
      file: replaceIcon,
      folder: replaceIcon,
      separator: replaceIcon,
    },
  } as unknown as import("fumadocs-core/source").LoaderPlugin;
}

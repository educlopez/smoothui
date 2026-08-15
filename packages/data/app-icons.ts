/**
 * macOS application icons, for any demo that shows a row of apps — the dock
 * above all. Real icons rather than invented squares, because a dock only reads
 * as a dock when the icons are ones you recognise.
 *
 * Served from ImageKit at 512px; request the size you render, keeping PNG so the
 * rounded corners stay transparent: \`?tr=w-128\`.
 *
 * These are Apple’s marks, used here to illustrate the components. Fine for
 * demos on our own site; think twice before making one a shipped default in a
 * component the registry distributes.
 */

export interface AppIcon {
  /** Slug, and the filename. Stable — safe to use as a React key. */
  id: string;
  name: string;
  src: string;
}

export const appIcons: AppIcon[] = [
  {
    id: "activity-monitor",
    name: "Activity Monitor",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/activity-monitor.png",
  },
  {
    id: "airport-utility",
    name: "Airport Utility",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/airport-utility.png",
  },
  {
    id: "app-store",
    name: "App Store",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/app-store.png",
  },
  {
    id: "apple-configurator",
    name: "Apple Configurator",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/apple-configurator.png",
  },
  {
    id: "apple-developer",
    name: "Apple Developer",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/apple-developer.png",
  },
  {
    id: "apple-remote-desktop",
    name: "Apple Remote Desktop",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/apple-remote-desktop.png",
  },
  {
    id: "audio-midi-setup",
    name: "Audio MIDI Setup",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/audio-midi-setup.png",
  },
  {
    id: "automator",
    name: "Automator",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/automator.png",
  },
  {
    id: "bluetooth-file-exchange",
    name: "Bluetooth File Exchange",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/bluetooth-file-exchange.png",
  },
  {
    id: "books",
    name: "Books",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/books.png",
  },
  {
    id: "calculator",
    name: "Calculator",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/calculator.png",
  },
  {
    id: "calendar",
    name: "Calendar",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/calendar.png",
  },
  {
    id: "chess",
    name: "Chess",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/chess.png",
  },
  {
    id: "clock",
    name: "Clock",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/clock.png",
  },
  {
    id: "colorsync-utility",
    name: "ColorSync Utility",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/colorsync-utility.png",
  },
  {
    id: "compressor-encode-media",
    name: "Compressor",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/compressor-encode-media.png",
  },
  {
    id: "console",
    name: "Console",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/console.png",
  },
  {
    id: "contacts",
    name: "Contacts",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/contacts.png",
  },
  {
    id: "dictionary",
    name: "Dictionary",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/dictionary.png",
  },
  {
    id: "digital-color-meter",
    name: "Digital Color Meter",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/digital-color-meter.png",
  },
  {
    id: "disk-utility",
    name: "Disk Utility",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/disk-utility.png",
  },
  {
    id: "facetime",
    name: "FaceTime",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/facetime.png",
  },
  {
    id: "final-cut-pro-create-video",
    name: "Final Cut Pro",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/final-cut-pro-create-video.png",
  },
  {
    id: "find-my",
    name: "Find My",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/find-my.png",
  },
  {
    id: "grapher",
    name: "Grapher",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/grapher.png",
  },
  {
    id: "imovie",
    name: "iMovie",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/imovie.png",
  },
  {
    id: "keynote-design-presentations",
    name: "Keynote",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/keynote-design-presentations.png",
  },
  {
    id: "logic-pro-make-music",
    name: "Logic Pro",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/logic-pro-make-music.png",
  },
  {
    id: "mainstage-perform-live",
    name: "MainStage",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/mainstage-perform-live.png",
  },
  {
    id: "mainstage",
    name: "Mainstage",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/mainstage.png",
  },
  {
    id: "migration-assistant",
    name: "Migration Assistant",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/migration-assistant.png",
  },
  {
    id: "motion-animate-effects",
    name: "Motion",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/motion-animate-effects.png",
  },
  {
    id: "numbers-make-spreadsheets",
    name: "Numbers",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/numbers-make-spreadsheets.png",
  },
  {
    id: "pages-create-documents",
    name: "Pages",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/pages-create-documents.png",
  },
  {
    id: "photos",
    name: "Photos",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/photos.png",
  },
  {
    id: "pixelmator-pro-edit-images",
    name: "Pixelmator Pro",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/pixelmator-pro-edit-images.png",
  },
  {
    id: "podcasts",
    name: "Podcasts",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/podcasts.png",
  },
  {
    id: "preview",
    name: "Preview",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/preview.png",
  },
  {
    id: "print-center",
    name: "Print Center",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/print-center.png",
  },
  {
    id: "quicktime",
    name: "QuickTime Player",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/quicktime.png",
  },
  {
    id: "reminders",
    name: "Reminders",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/reminders.png",
  },
  {
    id: "safari",
    name: "Safari",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/safari.png",
  },
  {
    id: "screen-sharing",
    name: "Screen Sharing",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/screen-sharing.png",
  },
  {
    id: "screenshot",
    name: "Screenshot",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/screenshot.png",
  },
  {
    id: "script-editor",
    name: "Script Editor",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/script-editor.png",
  },
  {
    id: "shortcuts",
    name: "Shortcuts",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/shortcuts.png",
  },
  {
    id: "siri",
    name: "Siri",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/siri.png",
  },
  {
    id: "stickies",
    name: "Stickies",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/stickies.png",
  },
  {
    id: "stocks",
    name: "Stocks",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/stocks.png",
  },
  {
    id: "system-information",
    name: "System Information",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/system-information.png",
  },
  {
    id: "system-settings",
    name: "System Settings",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/system-settings.png",
  },
  {
    id: "terminal",
    name: "Terminal",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/terminal.png",
  },
  {
    id: "testflight",
    name: "TestFlight",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/testflight.png",
  },
  {
    id: "textedit",
    name: "TextEdit",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/textedit.png",
  },
  {
    id: "time-machine",
    name: "Time Machine",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/time-machine.png",
  },
  {
    id: "tips",
    name: "Tips",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/tips.png",
  },
  {
    id: "voice-memos",
    name: "Voice Memos",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/voice-memos.png",
  },
  {
    id: "voiceover-utility",
    name: "VoiceOver Utility",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/voiceover-utility.png",
  },
  {
    id: "weather",
    name: "Weather",
    src: "https://ik.imagekit.io/16u211libb/smoothui/app-icons/weather.png",
  },
];

export const appIconById = (id: string): AppIcon | undefined =>
  appIcons.find((icon) => icon.id === id);

/** The dock cast: recognisable, and in the order macOS ships them. */
export const dockIcons: AppIcon[] = [
  "safari",
  "photos",
  "podcasts",
  "calendar",
  "contacts",
  "reminders",
  "facetime",
  "app-store",
  "system-settings",
]
  .map((id) => appIconById(id))
  .filter((icon): icon is AppIcon => icon !== undefined);

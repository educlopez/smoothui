import { LibraryIcon } from "lucide-react";
import Image from "next/image";

interface PoweredByProps {
  packages: string[];
}

const getHostname = (url: string) => {
  if (url.startsWith("/")) {
    return new URL(url, "https://smoothui.dev").hostname.replace("www.", "");
  }

  // Handle invalid URLs gracefully
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace("www.", "");
  } catch {
    // If it's not a valid URL, return the string as-is
    return url;
  }
};

const getPackageName = (url: string) => {
  if (url.startsWith("/")) {
    return url.replace("/components/", "");
  }

  // Handle invalid URLs gracefully
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    // If it's not a valid URL, return the string as-is
    return url;
  }
};

export const PoweredBy = ({ packages }: PoweredByProps) => (
  <div className="not-prose mt-6 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <LibraryIcon className="size-4 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">Powered by</p>
    </div>
    <div className="flex flex-col gap-2 pl-[14px]">
      {packages.map((url) => {
        const isValidUrl = url.startsWith("http") || url.startsWith("/");
        const hostname = getHostname(url);
        const packageName = getPackageName(url);

        return (
          <div
            className="inline-flex items-center gap-1.5 text-muted-foreground text-sm"
            key={url}
          >
            <Image
              alt=""
              className="h-3.5 w-3.5 overflow-hidden rounded-sm object-cover"
              height={14}
              src={`https://img.logo.dev/${hostname}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&size=14&retina=true`}
              width={14}
            />
            {isValidUrl ? (
              <a
                className="transition-all hover:text-primary"
                href={url}
                rel="noopener"
                target="_blank"
              >
                {packageName}
              </a>
            ) : (
              <span>{packageName}</span>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

import type { ContributorInfo } from "@docs/lib/git-contributor";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/shadcn-ui/components/ui/tooltip";
import { GitBranch, UserIcon } from "lucide-react";
import Image from "next/image";

type ContributorProps = {
  creator: {
    name: string;
    url?: string;
    avatar?: string;
  };
  contributors?: ContributorInfo[];
};

export const Contributor = ({
  creator,
  contributors = [],
}: ContributorProps) => {
  const otherContributors = contributors.filter((c) => c.name !== creator.name);

  return (
    <div className="not-prose mt-6 flex flex-col gap-2">
      {/* Created by section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <UserIcon className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Created by</p>
        </div>
        <div className="pl-[14px]">
          {/* Creator - more prominent */}
          {creator.url ? (
            <a
              className="flex items-center gap-2"
              href={creator.url}
              rel="noopener"
              target="_blank"
            >
              {creator.avatar ? (
                <div className="relative h-6 w-6 overflow-hidden rounded-full border border-border">
                  <Image
                    alt={`${creator.name}'s avatar`}
                    className="object-cover"
                    height={24}
                    src={creator.avatar}
                    width={24}
                  />
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                  <UserIcon className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <span className="font-normal text-muted-foreground text-sm">
                {creator.name}
              </span>
            </a>
          ) : (
            <div className="flex items-center gap-2">
              {creator.avatar ? (
                <div className="relative h-6 w-6 overflow-hidden rounded-full border border-border">
                  <Image
                    alt={`${creator.name}'s avatar`}
                    className="object-cover"
                    height={24}
                    src={creator.avatar}
                    width={24}
                  />
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                  <UserIcon className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <span className="font-light text-muted-foreground text-sm">
                {creator.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Improved by section - separate */}
      {otherContributors.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="size-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Improved by</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 pl-[14px]">
            {otherContributors.map((contributor, index) => (
              <Tooltip key={`${contributor.email}-${index}`}>
                <TooltipTrigger asChild>
                  {contributor.url ? (
                    <a
                      className="relative h-6 w-6 overflow-hidden rounded-full border border-border transition-transform hover:z-10 hover:scale-110"
                      href={contributor.url}
                      rel="noopener"
                      style={{
                        marginLeft: index > 0 ? "-4px" : "0",
                        zIndex: otherContributors.length - index,
                      }}
                      target="_blank"
                    >
                      {contributor.avatar ? (
                        <Image
                          alt={`${contributor.name}'s avatar`}
                          className="object-cover"
                          height={24}
                          src={contributor.avatar}
                          width={24}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <UserIcon className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </a>
                  ) : (
                    <div
                      className="relative h-6 w-6 overflow-hidden rounded-full border border-border transition-transform hover:z-10 hover:scale-110"
                      style={{
                        marginLeft: index > 0 ? "-4px" : "0",
                        zIndex: otherContributors.length - index,
                      }}
                    >
                      {contributor.avatar ? (
                        <Image
                          alt={`${contributor.name}'s avatar`}
                          className="object-cover"
                          height={24}
                          src={contributor.avatar}
                          width={24}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <UserIcon className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{contributor.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

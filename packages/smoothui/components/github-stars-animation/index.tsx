"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Star } from "lucide-react";
import { motion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const TRANSITION_DURATION = 0.3;
const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;
const COUNTDOWN_DURATION = 2000;
const AVATAR_COUNT = 5;
const STAGGER_DELAY = 0.05;

export type Stargazer = {
  login: string;
  avatar_url: string;
  html_url: string;
};

export type GitHubStarsAnimationProps = {
  owner?: string;
  repo?: string;
  stargazers?: Stargazer[];
  starCount?: number;
  apiEndpoint?: string;
  className?: string;
  avatarClassName?: string;
  countClassName?: string;
  showAvatars?: boolean;
  maxAvatars?: number;
};

export default function GitHubStarsAnimation({
  owner = "educlopez",
  repo = "smoothui",
  stargazers: providedStargazers,
  starCount: providedStarCount,
  apiEndpoint,
  className = "",
  avatarClassName = "",
  countClassName = "",
  showAvatars = true,
  maxAvatars = AVATAR_COUNT,
}: GitHubStarsAnimationProps) {
  const [stargazers, setStargazers] = useState<Stargazer[]>(
    providedStargazers || []
  );
  const [starCount, setStarCount] = useState(providedStarCount || 0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(!providedStargazers);
  const [error, setError] = useState(false);

  const countSpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });

  // Fetch stargazers and star count
  useEffect(() => {
    if (providedStargazers && providedStarCount !== undefined) {
      setStargazers(providedStargazers);
      setStarCount(providedStarCount);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(false);

        // Try to fetch from custom API endpoint first
        if (apiEndpoint) {
          const response = await fetch(
            `${apiEndpoint}?owner=${owner}&repo=${repo}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.stargazers) {
              setStargazers(data.stargazers.slice(0, maxAvatars));
            }
            if (data.stars !== undefined) {
              setStarCount(data.stars);
            }
            setIsLoading(false);
            return;
          }
        }

        // Fallback to GitHub API directly (client-side)
        // Note: This has rate limits, so using a token is recommended
        const headers: HeadersInit = {
          Accept: "application/vnd.github.v3+json",
        };

        // Fetch repo info for star count
        try {
          const repoResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            { headers }
          );

          if (repoResponse.ok) {
            const repoData = await repoResponse.json();
            setStarCount(repoData.stargazers_count || 0);
          }
        } catch {
          // Silently fail for star count
        }

        // Fetch stargazers
        try {
          const stargazersResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/stargazers?per_page=${maxAvatars}`,
            { headers }
          );

          if (stargazersResponse.ok) {
            const stargazersData =
              (await stargazersResponse.json()) as Stargazer[];
            setStargazers(stargazersData.slice(0, maxAvatars));
          }
        } catch {
          // Silently fail for stargazers
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    owner,
    repo,
    apiEndpoint,
    maxAvatars,
    providedStargazers,
    providedStarCount,
  ]);

  // Animate countdown
  useEffect(() => {
    if (starCount === 0) {
      return;
    }

    const startTime = Date.now();
    const startValue = 0;
    const endValue = starCount;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / COUNTDOWN_DURATION, 1);

      // Ease-out function
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.floor(startValue + (endValue - startValue) * eased);

      setDisplayCount(current);
      countSpring.set(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayCount(endValue);
        countSpring.set(endValue);
      }
    };

    animate();
  }, [starCount, countSpring]);

  if (isLoading) {
    return (
      <div
        className={cn("flex items-center gap-3 text-foreground/60", className)}
      >
        <div className="h-10 w-10 animate-pulse rounded-full bg-foreground/20" />
        <div className="h-6 w-20 animate-pulse rounded bg-foreground/20" />
      </div>
    );
  }

  if (error && starCount === 0) {
    return null;
  }

  const visibleAvatars = stargazers.slice(0, maxAvatars);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Avatars */}
      {showAvatars && visibleAvatars.length > 0 && (
        <div className="relative flex items-center">
          {visibleAvatars.map((stargazer, index) => (
            <motion.a
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              aria-label={`${stargazer.login}'s GitHub profile`}
              className={cn(
                "relative z-10 h-10 w-10 overflow-hidden rounded-full border-2 border-background bg-background transition-transform hover:z-20 hover:scale-110",
                avatarClassName
              )}
              href={stargazer.html_url}
              initial={{
                opacity: 0,
                scale: 0.8,
                x: -20,
              }}
              key={stargazer.login}
              rel="noopener noreferrer"
              style={{
                marginLeft: index > 0 ? "-8px" : "0",
              }}
              target="_blank"
              transition={{
                duration: TRANSITION_DURATION,
                delay: index * STAGGER_DELAY,
                ease: EASE_OUT_CUBIC,
              }}
              whileHover={{ scale: 1.1, zIndex: 20 }}
            >
              {/* biome-ignore lint/performance/noImgElement: Using img for user avatars without Next.js Image optimizations */}
              <img
                alt={`${stargazer.login}'s avatar`}
                className="h-full w-full object-cover"
                src={stargazer.avatar_url}
              />
            </motion.a>
          ))}
        </div>
      )}

      {/* Star count */}
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className={cn("flex items-center gap-1.5 font-medium", countClassName)}
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        transition={{
          duration: TRANSITION_DURATION,
          ease: EASE_OUT_CUBIC,
        }}
      >
        <Star className="h-4 w-4 fill-current" />
        <motion.span
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.3,
            ease: EASE_OUT_CUBIC,
          }}
          className="tabular-nums"
        >
          {displayCount.toLocaleString()}
        </motion.span>
        <span className="text-foreground/70 text-sm">
          {displayCount === 1 ? "star" : "stars"}
        </span>
      </motion.div>

      {/* Reduced motion fallback */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: opacity 0.2s ease !important;
            }
          }
        `}
      </style>
    </div>
  );
}





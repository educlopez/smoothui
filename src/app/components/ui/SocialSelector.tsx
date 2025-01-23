"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { BskyIcon } from "@/app/components/resources/iconssocial/bsky"
import { ThreadsIcon } from "@/app/components/resources/iconssocial/threads"
import { XIcon } from "@/app/components/resources/iconssocial/x"

interface Platform {
  name: string
  domain: string
  icon: React.ReactNode
  url: string
}

const platforms: Platform[] = [
  {
    name: "X",
    domain: "x.com",
    icon: <XIcon className="h-5 w-5" />,
    url: "https://x.com/educalvolpz",
  },
  {
    name: "Bluesky",
    domain: "bsky.app",
    icon: <BskyIcon className="h-5 w-5" />,
    url: "https://bsky.app/profile/educalvolpz.bsky.social",
  },
  {
    name: "Threads",
    domain: "threads.net",
    icon: <ThreadsIcon className="h-5 w-5" />,
    url: "https://threads.net/@educalvolpz",
  },
]

export default function SocialSelector() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(
    platforms[0]
  )
  const handle = "educalvolpz"

  return (
    <div className="mx-auto my-4 w-full max-w-2xl text-center">
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative flex w-fit items-center justify-center gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => setSelectedPlatform(platform)}
                className={`relative z-10 cursor-pointer rounded-full p-2 transition-colors ${
                  selectedPlatform.name === platform.name
                    ? "fill-white"
                    : "fill-zinc-400 hover:bg-zinc-800/50 hover:fill-white dark:fill-zinc-500"
                }`}
                aria-label={`Select ${platform.name} platform`}
              >
                {platform.icon}
                <span className="sr-only">{platform.name}</span>
              </button>
            ))}
            <motion.div
              layoutId="background"
              className="absolute inset-0 z-0 h-9 w-9 rounded-full bg-zinc-800 dark:bg-zinc-950"
              initial={false}
              animate={{
                x:
                  platforms.findIndex((p) => p.name === selectedPlatform.name) *
                  (36 + 16),
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          </div>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          Updates on{" "}
          <span className="font-medium text-zinc-500 dark:text-zinc-300">
            <motion.a
              key={selectedPlatform.domain}
              initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
              transition={{ duration: 0.3 }}
              href={selectedPlatform.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedPlatform.domain}
            </motion.a>
          </span>
          <br />
          <a
            href={selectedPlatform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-950 dark:text-zinc-50"
          >
            @{handle}
          </a>
        </p>
      </div>
    </div>
  )
}

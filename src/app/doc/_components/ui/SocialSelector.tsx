"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { BskyIcon } from "@/app/doc/_components/resources/iconssocial/bsky"
import { ThreadsIcon } from "@/app/doc/_components/resources/iconssocial/threads"
import { XIcon } from "@/app/doc/_components/resources/iconssocial/x"

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
                    : "fill-light-800 hover:bg-dark-400/50 dark:fill-dark-800 hover:fill-white"
                }`}
                aria-label={`Select ${platform.name} platform`}
              >
                {platform.icon}
                <span className="sr-only">{platform.name}</span>
              </button>
            ))}
            <motion.div
              layoutId="background"
              className="bg-light-950 dark:bg-dark-50 absolute inset-0 z-0 h-9 w-9 rounded-full"
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
        <p className="text-light-900 dark:text-dark-900 text-md">
          Updates on{" "}
          <span className="text-light-900 dark:text-dark-900 font-medium">
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
            className="text-light-950 dark:text-dark-950 font-medium"
          >
            @{handle}
          </a>
        </p>
      </div>
    </div>
  )
}

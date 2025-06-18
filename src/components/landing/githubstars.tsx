import Link from "next/link"
import { Github } from "lucide-react"

import { Button } from "@/components/button"

import AnimatedNumber from "./animated-number"

async function getRepoStarCount() {
  const headers: HeadersInit = {}
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`
  }

  const res = await fetch("https://api.github.com/repos/educlopez/smoothui", {
    headers,
  })
  const data = await res.json()

  if (data.stargazers_count === undefined) {
    return 0
  }

  return data.stargazers_count
}

export default async function GithubStars() {
  const starCount = await getRepoStarCount()
  return (
    <Button variant="ghost" asChild>
      <Link
        href="https://github.com/educlopez/smoothui"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github className="size-4" /> <AnimatedNumber value={starCount} />
      </Link>
    </Button>
  )
}

import Link from "next/link"

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

export async function GithubStars() {
  const starCount = await getRepoStarCount()
  return (
    <Link
      href="https://github.com/educlopez/smoothui"
      target="_blank"
      rel="noopener noreferrer"
    >
      <AnimatedNumber value={starCount} />
    </Link>
  )
}

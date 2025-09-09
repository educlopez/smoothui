import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

type Breadcrumbs = {
  category?: string
  groupName: string
  backLink?: string
  currentPage: string
  showHome?: boolean
  tag?: string
}

export function Breadcrumbs({
  category,
  groupName,
  backLink,
  currentPage,
  showHome = true,
  tag,
}: Breadcrumbs) {
  return (
    <nav className="flex items-center gap-1" aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link
            href="/"
            className="text-primary-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm font-medium duration-200"
            aria-label="Home"
          >
            <Home size={14} />
          </Link>
          <ChevronRight size={14} />
        </>
      )}

      {category && (
        <>
          <span className="flex w-fit items-center gap-1 text-sm font-medium">
            {category}
          </span>
          <ChevronRight size={14} />
        </>
      )}

      {backLink ? (
        <Link
          href={backLink}
          className="text-primary-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm font-medium duration-200"
        >
          {groupName}
        </Link>
      ) : (
        <span className="flex w-fit items-center gap-1 text-sm font-medium">
          {groupName}
        </span>
      )}

      {/* Tag link */}
      {tag && (
        <>
          <ChevronRight size={14} />
          <Link
            href={`/doc/tags/${tag.toLowerCase()}`}
            className="text-primary-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm font-medium duration-200"
          >
            {tag}
          </Link>
        </>
      )}

      <ChevronRight size={14} />
      <span className="text-foreground text-sm font-medium" aria-current="page">
        {currentPage}
      </span>
    </nav>
  )
}

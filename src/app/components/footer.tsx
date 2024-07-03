import { Pizza } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mb-10 flex flex-col items-center justify-center gap-4 py-10">
      <p className="text-center text-sm text-light11 transition dark:text-dark11">
        Made with <Pizza size={14} className="inline" /> by{" "}
        <a
          href="https://x.com/educlopez93"
          aria-label="X Profile Eduardo Calvo"
          target="_blank"
          className="text-light12 transition dark:text-dark12"
        >
          Eduardo Calvo
        </a>
      </p>
    </footer>
  )
}

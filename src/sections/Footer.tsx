import { profile } from '@/data/content'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-primary/90 py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:px-8 md:text-left">
        <p className="font-mono text-xs text-text-muted">
          © 2026 Tirth Patel — Built with React + Vite + Tailwind
        </p>
        <div className="flex gap-6">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-text-muted transition-colors hover:text-accent-secondary"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-text-muted transition-colors hover:text-accent-secondary"
          >
            LinkedIn
          </a>
          <a
            href="#top"
            className="text-xs text-text-muted transition-colors hover:text-accent-secondary"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}

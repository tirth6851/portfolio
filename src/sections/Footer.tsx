import { profile } from '@/data/content'

export function Footer() {
  return (
    <footer className="border-t border-accent-primary bg-bg-primary/75 py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:px-8 md:text-left">
        <p className="text-sm text-text-muted">© 2026 Tirth Patel. All rights reserved.</p>
        <div className="flex gap-6">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-text-secondary transition-colors hover:text-accent-secondary"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-text-secondary transition-colors hover:text-accent-secondary"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}

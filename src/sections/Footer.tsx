export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="wrap mono-label flex flex-wrap justify-between gap-3 text-[0.66rem] text-ink-soft">
        <span>© {new Date().getFullYear()} Tirth Patel</span>
        <span>Built with React, three.js, and Tailwind CSS</span>
      </div>
    </footer>
  )
}

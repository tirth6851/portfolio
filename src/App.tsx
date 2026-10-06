import { useState } from 'react'
import { architectures } from '@/data/architectures'
import { SiteHeader } from '@/components/SiteHeader'
import { Hero } from '@/sections/Hero'
import { Systems } from '@/sections/Systems'
import { Work } from '@/sections/Work'
import { About } from '@/sections/About'
import { Experience } from '@/sections/Experience'
import { Stack } from '@/sections/Stack'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'

export default function App() {
  const [graphId, setGraphId] = useState(architectures[0].id)

  const viewArchitecture = (id: string) => {
    setGraphId(id)
    document.getElementById('systems')?.scrollIntoView()
    document.getElementById(`tab-${id}`)?.focus({ preventScroll: true })
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Systems graphId={graphId} onGraphChange={setGraphId} />
        <Work onViewArchitecture={viewArchitecture} />
        <About />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

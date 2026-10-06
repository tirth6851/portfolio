import { MotionConfig } from 'motion/react'
import { SiteHeader } from '@/components/SiteHeader'
import { CursorGlow } from '@/components/CursorGlow'
import { Hero } from '@/sections/Hero'
import { ProjectStage } from '@/sections/ProjectStage'
import { AlsoBuilt } from '@/sections/AlsoBuilt'
import { About } from '@/sections/About'
import { Experience } from '@/sections/Experience'
import { Stack } from '@/sections/Stack'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <CursorGlow />
      <SiteHeader />
      <main id="main">
        <Hero />
        <ProjectStage />
        <AlsoBuilt />
        <About />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}

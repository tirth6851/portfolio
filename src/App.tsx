import { lazy, Suspense } from 'react'
import { LiquidGlassFilter } from '@/components/LiquidGlassFilter'
import { ScrollProgressBar } from '@/components/ScrollProgressBar'
import { BackToTop } from '@/components/BackToTop'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Highlights } from '@/sections/Highlights'
import { Projects } from '@/sections/Projects'
import { Experience } from '@/sections/Experience'
import { Skills } from '@/sections/Skills'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'

// three.js is heavy — load the shader background after the main bundle.
const ShaderBackground = lazy(() =>
  import('@/components/ShaderBackground').then((m) => ({ default: m.ShaderBackground })),
)

export default function App() {
  return (
    <>
      <LiquidGlassFilter />
      <Suspense fallback={null}>
        <ShaderBackground />
      </Suspense>
      <ScrollProgressBar />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Highlights />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  )
}

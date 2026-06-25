import { HeroSection } from '@/sections/HeroSection';
import { MarqueeSection } from '@/sections/MarqueeSection';
import { AboutSection } from '@/sections/AboutSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { ProjectsSection } from '@/sections/ProjectsSection';

export default function App() {
  return (
    <div style={{ backgroundColor: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </div>
  );
}

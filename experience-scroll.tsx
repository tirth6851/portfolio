"use client"
import { ContainerScroll, ContainerSticky, ContainerAnimated } from "@/components/ui/animated-video-on-scroll"

export const ExperienceScroll = () => {
  return (
    <ContainerScroll className="h-[300vh]">
      <ContainerSticky className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-20 text-center text-5xl font-bold text-emerald-500">Professional Journey</h2>
          
          <div className="relative space-y-24">
            {/* Item 1: Settles more on the RIGHT */}
            <ContainerAnimated 
              inputRange={[0.1, 0.4]} 
              outputRange={[0, 0]} 
              style={{ x: "10%" }} 
              className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h3 className="text-xl font-bold">STEM Peer Teacher</h3>
              <p className="text-emerald-400">Cleveland State University</p>
              <p className="mt-2 text-sm text-gray-400">Leading student sessions in Precalculus with a focus on problem-solving logic.</p>
            </ContainerAnimated>

            {/* Item 2: Settles more on the LEFT */}
            <ContainerAnimated 
              inputRange={[0.3, 0.6]} 
              outputRange={[0, 0]} 
              style={{ x: "-10%" }} 
              className="ml-auto w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h3 className="text-xl font-bold">Operations Assistant</h3>
              <p className="text-emerald-400">CENTERS, LLC</p>
              <p className="mt-2 text-sm text-gray-400">Managing facility logistics and ensuring safety protocols are met.</p>
            </ContainerAnimated>

            {/* Item 3: Settles DEAD CENTER */}
            <ContainerAnimated 
              inputRange={[0.5, 0.9]} 
              outputRange={[0, 0]} 
              className="mx-auto w-full max-w-md rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center backdrop-blur-md"
            >
              <h3 className="text-xl font-bold">Leadership Roles</h3>
              <p className="text-emerald-400">OpSTEM Representative</p>
              <p className="mt-2 text-sm text-gray-400">Coordinating events and fostering engagement within the STEM community.</p>
            </ContainerAnimated>
          </div>
        </div>
      </ContainerSticky>
    </ContainerScroll>
  )
}
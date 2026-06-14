"use client"

import * as React from "react"
import {
  HTMLMotionProps,
  MotionValue,
  Variants,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}
interface ContainerInsetProps extends HTMLMotionProps<"div"> {
  insetYRange?: [number, number]
  insetXRange?: [number, number]
  roundednessRange?: [number, number]
}

// This config creates that "Physical" feel - heavy but smooth
const SPRING_TRANSITION_CONFIG = {
  type: "spring",
  stiffness: 100,
  damping: 20, // Increased damping for a "clean settle"
  mass: 1,
  restDelta: 0.005,
}

const variants: Variants = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
  },
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) {
    throw new Error("useContainerScrollContext must be used within a ContainerScroll")
  }
  return context
}

export const ContainerScroll: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  })

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div ref={scrollRef} className={cn("relative min-h-svh w-full", className)} {...props}>
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

export const ContainerAnimated = React.forwardRef<HTMLDivElement, { inputRange?: number[], outputRange?: number[] } & HTMLMotionProps<"div">>(
  ({ className, transition, style, inputRange = [0.2, 0.8], outputRange = [80, 0], ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext()
    const y = useTransform(scrollYProgress, inputRange, outputRange)
    return (
      <motion.div
        ref={ref}
        className={cn("", className)}
        variants={variants}
        initial="hidden"
        whileInView={"visible"}
        viewport={{ once: true }}
        style={{ y, ...style }}
        transition={{ ...SPRING_TRANSITION_CONFIG, ...transition }}
        {...props}
      />
    )
  }
)

export const ContainerSticky = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("sticky left-0 top-0 flex min-h-svh w-full flex-col justify-center overflow-hidden", className)} {...props} />
  )
)

export const HeroVideo = React.forwardRef<HTMLVideoElement, HTMLMotionProps<"video">>(
  ({ style, className, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext()
    const scale = useTransform(scrollYProgress, [0, 0.8], [0.8, 1])

    return (
      <motion.video
        ref={ref}
        className={cn("relative z-10 size-auto max-h-full max-w-full rounded-2xl shadow-2xl", className)}
        autoPlay muted loop playsInline
        style={{ scale, ...style }}
        {...props}
      />
    )
  }
)

export const ContainerInset = React.forwardRef<HTMLDivElement, ContainerInsetProps>(
  ({ className, style, insetYRange = [20, 0], insetXRange = [20, 0], roundednessRange = [100, 24], ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext()
    const insetY = useTransform(scrollYProgress, [0, 0.8], insetYRange)
    const insetX = useTransform(scrollYProgress, [0, 0.8], insetXRange)
    const roundedness = useTransform(scrollYProgress, [0, 1], roundednessRange)
    const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`

    return (
      <motion.div ref={ref} className={cn("relative overflow-hidden", className)} style={{ clipPath, ...style }} {...props} />
    )
  }
)

export const HeroButton = React.forwardRef<HTMLButtonElement, HTMLMotionProps<"button">>(
  ({ className, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn("rounded-full bg-emerald-500 px-8 py-3 font-bold text-white shadow-lg transition-colors hover:bg-emerald-600", className)}
      {...props}
    />
  )
)
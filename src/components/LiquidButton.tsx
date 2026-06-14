import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LiquidButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
}

/** Liquid-glass anchor button. Keeps the .liquid-button class + fallback styling. */
export function LiquidButton({ children, className, ...props }: LiquidButtonProps) {
  return (
    <a className={cn('liquid-button', className)} {...props}>
      {children}
    </a>
  )
}

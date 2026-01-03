import { ReactNode } from 'react'
import { PixelParticles } from '@/components/pixel-particles'

interface PageHeaderProps {
  title: ReactNode
  description: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 via-transparent to-[#7C3AED]/5" />
      
      {/* Pixel particles effect */}
      <PixelParticles />

      {/* Content */}
      <div className="container relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="max-w-2xl">
          {/* Headline */}
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base text-muted-foreground md:text-lg">
            {description}
          </p>

          {/* Optional children (e.g., filters, nav) */}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </section>
  )
}

// Helper component for emphasized text
export function Emphasis({ children }: { children: ReactNode }) {
  return <span className="text-gradient">{children}</span>
}

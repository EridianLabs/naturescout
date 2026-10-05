import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface CardProps {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

export function Card({ children, className = '', href, onClick }: CardProps) {
  const classes = `rounded-2xl bg-white shadow-card border border-forest/5 ${className}`

  if (href) {
    return (
      <Link to={href} className={`${classes} block transition-transform hover:-translate-y-0.5 active:scale-[0.99]`}>
        {children}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${classes} w-full text-left transition-transform active:scale-[0.99]`}>
        {children}
      </button>
    )
  }

  return <div className={classes}>{children}</div>
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-moss">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-xl text-forest md:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function Pill({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'gold' | 'forest' | 'demo' }) {
  const tones = {
    default: 'bg-cream-dark text-charcoal-muted',
    gold: 'bg-gold/15 text-gold',
    forest: 'bg-forest/10 text-forest',
    demo: 'bg-stone/20 text-charcoal-muted',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}) {
  const variants = {
    primary: 'bg-forest text-cream hover:bg-forest-light shadow-soft',
    secondary: 'bg-white text-forest border border-forest/15 hover:bg-cream-dark',
    ghost: 'bg-transparent text-forest hover:bg-forest/5',
  }
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-cream-dark ${className}`}>
      <div
        className="h-full rounded-full bg-moss transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
      />
    </div>
  )
}

export function DemoBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-xl bg-stone/15 px-3 py-2 text-xs text-charcoal-muted">
      {children ?? 'Demo / schematic data — not verified field records'}
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

const KEY = 'naturescout-pilot-banner-dismissed'

export function PilotBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(KEY) !== '1'
    } catch {
      return true
    }
  })

  if (!visible) return null

  return (
    <div className="relative border-b border-forest/10 bg-forest text-cream">
      <div className="mx-auto flex max-w-5xl items-start gap-3 px-4 py-2.5 text-xs leading-relaxed md:px-8">
        <p className="flex-1">
          <span className="font-semibold">Pilot launch · Guildford</span>
          {' — '}
          Live map via MapTiler. Some places and trees are still demo data until verified.
          {' '}
          <Link to="/privacy" className="underline underline-offset-2 text-moss-light">
            Privacy
          </Link>
        </p>
        <button
          type="button"
          aria-label="Dismiss"
          className="rounded-full p-1 hover:bg-white/10"
          onClick={() => {
            try {
              localStorage.setItem(KEY, '1')
            } catch {
              /* ignore */
            }
            setVisible(false)
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

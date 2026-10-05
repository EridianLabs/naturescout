import { NavLink } from 'react-router-dom'
import { Compass, Map, Binoculars, Leaf, User } from 'lucide-react'

const items = [
  { to: '/', label: 'Discover', icon: Compass, end: true },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/explore', label: 'Explore', icon: Binoculars },
  { to: '/collection', label: 'Collection', icon: Leaf },
  { to: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-forest/10 bg-cream/95 backdrop-blur-md md:hidden safe-bottom">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 pt-2 pb-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-forest' : 'text-charcoal-muted hover:text-forest'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      isActive ? 'bg-forest/10' : ''
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SideNav() {
  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-forest/10 md:bg-cream-dark/40 md:px-4 md:py-8 lg:w-64">
      <div className="mb-10 px-2">
        <p className="font-display text-2xl text-forest tracking-tight">NatureScout</p>
        <p className="mt-1 text-xs text-charcoal-muted">Nature near you</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-forest text-cream shadow-soft'
                  : 'text-charcoal-muted hover:bg-forest/5 hover:text-forest'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-2 px-2">
        <p className="text-[10px] uppercase tracking-wider text-stone">Guildford pilot</p>
        <div className="flex gap-3 text-[11px] text-charcoal-muted">
          <NavLink to="/privacy" className="hover:text-forest">
            Privacy
          </NavLink>
          <NavLink to="/terms" className="hover:text-forest">
            Terms
          </NavLink>
        </div>
      </div>
    </aside>
  )
}

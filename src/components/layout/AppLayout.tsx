import { Outlet, Link } from 'react-router-dom'
import { BottomNav, SideNav } from './Navigation'
import { PilotBanner } from '@/components/PilotBanner'

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream md:flex-row">
      <SideNav />
      <div className="relative flex min-h-dvh flex-1 flex-col">
        <PilotBanner />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-8 lg:max-w-5xl">
          <Outlet />
        </main>
        <footer className="mx-auto hidden w-full max-w-5xl px-8 pb-6 text-[11px] text-stone md:block">
          <div className="flex flex-wrap gap-4">
            <span>© {new Date().getFullYear()} NatureScout · Guildford pilot</span>
            <Link to="/privacy" className="hover:text-forest">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-forest">
              Terms
            </Link>
            <span>Map © MapTiler © OpenStreetMap</span>
          </div>
        </footer>
        <BottomNav />
      </div>
    </div>
  )
}

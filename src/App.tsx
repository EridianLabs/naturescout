import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/useProgress'
import { AppLayout } from '@/components/layout/AppLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { DiscoverPage } from '@/pages/DiscoverPage'
import { ExplorePage } from '@/pages/ExplorePage'
import { CollectionPage } from '@/pages/CollectionPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SpeciesDetailPage, TreeDetailPage, PlaceDetailPage } from '@/pages/DetailPages'
import { MissionDetailPage, AdventureGeneratePage, AdventurePage } from '@/pages/AdventurePages'
import { PrivacyPage, TermsPage } from '@/pages/LegalPages'

const MapPage = lazy(() =>
  import('@/pages/MapPage').then((m) => ({ default: m.MapPage })),
)

function MapFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-charcoal-muted">
      Loading map…
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DiscoverPage />} />
              <Route
                path="map"
                element={
                  <Suspense fallback={<MapFallback />}>
                    <MapPage />
                  </Suspense>
                }
              />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="explore/species/:id" element={<SpeciesDetailPage />} />
              <Route path="explore/trees/:id" element={<TreeDetailPage />} />
              <Route path="explore/places/:id" element={<PlaceDetailPage />} />
              <Route path="collection" element={<CollectionPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="missions/:id" element={<MissionDetailPage />} />
              <Route path="adventure/generate" element={<AdventureGeneratePage />} />
              <Route path="adventure/:id" element={<AdventurePage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </ErrorBoundary>
  )
}

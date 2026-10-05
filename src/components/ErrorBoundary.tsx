import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Primitives'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('NatureScout error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 text-center">
          <p className="text-4xl">🌿</p>
          <h1 className="mt-4 font-display text-2xl text-forest">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-sm text-charcoal-muted">
            Please refresh. Your collection progress is saved on this device.
          </p>
          <div className="mt-6">
            <Button onClick={() => window.location.assign('/')}>Back to Discover</Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

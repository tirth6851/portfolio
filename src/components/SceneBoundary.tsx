import { Component, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  onError?: () => void
  children: ReactNode
}

/** Catches a failed lazy-chunk download (offline, stale deploy) so the DOM/SVG fallback stays up. */
export class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

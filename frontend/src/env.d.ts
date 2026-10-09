/// <reference types="vite/client" />

// Type declarations for deep imports from individual lucide-react icon files.
// Direct imports avoid loading the barrel file (~1583 re-exports) for faster
// cold starts and smaller bundle size. See: bundle-barrel-imports rule.
declare module 'lucide-react/dist/esm/icons/layout-dashboard' {
  import { type LucideIcon } from 'lucide-react'
  const icon: LucideIcon
  export default icon
}
declare module 'lucide-react/dist/esm/icons/trending-up' {
  import { type LucideIcon } from 'lucide-react'
  const icon: LucideIcon
  export default icon
}
declare module 'lucide-react/dist/esm/icons/trending-down' {
  import { type LucideIcon } from 'lucide-react'
  const icon: LucideIcon
  export default icon
}
declare module 'lucide-react/dist/esm/icons/dollar-sign' {
  import { type LucideIcon } from 'lucide-react'
  const icon: LucideIcon
  export default icon
}
declare module 'lucide-react/dist/esm/icons/bar-chart-2' {
  import { type LucideIcon } from 'lucide-react'
  const icon: LucideIcon
  export default icon
}
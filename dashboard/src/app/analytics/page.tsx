import { Suspense } from 'react'
import Analytics from '../../presentation/pages/Analytics'
import { Loading } from '../../presentation/components/atoms/loading'

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<Loading size="xl" />}>
      <Analytics />
    </Suspense>
  )
}

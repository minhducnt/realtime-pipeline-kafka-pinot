import { Suspense } from 'react'
import Dashboard from '../../presentation/pages/Dashboard'
import { Loading } from '../../presentation/components/atoms/loading'

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading size="xl" />}>
      <Dashboard />
    </Suspense>
  )
}

import { Suspense } from 'react'
import Activity from '../../presentation/pages/Activity'
import { Loading } from '../../presentation/components/atoms/loading'

export default function ActivityPage() {
  return (
    <Suspense fallback={<Loading size="xl" />}>
      <Activity />
    </Suspense>
  )
}

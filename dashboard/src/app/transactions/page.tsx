import { Suspense } from 'react'
import TransactionsView from '../../presentation/pages/Transactions'
import { Loading } from '../../presentation/components/atoms/loading'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<Loading size="xl" />}>
      <TransactionsView searchParams={searchParams} />
    </Suspense>
  )
}

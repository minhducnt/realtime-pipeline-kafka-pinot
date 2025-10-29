import { unstable_noStore as noStore } from 'next/cache'
import { PinotApiService } from '../../infrastructure/api/PinotApiService'
import TransactionsTable from '../components/organisms/TransactionsTable'
import PaginationControls from '../components/organisms/PaginationControls'

async function getTransactionsData(page: number = 1, pageSize: number = 20): Promise<{ transactions: any[], totalCount: number }> {
  try {
    const apiService = new PinotApiService()

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize

    // Get total count first
    const countSql = 'SELECT COUNT(*) FROM transactions'
    const countResult = await apiService.queryPinot(countSql)
    const totalCount = countResult?.resultTable?.rows?.[0]?.[0] || 0

    // Get paginated data
    const dataSql = `SELECT * FROM transactions ORDER BY create_dt DESC LIMIT ${pageSize} OFFSET ${offset}`
    const dataResult = await apiService.queryPinot(dataSql)

    const transactions = dataResult?.resultTable?.rows || []

    return {
      transactions,
      totalCount: Number(totalCount)
    }
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return {
      transactions: [],
      totalCount: 0
    }
  }
}

interface TransactionsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TransactionsView({ searchParams }: TransactionsProps) {
  // Ensure no caching for dynamic data
  noStore()

  // searchParams is now a Promise in Next.js 15+
  const params = await searchParams
  const page = Number(params?.page) || 1
  const pageSize = Number(params?.pageSize) || 20

  const { transactions, totalCount } = await getTransactionsData(page, pageSize)
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: '0',
      padding: '20px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <header style={{
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 10px 0'
          }}>
            Transaction Monitor
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0'
          }}>
            Real-time transaction data
          </p>
        </header>

        <main>
          <TransactionsTable
            transactions={transactions}
            totalCount={totalCount}
            currentPage={page}
            pageSize={pageSize}
          />

          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={totalCount}
          />
        </main>

        <footer style={{
          marginTop: '40px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#9ca3af'
        }}>
          <p>Transaction monitoring powered by Apache Pinot</p>
        </footer>
      </div>
    </div>
  )
}

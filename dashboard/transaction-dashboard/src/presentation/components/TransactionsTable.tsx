import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Transaction } from '../../domain/entities/Transaction'
import { formatCurrency } from '../lib/utils'
import { Clock, User, MapPin, CreditCard } from 'lucide-react'

interface TransactionsTableProps {
  transactions: Transaction[]
  maxRows?: number
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  maxRows = 20
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const displayedTransactions = transactions.slice(0, maxRows)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Transactions
          <Badge variant="outline">
            {transactions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayedTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent transactions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Time</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Country</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Method</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      transaction.label === 1 ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">
                          {formatTime(transaction.createDt)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span>{transaction.userSeq}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium">
                      {formatCurrency(transaction.depositAmount)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{transaction.receivingCountry}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">{transaction.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge
                        variant={transaction.label === 1 ? 'destructive' : 'success'}
                        className="text-xs"
                      >
                        {transaction.label === 1 ? '🚨 Fraud' : '✅ Clean'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {transactions.length > maxRows && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Showing {maxRows} of {transactions.length} transactions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

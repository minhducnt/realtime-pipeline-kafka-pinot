import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { formatNumber, formatCurrency, formatPercentage } from '../lib/utils'
import { TrendingUp, TrendingDown, Activity, Shield, AlertTriangle, DollarSign } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: number | string
  change?: number
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
  formatter?: (value: number) => string
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'default',
  formatter = formatNumber
}) => {
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'danger':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getChangeIcon = () => {
    if (!change) return null
    return change > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  const getChangeColor = () => {
    if (!change) return 'text-gray-500'
    return change > 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${getVariantColor()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? formatter(value) : value}
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-xs mt-1 ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="ml-1">
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface KpiGridProps {
  totalTransactions: number
  fraudTransactions: number
  fraudRate: number
  totalAmount: number
  previousData?: {
    totalTransactions: number
    fraudTransactions: number
    fraudRate: number
    totalAmount: number
  }
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  totalTransactions,
  fraudTransactions,
  fraudRate,
  totalAmount,
  previousData
}) => {
  const calculateChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return undefined
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total Transactions"
        value={totalTransactions}
        change={calculateChange(totalTransactions, previousData?.totalTransactions)}
        icon={<Activity className="w-5 h-5" />}
        formatter={formatNumber}
      />

      <KpiCard
        title="Fraud Transactions"
        value={fraudTransactions}
        change={calculateChange(fraudTransactions, previousData?.fraudTransactions)}
        icon={<AlertTriangle className="w-5 h-5" />}
        variant="danger"
        formatter={formatNumber}
      />

      <KpiCard
        title="Fraud Rate"
        value={fraudRate}
        change={calculateChange(fraudRate, previousData?.fraudRate)}
        icon={<Shield className="w-5 h-5" />}
        variant={fraudRate > 5 ? 'danger' : fraudRate > 2 ? 'warning' : 'success'}
        formatter={formatPercentage}
      />

      <KpiCard
        title="Total Amount"
        value={totalAmount}
        change={calculateChange(totalAmount, previousData?.totalAmount)}
        icon={<DollarSign className="w-5 h-5" />}
        variant="success"
        formatter={formatCurrency}
      />
    </div>
  )
}

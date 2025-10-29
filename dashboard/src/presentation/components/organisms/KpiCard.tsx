import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../molecules/card'
import { Badge } from '../atoms/badge'
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
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'var(--status-success-bg)',
          borderColor: 'var(--status-success-text)',
          color: 'var(--status-success-text)'
        }
      case 'warning':
        return {
          backgroundColor: 'var(--status-warning-bg)',
          borderColor: 'var(--status-warning-text)',
          color: 'var(--status-warning-text)'
        }
      case 'danger':
        return {
          backgroundColor: 'var(--status-error-bg)',
          borderColor: 'var(--status-error-text)',
          color: 'var(--status-error-text)'
        }
      default:
        return {
          backgroundColor: 'var(--primary-50)',
          borderColor: 'var(--primary-200)',
          color: 'var(--primary-600)'
        }
    }
  }

  const getChangeIcon = () => {
    if (!change) return null
    return change > 0 ? (
      <TrendingUp className="w-4 h-4" style={{ color: 'var(--status-success-text)' }} />
    ) : (
      <TrendingDown className="w-4 h-4" style={{ color: 'var(--status-error-text)' }} />
    )
  }

  const getChangeColor = () => {
    if (!change) return { color: 'var(--text-secondary)' }
    return change > 0 ? { color: 'var(--status-success-text)' } : { color: 'var(--status-error-text)' }
  }

  return (
    <div className="card-theme" style={getVariantStyles()}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-theme-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
            {title}
          </h3>
          {icon && (
            <div style={{ color: 'var(--text-muted)' }}>
              {icon}
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-theme-primary" style={{ fontSize: 'var(--font-size-2xl)' }}>
          {typeof value === 'number' ? formatter(value) : value}
        </div>
        {change !== undefined && (
          <div className="flex items-center mt-2" style={{ fontSize: 'var(--font-size-xs)', ...getChangeColor() }}>
            {getChangeIcon()}
            <span style={{ marginLeft: 'var(--space-xs)' }}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

interface KpiGridProps {
  totalTransactions: number
  fraudTransactions: number
  fraudRate: number
  totalAmount: number
  transactions24h: number
  amount24h: number
  transactions1Week: number
  amount1Week: number
  uniqueUsers: number
  avgTransactionsPerUser: number
  previousData?: {
    totalTransactions: number
    fraudTransactions: number
    fraudRate: number
    totalAmount: number
    transactions24h: number
    amount24h: number
    transactions1Week: number
    amount1Week: number
    uniqueUsers: number
    avgTransactionsPerUser: number
  }
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  totalTransactions,
  fraudTransactions,
  fraudRate,
  totalAmount,
  transactions24h,
  amount24h,
  transactions1Week,
  amount1Week,
  uniqueUsers,
  avgTransactionsPerUser,
  previousData
}) => {
  const calculateChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return undefined
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="space-y-6">
      {/* Primary KPIs */}
      <div className="grid-responsive-1">
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

      {/* Time-based KPIs */}
      <div className="grid-responsive-1">
        <KpiCard
          title="24h Transactions"
          value={transactions24h}
          change={calculateChange(transactions24h, previousData?.transactions24h)}
          icon={<Activity className="w-5 h-5" />}
          formatter={formatNumber}
        />

        <KpiCard
          title="24h Amount"
          value={amount24h}
          change={calculateChange(amount24h, previousData?.amount24h)}
          icon={<DollarSign className="w-5 h-5" />}
          variant="success"
          formatter={formatCurrency}
        />

        <KpiCard
          title="7-Day Transactions"
          value={transactions1Week}
          change={calculateChange(transactions1Week, previousData?.transactions1Week)}
          icon={<Activity className="w-5 h-5" />}
          formatter={formatNumber}
        />

        <KpiCard
          title="7-Day Amount"
          value={amount1Week}
          change={calculateChange(amount1Week, previousData?.amount1Week)}
          icon={<DollarSign className="w-5 h-5" />}
          variant="success"
          formatter={formatCurrency}
        />
      </div>

      {/* User Analytics */}
      <div className="grid-responsive-1">
        <KpiCard
          title="Unique Users"
          value={uniqueUsers}
          change={calculateChange(uniqueUsers, previousData?.uniqueUsers)}
          icon={<Activity className="w-5 h-5" />}
          formatter={formatNumber}
        />

        <KpiCard
          title="Avg Transactions/User"
          value={avgTransactionsPerUser}
          change={calculateChange(avgTransactionsPerUser, previousData?.avgTransactionsPerUser)}
          icon={<Activity className="w-5 h-5" />}
          formatter={(value) => value.toFixed(1)}
        />

        <div className="col-span-2"></div> {/* Empty space for alignment */}
      </div>
    </div>
  )
}

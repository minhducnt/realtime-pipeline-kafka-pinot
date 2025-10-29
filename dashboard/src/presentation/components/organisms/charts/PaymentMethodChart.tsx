import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { PaymentMethodData } from '../../../domain/entities/Transaction'
import { formatNumber, formatCurrency } from '../../lib/utils'

interface PaymentMethodChartProps {
  data: PaymentMethodData[]
  height?: number
}

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({
  data,
  height = 400
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-lg)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <p style={{
            fontWeight: '600',
            marginBottom: 'var(--space-sm)',
            color: 'var(--text-primary)'
          }}>{label}</p>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--chart-primary)',
            margin: 'var(--space-xs) 0'
          }}>
            Transactions: {formatNumber(data.transactionCount)}
          </p>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--chart-error)',
            margin: 'var(--space-xs) 0'
          }}>
            Fraud Rate: {data.fraudRate.toFixed(1)}%
          </p>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--chart-success)',
            margin: 'var(--space-xs) 0'
          }}>
            Total Amount: {formatCurrency(data.totalAmount)}
          </p>
        </div>
      )
    }
    return null
  }

  const getBarColor = (fraudRate: number) => {
    if (fraudRate >= 10) return 'var(--chart-error)' // red for high fraud
    if (fraudRate >= 5) return 'var(--chart-warning)'  // yellow for medium fraud
    return 'var(--chart-success)' // green for low fraud
  }

  const chartData = data.map(item => ({
    ...item,
    color: getBarColor(item.fraudRate)
  }))

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.3} />
          <XAxis
            dataKey="method"
            className="text-xs"
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="var(--chart-text)"
          />
          <YAxis
            className="text-xs"
            label={{ value: 'Transaction Count', angle: -90, position: 'insideLeft', fill: 'var(--chart-text)' }}
            stroke="var(--chart-text)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="transactionCount"
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Bar key={`bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

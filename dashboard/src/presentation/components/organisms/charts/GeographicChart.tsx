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
import { GeographicData } from '../../../domain/entities/Transaction'
import { formatNumber, formatCurrency } from '../../lib/utils'

interface GeographicChartProps {
  data: GeographicData[]
  height?: number
}

export const GeographicChart: React.FC<GeographicChartProps> = ({
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
          {data.uniqueUsers && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              margin: 'var(--space-xs) 0'
            }}>
              Unique Users: {formatNumber(data.uniqueUsers)}
            </p>
          )}
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
          {data.avgAmount && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              margin: 'var(--space-xs) 0'
            }}>
              Avg Amount: {formatCurrency(data.avgAmount)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.3} />
          <XAxis
            dataKey="country"
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
            fill="var(--chart-primary)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

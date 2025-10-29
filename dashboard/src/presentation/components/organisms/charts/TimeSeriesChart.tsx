import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TimeSeriesData } from '../../../domain/entities/Transaction'

interface TimeSeriesChartProps {
  data: TimeSeriesData[]
  height?: number
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  height = 400
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatTooltipTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
          }}>
            {formatTooltipTime(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{
              color: entry.color,
              fontSize: 'var(--font-size-sm)',
              margin: 'var(--space-xs) 0'
            }}>
              {entry.name}: {
                entry.dataKey === 'fraudRate'
                  ? `${entry.value.toFixed(1)}%`
                  : entry.value.toLocaleString()
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart
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
            dataKey="timestamp"
            tickFormatter={formatTime}
            className="text-xs"
            stroke="var(--chart-text)"
          />
          <YAxis
            yAxisId="left"
            className="text-xs"
            label={{ value: 'Transaction Count', angle: -90, position: 'insideLeft', fill: 'var(--chart-text)' }}
            stroke="var(--chart-text)"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            className="text-xs"
            label={{ value: 'Fraud Rate (%)', angle: 90, position: 'insideRight', fill: 'var(--chart-text)' }}
            stroke="var(--chart-text)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="transactionCount"
            stroke="var(--chart-primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--chart-primary)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Transaction Count"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="fraudRate"
            stroke="var(--chart-error)"
            strokeWidth={2}
            dot={{ fill: 'var(--chart-error)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Fraud Rate (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

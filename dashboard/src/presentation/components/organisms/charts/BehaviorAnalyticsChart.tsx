'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface BehaviorData {
  frequency: string
  count: number
  percentage: number
}

interface IdTypeData {
  type: string
  count: number
  fraudRate: number
  [key: string]: any // Add index signature for Recharts compatibility
}

interface BehaviorAnalyticsChartProps {
  frequencyData: BehaviorData[]
  idTypeData: IdTypeData[]
  height?: number
}

const COLORS = ['var(--chart-primary)', 'var(--chart-success)', 'var(--chart-warning)', 'var(--chart-error)']

export const BehaviorAnalyticsChart: React.FC<BehaviorAnalyticsChartProps> = ({
  frequencyData,
  idTypeData,
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
            Count: {data.count?.toLocaleString() || 0}
          </p>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--chart-error)',
            margin: 'var(--space-xs) 0'
          }}>
            Fraud Rate: {data.fraudRate?.toFixed(1) || 0}%
          </p>
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
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
          }}>{data.name}</p>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: data.color,
            margin: 'var(--space-xs) 0'
          }}>
            Count: {data.value?.toLocaleString() || 0}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Transaction Frequency Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Transaction Frequency Patterns
        </h3>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <BarChart
              data={frequencyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.3} />
              <XAxis
                dataKey="frequency"
                stroke="var(--chart-text)"
                fontSize="var(--font-size-xs)"
              />
              <YAxis
                stroke="var(--chart-text)"
                fontSize="var(--font-size-xs)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="var(--chart-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ID Type Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          ID Type Distribution
        </h3>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={idTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {idTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

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
  LineChart,
  Line,
  Legend
} from 'recharts'

interface AgeData {
  ageGroup: string
  count: number
  fraudRate: number
  avgAmount: number
}

interface RegistrationData {
  month: string
  newUsers: number
  activeUsers: number
  fraudRate: number
}

interface DemographicsChartProps {
  ageData: AgeData[]
  registrationData: RegistrationData[]
  height?: number
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({
  ageData,
  registrationData,
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
            Users: {data.count?.toLocaleString() || data.newUsers?.toLocaleString() || 0}
          </p>
          {data.fraudRate !== undefined && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--chart-error)',
              margin: 'var(--space-xs) 0'
            }}>
              Fraud Rate: {data.fraudRate.toFixed(1)}%
            </p>
          )}
          {data.avgAmount && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--chart-success)',
              margin: 'var(--space-xs) 0'
            }}>
              Avg Amount: ${data.avgAmount.toLocaleString()}
            </p>
          )}
          {data.activeUsers && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              margin: 'var(--space-xs) 0'
            }}>
              Active Users: {data.activeUsers.toLocaleString()}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Age Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          User Age Distribution
        </h3>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <BarChart
              data={ageData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.3} />
              <XAxis
                dataKey="ageGroup"
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

      {/* Registration Trends */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          User Registration Trends
        </h3>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <LineChart
              data={registrationData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" opacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="var(--chart-text)"
                fontSize="var(--font-size-xs)"
              />
              <YAxis
                stroke="var(--chart-text)"
                fontSize="var(--font-size-xs)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="var(--chart-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--chart-primary)', strokeWidth: 2, r: 4 }}
                name="New Registrations"
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="var(--chart-success)"
                strokeWidth={2}
                dot={{ fill: 'var(--chart-success)', strokeWidth: 2, r: 4 }}
                name="Active Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

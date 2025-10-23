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
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">
            {formatTooltipTime(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
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
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            className="text-xs"
          />
          <YAxis
            yAxisId="left"
            className="text-xs"
            label={{ value: 'Transaction Count', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            className="text-xs"
            label={{ value: 'Fraud Rate (%)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="transactionCount"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Transaction Count"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="fraudRate"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Fraud Rate (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

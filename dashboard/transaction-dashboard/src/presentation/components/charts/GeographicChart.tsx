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
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-sm text-blue-600">
            Transactions: {formatNumber(data.transactionCount)}
          </p>
          <p className="text-sm text-red-600">
            Fraud Rate: {data.fraudRate.toFixed(1)}%
          </p>
          <p className="text-sm text-green-600">
            Total Amount: {formatCurrency(data.totalAmount)}
          </p>
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
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="country"
            className="text-xs"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            className="text-xs"
            label={{ value: 'Transaction Count', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="transactionCount"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

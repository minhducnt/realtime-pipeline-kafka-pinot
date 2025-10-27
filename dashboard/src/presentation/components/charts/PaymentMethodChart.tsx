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

  const getBarColor = (fraudRate: number) => {
    if (fraudRate >= 10) return '#ef4444' // red for high fraud
    if (fraudRate >= 5) return '#f59e0b'  // yellow for medium fraud
    return '#10b981' // green for low fraud
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
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="method"
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

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { KpiGrid } from '../components/KpiCard'
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart'
import { GeographicChart } from '../components/charts/GeographicChart'
import { PaymentMethodChart } from '../components/charts/PaymentMethodChart'
import { FraudAlerts } from '../components/FraudAlerts'
import { TransactionsTable } from '../components/TransactionsTable'
import { ConnectionStatus } from '../components/ConnectionStatus'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { DashboardData, TransactionSummary } from '../../domain/entities/Transaction'
import { DashboardApplicationServiceImpl } from '../../application/services/DashboardService'
import { PinotApiService } from '../../infrastructure/api/PinotApiService'
import { ServerSentEventsService } from '../../infrastructure/websocket/RealtimeService'
import { Activity, BarChart3, MapPin, Shield } from 'lucide-react'

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [previousSummary, setPreviousSummary] = useState<TransactionSummary | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dashboardService] = useState(() => {
    const apiService = new PinotApiService()
    const realtimeService = new ServerSentEventsService()
    return new DashboardApplicationServiceImpl(apiService, realtimeService)
  })

  // Initialize real-time connection
  useEffect(() => {
    const initializeRealtimeConnection = async () => {
      try {
        setIsConnecting(true)
        setError(null)

        await dashboardService.subscribeToRealtimeUpdates(
          (data: DashboardData) => {
            setPreviousSummary(dashboardData?.summary || null)
            setDashboardData(data)
            setLastUpdate(new Date())
            setIsConnected(true)
            setIsConnecting(false)
          },
          (error: Error) => {
            console.error('Real-time connection error:', error)
            setError(error.message)
            setIsConnected(false)
            setIsConnecting(false)
          },
          (connected: boolean) => {
            setIsConnected(connected)
            setIsConnecting(false)
            if (!connected) {
              setError('Connection lost')
            }
          }
        )
      } catch (error) {
        console.error('Failed to initialize real-time connection:', error)
        setError('Failed to initialize connection')
        setIsConnecting(false)
      }
    }

    initializeRealtimeConnection()

    // Cleanup on unmount
    return () => {
      dashboardService.unsubscribeFromRealtimeUpdates()
    }
  }, [dashboardService])

  // Load initial data if real-time fails
  useEffect(() => {
    if (!dashboardData && !isConnecting) {
      dashboardService.getDashboardData()
        .then(data => {
          setDashboardData(data)
          setLastUpdate(new Date())
        })
        .catch(error => {
          console.error('Failed to load initial data:', error)
          setError('Failed to load dashboard data')
        })
    }
  }, [dashboardData, isConnecting, dashboardService])

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {isConnecting ? 'Connecting to Real-time Dashboard...' : 'Loading Dashboard...'}
            </h2>
            <p className="text-gray-500">
              {isConnecting
                ? 'Establishing connection to transaction data stream'
                : 'Fetching transaction monitoring data'
              }
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚡ Real-Time Transaction Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Live fraud detection and transaction monitoring
          </p>
        </div>

        {/* Connection Status */}
        <ConnectionStatus
          isConnected={isConnected}
          isConnecting={isConnecting}
          lastUpdate={lastUpdate || undefined}
          error={error || undefined}
        />

        {/* KPI Cards */}
        <KpiGrid
          totalTransactions={dashboardData.summary.totalTransactions}
          fraudTransactions={dashboardData.summary.fraudTransactions}
          fraudRate={dashboardData.summary.fraudRate}
          totalAmount={dashboardData.summary.totalAmount}
          previousData={previousSummary || undefined}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time Series Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Transaction Volume Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart data={dashboardData.timeSeries} height={400} />
            </CardContent>
          </Card>

          {/* Geographic Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GeographicChart data={dashboardData.geographic} height={350} />
            </CardContent>
          </Card>

          {/* Payment Methods Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodChart data={dashboardData.paymentMethods} height={350} />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fraud Alerts */}
          <div className="lg:col-span-1">
            <FraudAlerts alerts={dashboardData.alerts} maxAlerts={8} />
          </div>

          {/* Transactions Table */}
          <div className="lg:col-span-2">
            <TransactionsTable transactions={dashboardData.recentTransactions} maxRows={15} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>Real-time transaction monitoring powered by Apache Pinot & Next.js</p>
          <p className="mt-1">
            Data updates every 2 seconds • Built with Clean Architecture
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

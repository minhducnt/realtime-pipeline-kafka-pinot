import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { FraudAlert } from '../../domain/entities/Transaction'
import { formatCurrency } from '../lib/utils'
import { AlertTriangle, Clock, User, MapPin, CreditCard } from 'lucide-react'

interface FraudAlertsProps {
  alerts: FraudAlert[]
  maxAlerts?: number
}

export const FraudAlerts: React.FC<FraudAlertsProps> = ({
  alerts,
  maxAlerts = 10
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getSeverityIcon = (severity: string) => {
    const iconClass = "w-4 h-4"
    switch (severity) {
      case 'high':
        return <AlertTriangle className={`${iconClass} text-red-500`} />
      case 'medium':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />
      case 'low':
        return <AlertTriangle className={`${iconClass} text-green-500`} />
      default:
        return <AlertTriangle className={iconClass} />
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    return date.toLocaleDateString()
  }

  const displayedAlerts = alerts.slice(0, maxAlerts)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Fraud Alerts
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayedAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent fraud alerts</p>
            <p className="text-sm">All transactions appear legitimate</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {displayedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(alert.severity)}
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">User {alert.userId}</span>
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(alert.amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{alert.country}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>{alert.paymentMethod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {alerts.length > maxAlerts && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              And {alerts.length - maxAlerts} more alerts...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

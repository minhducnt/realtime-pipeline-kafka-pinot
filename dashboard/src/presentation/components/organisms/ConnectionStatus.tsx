import React from 'react'
import { Badge } from '../atoms/badge'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'

interface ConnectionStatusProps {
  isConnected: boolean
  isConnecting?: boolean
  lastUpdate?: Date
  error?: string
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting = false,
  lastUpdate,
  error
}) => {
  const getStatusInfo = () => {
    if (error) {
      return {
        icon: <WifiOff className="w-4 h-4" />,
        text: 'Connection Error',
        variant: 'destructive' as const,
        description: error
      }
    }

    if (isConnecting) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: 'Connecting...',
        variant: 'secondary' as const,
        description: 'Establishing real-time connection'
      }
    }

    if (isConnected) {
      return {
        icon: <Wifi className="w-4 h-4" />,
        text: 'Connected',
        variant: 'success' as const,
        description: 'Real-time data streaming active'
      }
    }

    return {
      icon: <WifiOff className="w-4 h-4" />,
      text: 'Disconnected',
      variant: 'destructive' as const,
      description: 'Attempting to reconnect...'
    }
  }

  const statusInfo = getStatusInfo()

  const formatLastUpdate = (date?: Date) => {
    if (!date) return 'Never'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)

    if (diffSeconds < 60) return `${diffSeconds}s ago`
    const diffMinutes = Math.floor(diffSeconds / 60)
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.floor(diffMinutes / 60)
    return `${diffHours}h ago`
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${
          statusInfo.variant === 'success' ? 'bg-green-100' :
          statusInfo.variant === 'destructive' ? 'bg-red-100' :
          'bg-gray-100'
        }`}>
          {statusInfo.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant} className="text-xs">
              {statusInfo.text}
            </Badge>
            {isConnected && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {statusInfo.description}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs text-gray-500">Last Update</p>
        <p className="text-sm font-medium">
          {formatLastUpdate(lastUpdate)}
        </p>
      </div>
    </div>
  )
}

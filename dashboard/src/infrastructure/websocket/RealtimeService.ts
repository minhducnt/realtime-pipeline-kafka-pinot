import { DashboardData } from '../../domain/entities/Transaction'

export interface RealtimeService {
  connect(): Promise<void>
  disconnect(): void
  onData(callback: (data: DashboardData) => void): void
  onError(callback: (error: Error) => void): void
  onConnectionChange(callback: (connected: boolean) => void): void
  isConnected(): boolean
}

export class ServerSentEventsService implements RealtimeService {
  private eventSource: EventSource | null = null
  private baseUrl: string
  private dataCallback?: (data: DashboardData) => void
  private errorCallback?: (error: Error) => void
  private connectionCallback?: (connected: boolean) => void
  private reconnectTimeout?: NodeJS.Timeout
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 5000

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }

  async connect(): Promise<void> {
    if (this.eventSource) {
      this.disconnect()
    }

    // Remote Pinot instance doesn't have real-time endpoints
    console.log('Real-time updates not available - no streaming endpoints on remote Pinot')
    this.connectionCallback?.(false)
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = undefined
    }

    this.connectionCallback?.(false)
  }

  onData(callback: (data: DashboardData) => void): void {
    this.dataCallback = callback
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionCallback = callback
  }

  isConnected(): boolean {
    // Remote Pinot instance doesn't have real-time endpoints
    return false
  }
}

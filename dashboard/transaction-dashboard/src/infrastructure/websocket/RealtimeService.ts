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

    try {
      this.eventSource = new EventSource(`${this.baseUrl}/api/realtime`)

      this.eventSource.onopen = () => {
        console.log('Real-time connection established')
        this.reconnectAttempts = 0
        this.connectionCallback?.(true)
      }

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.dataCallback?.(data.metrics)
        } catch (error) {
          console.error('Failed to parse real-time data:', error)
          this.errorCallback?.(new Error('Failed to parse real-time data'))
        }
      }

      this.eventSource.onerror = (event) => {
        console.error('Real-time connection error:', event)
        this.connectionCallback?.(false)

        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

          this.reconnectTimeout = setTimeout(() => {
            this.connect()
          }, this.reconnectDelay)
        } else {
          this.errorCallback?.(new Error('Failed to reconnect after maximum attempts'))
        }
      }

    } catch (error) {
      this.errorCallback?.(error as Error)
      throw error
    }
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
    return this.eventSource?.readyState === EventSource.OPEN
  }
}

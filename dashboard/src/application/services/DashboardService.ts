import { TransactionService } from '../../domain/services/TransactionService'
import { RealtimeService } from '../../infrastructure/websocket/RealtimeService'
import { GetDashboardDataUseCaseImpl } from '../use-cases/GetDashboardData'
import { DashboardData } from '../../domain/entities/Transaction'

export interface DashboardApplicationService {
  getDashboardData(): Promise<DashboardData>
  subscribeToRealtimeUpdates(
    onData: (data: DashboardData) => void,
    onError: (error: Error) => void,
    onConnectionChange: (connected: boolean) => void
  ): Promise<void>
  unsubscribeFromRealtimeUpdates(): void
  isRealtimeConnected(): boolean
}

export class DashboardApplicationServiceImpl implements DashboardApplicationService {
  constructor(
    private transactionService: TransactionService,
    private realtimeService: RealtimeService
  ) {}

  async getDashboardData(): Promise<DashboardData> {
    const useCase = new GetDashboardDataUseCaseImpl(this.transactionService)
    return await useCase.execute()
  }

  async subscribeToRealtimeUpdates(
    onData: (data: DashboardData) => void,
    onError: (error: Error) => void,
    onConnectionChange: (connected: boolean) => void
  ): Promise<void> {
    this.realtimeService.onData(onData)
    this.realtimeService.onError(onError)
    this.realtimeService.onConnectionChange(onConnectionChange)

    await this.realtimeService.connect()
  }

  unsubscribeFromRealtimeUpdates(): void {
    this.realtimeService.disconnect()
  }

  isRealtimeConnected(): boolean {
    return this.realtimeService.isConnected()
  }
}

import { TransactionService } from '../../domain/services/TransactionService'
import { DashboardData } from '../../domain/entities/Transaction'

export interface GetDashboardDataUseCase {
  execute(): Promise<DashboardData>
}

export class GetDashboardDataUseCaseImpl implements GetDashboardDataUseCase {
  constructor(private transactionService: TransactionService) {}

  async execute(): Promise<DashboardData> {
    return await this.transactionService.getAllDashboardData()
  }
}

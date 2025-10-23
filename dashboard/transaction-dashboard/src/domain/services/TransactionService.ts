import {
  Transaction,
  TransactionSummary,
  GeographicData,
  PaymentMethodData,
  TimeSeriesData,
  FraudAlert,
  DashboardData
} from '../entities/Transaction'

export interface TransactionService {
  getSummaryMetrics(): Promise<TransactionSummary>
  getTimeSeriesData(): Promise<TimeSeriesData[]>
  getGeographicData(): Promise<GeographicData[]>
  getPaymentMethodData(): Promise<PaymentMethodData[]>
  getRecentTransactions(): Promise<Transaction[]>
  getFraudAlerts(): Promise<FraudAlert[]>
  getAllDashboardData(): Promise<DashboardData>
}

export class TransactionServiceImpl implements TransactionService {
  async getSummaryMetrics(): Promise<TransactionSummary> {
    // Implementation will be in infrastructure layer
    throw new Error('Method not implemented')
  }

  async getTimeSeriesData(): Promise<TimeSeriesData[]> {
    // Implementation will be in infrastructure layer
    throw new Error('Method not implemented')
  }

  async getGeographicData(): Promise<GeographicData[]> {
    // Implementation will be in infrastructure layer
    throw new Error('Method not implemented')
  }

  async getPaymentMethodData(): Promise<PaymentMethodData[]> {
    // Implementation will be in infrastructure layer
    throw new Error('Method not implemented')
  }

  async getRecentTransactions(): Promise<Transaction[]> {
    // Implementation will be in infrastructure layer
    throw new Error('Method not implemented')
  }

  async getFraudAlerts(): Promise<FraudAlert[]> {
    // Implementation will be in infrastructure layer
    throw new Error('Method not implemented')
  }

  async getAllDashboardData(): Promise<DashboardData> {
    // Implementation will be in infrastructure layer
    throw new Error('Method not implemented')
  }
}

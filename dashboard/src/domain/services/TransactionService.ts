import {
  Transaction,
  TransactionSummary,
  GeographicData,
  PaymentMethodData,
  BehaviorData,
  IdTypeData,
  AgeData,
  RegistrationData,
  TimeSeriesData,
  FraudAlert,
  DashboardData
} from '../entities/Transaction'

export interface TransactionService {
  getSummaryMetrics(): Promise<TransactionSummary>
  getTimeSeriesData(): Promise<TimeSeriesData[]>
  getGeographicData(): Promise<GeographicData[]>
  getPaymentMethodData(): Promise<PaymentMethodData[]>
  getBehaviorAnalyticsData(): Promise<{frequencyData: BehaviorData[], idTypeData: IdTypeData[]}>
  getDemographicsData(): Promise<{ageData: AgeData[], registrationData: RegistrationData[]}>
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

  async getBehaviorAnalyticsData(): Promise<{frequencyData: BehaviorData[], idTypeData: IdTypeData[]}> {
    // Implementation will be in infrastructure layer
    throw new Error('Method not implemented')
  }

  async getDemographicsData(): Promise<{ageData: AgeData[], registrationData: RegistrationData[]}> {
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

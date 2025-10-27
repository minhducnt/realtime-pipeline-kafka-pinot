export interface Transaction {
  id: string
  transactionSeq: number
  userSeq: number
  createDt: string
  depositAmount: number
  receivingCountry: string
  countryCode: string
  paymentMethod: string
  label: number // 0 = legitimate, 1 = fraud
  transactionCount24Hour: number
  transactionAmount24Hour: number
  transactionCount1Week: number
  transactionAmount1Week: number
}

export interface TransactionSummary {
  totalTransactions: number
  fraudTransactions: number
  fraudRate: number
  totalAmount: number
}

export interface GeographicData {
  country: string
  transactionCount: number
  fraudRate: number
  totalAmount: number
}

export interface PaymentMethodData {
  method: string
  transactionCount: number
  fraudRate: number
  totalAmount: number
}

export interface TimeSeriesData {
  timestamp: string
  transactionCount: number
  fraudCount: number
  fraudRate: number
}

export interface FraudAlert {
  id: string
  transactionId: string
  userId: number
  amount: number
  country: string
  paymentMethod: string
  timestamp: string
  severity: 'low' | 'medium' | 'high'
}

export interface DashboardData {
  summary: TransactionSummary
  timeSeries: TimeSeriesData[]
  geographic: GeographicData[]
  paymentMethods: PaymentMethodData[]
  recentTransactions: Transaction[]
  alerts: FraudAlert[]
}

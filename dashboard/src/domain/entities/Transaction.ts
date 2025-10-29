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
  // Additional fields from your schema
  idType?: string
  stayQualify?: string
  visaExpireDate?: string
  userName?: string
  registerDate?: string
  firstTransactionDate?: string
  birthDate?: string
  recheckDate?: string
  inviteCode?: string
  facePinDate?: string
  autodebitAccount?: number
  transactionCount1Month?: number
  transactionAmount1Month?: number
}

export interface TransactionSummary {
  totalTransactions: number
  fraudTransactions: number
  fraudRate: number
  totalAmount: number
  // Time-based metrics
  transactions24h: number
  amount24h: number
  transactions1Week: number
  amount1Week: number
  transactions1Month: number
  amount1Month: number
  // User metrics
  uniqueUsers: number
  avgTransactionsPerUser: number
}

export interface GeographicData {
  country: string
  transactionCount: number
  fraudRate: number
  totalAmount: number
  uniqueUsers?: number
  avgAmount?: number
}

export interface PaymentMethodData {
  method: string
  transactionCount: number
  fraudRate: number
  totalAmount: number
}

export interface BehaviorData {
  frequency: string
  count: number
  percentage: number
}

export interface IdTypeData {
  type: string
  count: number
  fraudRate: number
}

export interface AgeData {
  ageGroup: string
  count: number
  fraudRate: number
  avgAmount: number
}

export interface RegistrationData {
  month: string
  newUsers: number
  activeUsers: number
  fraudRate: number
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
  behaviorAnalytics: {
    frequencyData: BehaviorData[]
    idTypeData: IdTypeData[]
  }
  demographics: {
    ageData: AgeData[]
    registrationData: RegistrationData[]
  }
  recentTransactions: Transaction[]
  alerts: FraudAlert[]
}

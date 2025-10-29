import axios from 'axios'
import { TransactionService } from '../../domain/services/TransactionService'
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
} from '../../domain/entities/Transaction'

export class PinotApiService implements TransactionService {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://93.115.172.151:9000'
  }

  async queryPinot(sql: string): Promise<any> {
    try {
      // Use POST request with JSON body for Pinot SQL queries
      const requestBody = {
        sql: sql,
        queryOptions: {
          useMultistageEngine: false
        }
      }

      const fullUrl = `${this.baseUrl}/sql`

      const response = await axios.post(fullUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      })

      return response.data
    } catch (error: any) {
      console.error('Pinot query failed:', error)
      console.error('Error response:', error?.response?.data)
      console.error('Error status:', error?.response?.status)
      console.error('Error headers:', error?.response?.headers)
      throw error
    }
  }

  async getSummaryMetrics(): Promise<TransactionSummary> {
    // Enhanced summary query with time-based metrics
    const sql = `
      SELECT
        COUNT(*) as total_transactions,
        SUM(CASE WHEN label = 1 THEN 1 ELSE 0 END) as fraud_transactions,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate,
        SUM(deposit_amount) as total_amount,
        SUM(CASE WHEN create_dt >= ago('PT24H') THEN 1 ELSE 0 END) as transactions_24h,
        SUM(CASE WHEN create_dt >= ago('PT24H') THEN deposit_amount ELSE 0 END) as amount_24h,
        SUM(CASE WHEN create_dt >= ago('P7D') THEN 1 ELSE 0 END) as transactions_1week,
        SUM(CASE WHEN create_dt >= ago('P7D') THEN deposit_amount ELSE 0 END) as amount_1week,
        SUM(CASE WHEN create_dt >= ago('P30D') THEN 1 ELSE 0 END) as transactions_1month,
        SUM(CASE WHEN create_dt >= ago('P30D') THEN deposit_amount ELSE 0 END) as amount_1month,
        COUNT(DISTINCT user_seq) as unique_users,
        ROUND(COUNT(*) * 1.0 / NULLIF(COUNT(DISTINCT user_seq), 0), 2) as avg_transactions_per_user
      FROM transactions
      WHERE create_dt >= ago('P30D')
    `

    const data = await this.queryPinot(sql)
    if (data?.resultTable?.rows?.[0]) {
      const row = data.resultTable.rows[0]
      return {
        totalTransactions: Number(row[0]) || 0,
        fraudTransactions: Number(row[1]) || 0,
        fraudRate: Number(row[2]) || 0,
        totalAmount: Number(row[3]) || 0,
        transactions24h: Number(row[4]) || 0,
        amount24h: Number(row[5]) || 0,
        transactions1Week: Number(row[6]) || 0,
        amount1Week: Number(row[7]) || 0,
        transactions1Month: Number(row[8]) || 0,
        amount1Month: Number(row[9]) || 0,
        uniqueUsers: Number(row[10]) || 0,
        avgTransactionsPerUser: Number(row[11]) || 0
      }
    }

    return {
      totalTransactions: 0,
      fraudTransactions: 0,
      fraudRate: 0,
      totalAmount: 0,
      transactions24h: 0,
      amount24h: 0,
      transactions1Week: 0,
      amount1Week: 0,
      transactions1Month: 0,
      amount1Month: 0,
      uniqueUsers: 0,
      avgTransactionsPerUser: 0
    }
  }

  async getTimeSeriesData(): Promise<TimeSeriesData[]> {
    const sql = `SELECT dateTrunc('minute', create_dt) as timestamp, COUNT(*) as transaction_count, SUM(CASE WHEN label = 1 THEN 1 ELSE 0 END) as fraud_count, ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate FROM transactions WHERE create_dt >= ago('PT1H') GROUP BY dateTrunc('minute', create_dt) ORDER BY timestamp DESC LIMIT 60`

    const data = await this.queryPinot(sql)
    if (data?.resultTable?.rows) {
      return data.resultTable.rows.map((row: any[]) => ({
        timestamp: row[0],
        transactionCount: Number(row[1]) || 0,
        fraudCount: Number(row[2]) || 0,
        fraudRate: Number(row[3]) || 0
      })).reverse()
    }

    return []
  }

  async getGeographicData(): Promise<GeographicData[]> {
    // Enhanced geographic query using both country fields and more metrics
    const sql = `
      SELECT
        COALESCE(NULLIF(receiving_country, ''), country_code, 'Unknown') as country_display,
        COUNT(*) as transaction_count,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate,
        SUM(deposit_amount) as total_amount,
        COUNT(DISTINCT user_seq) as unique_users,
        ROUND(AVG(deposit_amount), 2) as avg_amount
      FROM transactions
      WHERE create_dt >= ago('P7D')
      GROUP BY COALESCE(NULLIF(receiving_country, ''), country_code, 'Unknown')
      ORDER BY transaction_count DESC
      LIMIT 15
    `

    const data = await this.queryPinot(sql)
    if (data?.resultTable?.rows) {
      return data.resultTable.rows.map((row: any[]) => ({
        country: row[0] || 'Unknown',
        transactionCount: Number(row[1]) || 0,
        fraudRate: Number(row[2]) || 0,
        totalAmount: Number(row[3]) || 0,
        // Additional fields for enhanced geographic insights
        uniqueUsers: Number(row[4]) || 0,
        avgAmount: Number(row[5]) || 0
      }))
    }

    return []
  }

  async getPaymentMethodData(): Promise<PaymentMethodData[]> {
    const sql = `SELECT payment_method, COUNT(*) as transaction_count, ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate, SUM(deposit_amount) as total_amount FROM transactions WHERE create_dt >= ago('PT1H') GROUP BY payment_method ORDER BY transaction_count DESC LIMIT 10`

    const data = await this.queryPinot(sql)
    if (data?.resultTable?.rows) {
      return data.resultTable.rows.map((row: any[]) => ({
        method: row[0] || 'Unknown',
        transactionCount: Number(row[1]) || 0,
        fraudRate: Number(row[2]) || 0,
        totalAmount: Number(row[3]) || 0
      }))
    }

    return []
  }

  async getRecentTransactions(): Promise<Transaction[]> {
    const sql = `SELECT transaction_seq, user_seq, create_dt, deposit_amount, receiving_country, country_code, payment_method, label, transaction_count_24hour, transaction_amount_24hour, transaction_count_1week, transaction_amount_1week, transaction_count_1month, transaction_amount_1month, id_type, user_name, birth_date, register_date, autodebit_account FROM transactions ORDER BY create_dt DESC LIMIT 20`

    const data = await this.queryPinot(sql)
    if (data?.resultTable?.rows) {
      return data.resultTable.rows.map((row: any[], index: number) => ({
        id: `txn-${index}`,
        transactionSeq: Number(row[0]) || 0,
        userSeq: Number(row[1]) || 0,
        createDt: row[2],
        depositAmount: Number(row[3]) || 0,
        receivingCountry: row[4] || 'Unknown',
        countryCode: row[5] || 'XX',
        paymentMethod: row[6] || 'Unknown',
        label: Number(row[7]) || 0,
        transactionCount24Hour: Number(row[8]) || 0,
        transactionAmount24Hour: Number(row[9]) || 0,
        transactionCount1Week: Number(row[10]) || 0,
        transactionAmount1Week: Number(row[11]) || 0,
        transactionCount1Month: Number(row[12]) || 0,
        transactionAmount1Month: Number(row[13]) || 0,
        idType: row[14] || undefined,
        userName: row[15] || undefined,
        birthDate: row[16] || undefined,
        registerDate: row[17] || undefined,
        autodebitAccount: row[18] ? Number(row[18]) : undefined,
        // Additional optional fields
        stayQualify: undefined,
        visaExpireDate: undefined,
        firstTransactionDate: undefined,
        recheckDate: undefined,
        inviteCode: undefined,
        facePinDate: undefined
      }))
    }

    return []
  }

  async getBehaviorAnalyticsData(): Promise<{frequencyData: BehaviorData[], idTypeData: IdTypeData[]}> {
    // Transaction frequency patterns based on transaction_count_24hour
    const frequencySql = `
      SELECT
        CASE
          WHEN transaction_count_24hour = 1 THEN '1'
          WHEN transaction_count_24hour BETWEEN 2 AND 5 THEN '2-5'
          WHEN transaction_count_24hour BETWEEN 6 AND 10 THEN '6-10'
          WHEN transaction_count_24hour BETWEEN 11 AND 20 THEN '11-20'
          ELSE '20+'
        END as frequency_range,
        COUNT(*) as count,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate
      FROM transactions
      WHERE create_dt >= ago('P30D')
      GROUP BY
        CASE
          WHEN transaction_count_24hour = 1 THEN '1'
          WHEN transaction_count_24hour BETWEEN 2 AND 5 THEN '2-5'
          WHEN transaction_count_24hour BETWEEN 6 AND 10 THEN '6-10'
          WHEN transaction_count_24hour BETWEEN 11 AND 20 THEN '11-20'
          ELSE '20+'
        END
      ORDER BY
        CASE
          WHEN frequency_range = '1' THEN 1
          WHEN frequency_range = '2-5' THEN 2
          WHEN frequency_range = '6-10' THEN 3
          WHEN frequency_range = '11-20' THEN 4
          ELSE 5
        END
    `

    // ID type distribution
    const idTypeSql = `
      SELECT
        CASE WHEN id_type IS NULL OR id_type = '' THEN 'Unknown' ELSE id_type END as id_type_clean,
        COUNT(*) as count,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate
      FROM transactions
      WHERE create_dt >= ago('P30D')
      GROUP BY CASE WHEN id_type IS NULL OR id_type = '' THEN 'Unknown' ELSE id_type END
      ORDER BY count DESC
      LIMIT 10
    `

    const [frequencyResult, idTypeResult] = await Promise.all([
      this.queryPinot(frequencySql),
      this.queryPinot(idTypeSql)
    ])

    // Process frequency data
    let frequencyData: BehaviorData[] = []
    if (frequencyResult?.resultTable?.rows) {
      const totalCount = frequencyResult.resultTable.rows.reduce((sum: number, row: any[]) => sum + Number(row[1] || 0), 0)
      frequencyData = frequencyResult.resultTable.rows.map((row: any[]) => ({
        frequency: row[0] || 'Unknown',
        count: Number(row[1]) || 0,
        percentage: totalCount > 0 ? (Number(row[1]) / totalCount) * 100 : 0
      }))
    }

    // Process ID type data
    let idTypeData: IdTypeData[] = []
    if (idTypeResult?.resultTable?.rows) {
      idTypeData = idTypeResult.resultTable.rows.map((row: any[]) => ({
        type: row[0] || 'Unknown',
        count: Number(row[1]) || 0,
        fraudRate: Number(row[2]) || 0
      }))
    }

    return {
      frequencyData,
      idTypeData
    }
  }

  async getDemographicsData(): Promise<{ageData: AgeData[], registrationData: RegistrationData[]}> {
    // Age distribution based on birth_date
    const ageSql = `
      SELECT
        CASE
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) < 18 THEN '<18'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 18 AND 24 THEN '18-24'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 25 AND 34 THEN '25-34'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 35 AND 44 THEN '35-44'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 45 AND 54 THEN '45-54'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 55 AND 64 THEN '55-64'
          ELSE '65+'
        END as age_group,
        COUNT(*) as count,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate,
        ROUND(AVG(deposit_amount), 2) as avg_amount
      FROM transactions
      WHERE birth_date IS NOT NULL AND birth_date != '' AND create_dt >= ago('P30D')
      GROUP BY
        CASE
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) < 18 THEN '<18'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 18 AND 24 THEN '18-24'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 25 AND 34 THEN '25-34'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 35 AND 44 THEN '35-44'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 45 AND 54 THEN '45-54'
          WHEN YEAR(NOW()) - YEAR(CAST(birth_date AS TIMESTAMP)) BETWEEN 55 AND 64 THEN '55-64'
          ELSE '65+'
        END
      ORDER BY
        CASE
          WHEN age_group = '<18' THEN 1
          WHEN age_group = '18-24' THEN 2
          WHEN age_group = '25-34' THEN 3
          WHEN age_group = '35-44' THEN 4
          WHEN age_group = '45-54' THEN 5
          WHEN age_group = '55-64' THEN 6
          ELSE 7
        END
    `

    // User registration trends (monthly)
    const registrationSql = `
      SELECT
        dateFormat(register_date, 'yyyy-MM') as registration_month,
        COUNT(DISTINCT user_seq) as new_users,
        COUNT(DISTINCT CASE WHEN create_dt >= ago('P30D') THEN user_seq END) as active_users,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate
      FROM transactions
      WHERE register_date IS NOT NULL AND register_date != ''
      GROUP BY dateFormat(register_date, 'yyyy-MM')
      ORDER BY registration_month DESC
      LIMIT 12
    `

    const [ageResult, registrationResult] = await Promise.all([
      this.queryPinot(ageSql),
      this.queryPinot(registrationSql)
    ])

    // Process age data
    let ageData: AgeData[] = []
    if (ageResult?.resultTable?.rows) {
      ageData = ageResult.resultTable.rows.map((row: any[]) => ({
        ageGroup: row[0] || 'Unknown',
        count: Number(row[1]) || 0,
        fraudRate: Number(row[2]) || 0,
        avgAmount: Number(row[3]) || 0
      }))
    }

    // Process registration data
    let registrationData: RegistrationData[] = []
    if (registrationResult?.resultTable?.rows) {
      registrationData = registrationResult.resultTable.rows.map((row: any[]) => ({
        month: row[0] || 'Unknown',
        newUsers: Number(row[1]) || 0,
        activeUsers: Number(row[2]) || 0,
        fraudRate: Number(row[3]) || 0
      })).reverse() // Reverse to show chronological order
    }

    return {
      ageData,
      registrationData
    }
  }

  async getFraudAlerts(): Promise<FraudAlert[]> {
    const sql = `SELECT transaction_seq, user_seq, deposit_amount, receiving_country, payment_method, create_dt FROM transactions WHERE label = 1 AND create_dt >= ago('PT5M') ORDER BY create_dt DESC LIMIT 10`

    const data = await this.queryPinot(sql)
    if (data?.resultTable?.rows) {
      return data.resultTable.rows.map((row: any[], index: number) => ({
        id: `alert-${index}`,
        transactionId: `txn-${row[0]}`,
        userId: Number(row[1]) || 0,
        amount: Number(row[2]) || 0,
        country: row[3] || 'Unknown',
        paymentMethod: row[4] || 'Unknown',
        timestamp: row[5],
        severity: this.calculateSeverity(Number(row[2]) || 0)
      }))
    }

    return []
  }

  async getAllDashboardData(): Promise<DashboardData> {
    const [
      summary,
      timeSeries,
      geographic,
      paymentMethods,
      behaviorAnalytics,
      demographics,
      recentTransactions,
      alerts
    ] = await Promise.all([
      this.getSummaryMetrics(),
      this.getTimeSeriesData(),
      this.getGeographicData(),
      this.getPaymentMethodData(),
      this.getBehaviorAnalyticsData(),
      this.getDemographicsData(),
      this.getRecentTransactions(),
      this.getFraudAlerts()
    ])

    return {
      summary,
      timeSeries,
      geographic,
      paymentMethods,
      behaviorAnalytics,
      demographics,
      recentTransactions,
      alerts
    }
  }

  private calculateSeverity(amount: number): 'low' | 'medium' | 'high' {
    if (amount >= 50000) return 'high'
    if (amount >= 10000) return 'medium'
    return 'low'
  }
}

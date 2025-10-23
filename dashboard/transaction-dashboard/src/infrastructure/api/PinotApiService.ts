import axios from 'axios'
import { TransactionService } from '../../domain/services/TransactionService'
import {
  Transaction,
  TransactionSummary,
  GeographicData,
  PaymentMethodData,
  TimeSeriesData,
  FraudAlert,
  DashboardData
} from '../../domain/entities/Transaction'

export class PinotApiService implements TransactionService {
  private baseUrl: string

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  async queryPinot(sql: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/query`, { sql })
      return response.data
    } catch (error) {
      console.error('Pinot query failed:', error)
      throw error
    }
  }

  async getSummaryMetrics(): Promise<TransactionSummary> {
    const sql = `
      SELECT
        COUNT(*) as total_transactions,
        SUM(CASE WHEN label = 1 THEN 1 ELSE 0 END) as fraud_transactions,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate,
        SUM(deposit_amount) as total_amount
      FROM transactions
      WHERE create_dt >= ago('PT1H')
    `

    const data = await this.queryPinot(sql)
    if (data?.resultTable?.rows?.[0]) {
      const [totalTransactions, fraudTransactions, fraudRate, totalAmount] = data.resultTable.rows[0]
      return {
        totalTransactions: Number(totalTransactions) || 0,
        fraudTransactions: Number(fraudTransactions) || 0,
        fraudRate: Number(fraudRate) || 0,
        totalAmount: Number(totalAmount) || 0
      }
    }

    return {
      totalTransactions: 0,
      fraudTransactions: 0,
      fraudRate: 0,
      totalAmount: 0
    }
  }

  async getTimeSeriesData(): Promise<TimeSeriesData[]> {
    const sql = `
      SELECT
        dateTrunc('minute', create_dt) as timestamp,
        COUNT(*) as transaction_count,
        SUM(CASE WHEN label = 1 THEN 1 ELSE 0 END) as fraud_count,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate
      FROM transactions
      WHERE create_dt >= ago('PT1H')
      GROUP BY dateTrunc('minute', create_dt)
      ORDER BY timestamp DESC
      LIMIT 60
    `

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
    const sql = `
      SELECT
        receiving_country,
        COUNT(*) as transaction_count,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate,
        SUM(deposit_amount) as total_amount
      FROM transactions
      WHERE create_dt >= ago('PT1H')
      GROUP BY receiving_country
      ORDER BY transaction_count DESC
      LIMIT 15
    `

    const data = await this.queryPinot(sql)
    if (data?.resultTable?.rows) {
      return data.resultTable.rows.map((row: any[]) => ({
        country: row[0] || 'Unknown',
        transactionCount: Number(row[1]) || 0,
        fraudRate: Number(row[2]) || 0,
        totalAmount: Number(row[3]) || 0
      }))
    }

    return []
  }

  async getPaymentMethodData(): Promise<PaymentMethodData[]> {
    const sql = `
      SELECT
        payment_method,
        COUNT(*) as transaction_count,
        ROUND(AVG(CASE WHEN label = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as fraud_rate,
        SUM(deposit_amount) as total_amount
      FROM transactions
      WHERE create_dt >= ago('PT1H')
      GROUP BY payment_method
      ORDER BY transaction_count DESC
      LIMIT 10
    `

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
    const sql = `
      SELECT
        transaction_seq,
        user_seq,
        create_dt,
        deposit_amount,
        receiving_country,
        country_code,
        payment_method,
        label,
        transaction_count_24hour,
        transaction_amount_24hour,
        transaction_count_1week,
        transaction_amount_1week
      FROM transactions
      ORDER BY create_dt DESC
      LIMIT 20
    `

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
        transactionAmount1Week: Number(row[11]) || 0
      }))
    }

    return []
  }

  async getFraudAlerts(): Promise<FraudAlert[]> {
    const sql = `
      SELECT
        transaction_seq,
        user_seq,
        deposit_amount,
        receiving_country,
        payment_method,
        create_dt
      FROM transactions
      WHERE label = 1 AND create_dt >= ago('PT5M')
      ORDER BY create_dt DESC
      LIMIT 10
    `

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
      recentTransactions,
      alerts
    ] = await Promise.all([
      this.getSummaryMetrics(),
      this.getTimeSeriesData(),
      this.getGeographicData(),
      this.getPaymentMethodData(),
      this.getRecentTransactions(),
      this.getFraudAlerts()
    ])

    return {
      summary,
      timeSeries,
      geographic,
      paymentMethods,
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

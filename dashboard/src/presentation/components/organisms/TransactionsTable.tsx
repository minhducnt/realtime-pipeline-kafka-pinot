interface TransactionsTableProps {
  transactions: any[]
  totalCount: number
  currentPage: number
  pageSize: number
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}


// Helper function to create a row object from Pinot data
function createTransactionObject(row: any[]): any {
  // Based on the Pinot response column order
  return {
    autodebit_account: row[0],
    birth_date: row[1],
    country_code: row[2],
    create_dt: row[3],
    deposit_amount: row[4],
    face_pin_date: row[5],
    first_transaction_date: row[6],
    id_type: row[7],
    invite_code: row[8],
    label: row[9],
    payment_method: row[10],
    receiving_country: row[11],
    recheck_date: row[12],
    register_date: row[13],
    stay_qualify: row[14],
    transaction_amount_1month: row[15],
    transaction_amount_1week: row[16],
    transaction_amount_24hour: row[17],
    transaction_count_1month: row[18],
    transaction_count_1week: row[19],
    transaction_count_24hour: row[20],
    transaction_seq: row[21],
    user_name: row[22],
    user_seq: row[23],
    visa_expire_date: row[24]
  }
}

export default function TransactionsTable({ transactions, totalCount, currentPage, pageSize }: TransactionsTableProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          📊
        </div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#374151',
          margin: '0 0 8px 0'
        }}>
          No Transactions Found
        </h3>
        <p style={{
          color: '#6b7280',
          margin: '0'
        }}>
          Transaction data will appear here when available.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: '0'
          }}>
            Recent Transactions
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0 0 0'
          }}>
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()} transactions
          </p>
      </div>

      <div style={{
        overflowX: 'auto'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Time
              </th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                User
              </th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Amount
              </th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Country
              </th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Method
              </th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ID Type
              </th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                24h Count
              </th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((row, index) => {
              // Convert Pinot array row to object
              const transaction = createTransactionObject(row)

              return (
                <tr
                  key={`txn-${index}`}
                  style={{
                    borderBottom: '1px solid #f3f4f6',
                    backgroundColor: transaction.label === 1 ? '#fef2f2' : 'transparent'
                  }}
                >
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                      {formatTime(transaction.create_dt)}
                    </div>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {transaction.user_seq}
                      </div>
                      {transaction.user_name && (
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          {transaction.user_name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    {formatCurrency(transaction.deposit_amount)}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    <div>
                      <div>
                        {transaction.receiving_country || 'Unknown'}
                      </div>
                      {transaction.country_code && transaction.country_code !== transaction.receiving_country && (
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          {transaction.country_code}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {transaction.payment_method || 'Unknown'}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {transaction.id_type || 'N/A'}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {formatNumber(transaction.transaction_count_24hour)}
                  </td>
                  <td style={{
                    padding: '12px 16px'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: transaction.label === 1 ? '#fef2f2' : '#f0fdf4',
                      color: transaction.label === 1 ? '#dc2626' : '#16a34a',
                      border: `1px solid ${transaction.label === 1 ? '#fecaca' : '#bbf7d0'}`
                    }}>
                      {transaction.label === 1 ? '🚨 Fraud' : '✅ Clean'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}

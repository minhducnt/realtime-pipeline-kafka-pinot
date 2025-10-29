interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
}

export default function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalCount
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null
  }

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('pageSize', pageSize.toString())
    return `?${params.toString()}`
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div style={{
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }}>
      {/* Previous Button */}
      {currentPage > 1 ? (
        <a
          href={createPageUrl(currentPage - 1)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            color: '#374151',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Previous
        </a>
      ) : (
        <span style={{
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          backgroundColor: '#f9fafb',
          color: '#9ca3af',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ← Previous
        </span>
      )}

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`dots-${index}`}
              style={{
                padding: '8px 12px',
                color: '#6b7280',
                fontSize: '14px'
              }}
            >
              ...
            </span>
          )
        }

        const isActive = page === currentPage

        return (
          <a
            key={page}
            href={createPageUrl(page as number)}
            style={{
              padding: '8px 12px',
              border: `1px solid ${isActive ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '6px',
              backgroundColor: isActive ? '#3b82f6' : '#ffffff',
              color: isActive ? '#ffffff' : '#374151',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {page}
          </a>
        )
      })}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <a
          href={createPageUrl(currentPage + 1)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            color: '#374151',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Next →
        </a>
      ) : (
        <span style={{
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          backgroundColor: '#f9fafb',
          color: '#9ca3af',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Next →
        </span>
      )}

      {/* Current page info */}
      <span style={{
        marginLeft: '10px',
        fontSize: '14px',
        color: '#6b7280',
        padding: '8px 12px'
      }}>
        Page {currentPage} of {totalPages.toLocaleString()}
      </span>

      {/* Page Size Selector */}
      <div style={{
        marginLeft: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          fontSize: '14px',
          color: '#6b7280'
        }}>
          Show:
        </span>
        {[10, 20, 50, 100].map(size => (
          <a
            key={size}
            href={`?page=1&pageSize=${size}`}
            style={{
              padding: '6px 10px',
              border: `1px solid ${pageSize === size ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '4px',
              backgroundColor: pageSize === size ? '#3b82f6' : '#ffffff',
              color: pageSize === size ? '#ffffff' : '#374151',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.15s ease'
            }}
          >
            {size}
          </a>
        ))}
      </div>
    </div>
  )
}

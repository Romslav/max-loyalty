import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')

      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>

      {getPageNumbers().map((page, idx) => (
        <React.Fragment key={idx}>
          {page === '...' ? (
            <span className="px-2 py-2 text-gray-500">•••</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              disabled={isLoading}
              className={`px-3 py-2 border rounded-lg disabled:cursor-not-allowed ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>

      <div className="ml-4 text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

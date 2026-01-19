import React from 'react'
import classNames from 'classnames'

interface TableProps {
  columns: {
    key: string
    label: string
    width?: string
    render?: (value: any, row: any) => React.ReactNode
  }[]
  data: any[]
  loading?: boolean
  emptyMessage?: string
  striped?: boolean
  hoverable?: boolean
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'Нет данных',
  striped = true,
  hoverable = true,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 border-b-2 border-neutral-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left font-semibold text-neutral-700"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-neutral-500"
              >
                Загрузка...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-neutral-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={classNames(
                  'border-b border-neutral-200',
                  striped && idx % 2 === 0 && 'bg-neutral-50',
                  hoverable && 'hover:bg-primary-50 transition'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-neutral-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table

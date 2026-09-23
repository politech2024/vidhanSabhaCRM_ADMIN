import type { ReactNode } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[];
  rows: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: number }>({ columns, rows, onEdit, onDelete, onRowClick }: DataTableProps<T>) {
  const { t } = useLanguage();
  return (
    <div className="overflow-x-auto rounded-lg border border-brand-border bg-brand-surface">
      <table className="w-full text-left text-sm">
        <thead className="bg-brand-bg text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="px-4 py-2.5">
                {c.label}
              </th>
            ))}
            <th className="px-4 py-2.5 text-right">{t.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {rows.map((row) => (
            <tr key={row.id} className={onRowClick ? 'cursor-pointer hover:bg-brand-bg' : ''} onClick={() => onRowClick?.(row)}>
              {columns.map((c) => (
                <td key={String(c.key)} className="px-4 py-2.5 text-brand-text">
                  {c.render ? c.render(row) : String(row[c.key] ?? '')}
                </td>
              ))}
              <td className="px-4 py-2.5 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row);
                  }}
                  className="mr-3 text-sm font-medium text-brand-blue hover:underline"
                >
                  {t.edit}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(row);
                  }}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  {t.delete}
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-brand-text-secondary">
                {t.noRecordsYet}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

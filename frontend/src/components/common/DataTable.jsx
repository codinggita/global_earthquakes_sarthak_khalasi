import { useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TablePagination, Paper, TextField, InputAdornment,
} from '@mui/material';
import { Search } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';

const DataTable = ({
  columns,
  data,
  isLoading,
  pagination,
  onPageChange,
  onLimitChange,
  onSort,
  sortField,
  sortOrder,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onRowClick,
  actions,
  emptyTitle,
  emptyMessage,
  headerActions,
}) => {
  const tableStyles = useMemo(
    () => ({
      container: {
        background: 'var(--color-surface-card)',
        borderRadius: '1rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'none',
        overflow: 'hidden',
      },
      headCell: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--color-text-secondary)',
        backgroundColor: 'var(--color-surface-elevated)',
        borderBottom: '1px solid var(--color-border)',
        whiteSpace: 'nowrap',
        py: 1.5,
      },
      bodyCell: {
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.875rem',
        color: 'var(--color-text-primary)',
        borderBottom: '1px solid var(--color-border-light)',
        py: 1.5,
      },
      row: {
        cursor: onRowClick ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: 'var(--color-surface-elevated)',
        },
      },
    }),
    [onRowClick]
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search Bar + Header Actions */}
      {(onSearchChange || headerActions) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {onSearchChange && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} className="text-[var(--color-text-muted)]" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--color-surface-elevated)',
                  '& fieldset': { borderColor: 'var(--color-border)' },
                  '& input': { color: 'var(--color-text-primary)', fontSize: '0.875rem' },
                  '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                  minWidth: 280,
                },
              }}
            />
          )}
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Table */}
      <TableContainer component={Paper} sx={tableStyles.container}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={tableStyles.headCell}>
                  {col.sortable && onSort ? (
                    <TableSortLabel
                      active={sortField === col.field}
                      direction={sortField === col.field ? sortOrder : 'asc'}
                      onClick={() => onSort(col.field)}
                      sx={{
                        color: 'var(--color-text-secondary) !important',
                        '& .MuiTableSortLabel-icon': { color: 'var(--color-text-muted) !important' },
                      }}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}
              {actions && <TableCell sx={tableStyles.headCell} align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col, j) => (
                    <TableCell key={j} sx={tableStyles.bodyCell}>
                      <div className="shimmer h-4 w-full rounded" />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell sx={tableStyles.bodyCell}>
                      <div className="shimmer h-4 w-16 rounded" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} sx={{ border: 'none' }}>
                  <EmptyState title={emptyTitle} message={emptyMessage} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow
                  key={row._id || idx}
                  sx={tableStyles.row}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.field} sx={tableStyles.bodyCell}>
                      {col.renderCell ? col.renderCell(row) : row[col.field]}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell sx={tableStyles.bodyCell} align="right">
                      <div className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination && !isLoading && data.length > 0 && (
          <TablePagination
            component="div"
            count={pagination.totalRecords || 0}
            page={(pagination.currentPage || 1) - 1}
            rowsPerPage={pagination.limit || 20}
            onPageChange={(_, newPage) => onPageChange && onPageChange(newPage + 1)}
            onRowsPerPageChange={(e) => onLimitChange && onLimitChange(parseInt(e.target.value, 10))}
            rowsPerPageOptions={[10, 20, 50, 100]}
            sx={{
              color: 'var(--color-text-secondary)',
              borderTop: '1px solid var(--color-border)',
              '& .MuiTablePagination-selectIcon': { color: 'var(--color-text-secondary)' },
              '& .MuiIconButton-root': { color: 'var(--color-text-secondary)' },
            }}
          />
        )}
      </TableContainer>
    </div>
  );
};

export default DataTable;

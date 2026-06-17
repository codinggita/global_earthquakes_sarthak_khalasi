import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { IconButton, Tooltip, Chip } from '@mui/material';
import { fetchReports, deleteReport } from '../../features/reports/reportSlice';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ReportFormModal from './ReportFormModal';
import useAuth from '../../hooks/useAuth';
import { formatDate, getIntensityLabel, truncateText } from '../../utils/formatters';

const INTENSITY_COLORS = ['','#22c55e','#4ade80','#86efac','#fde047','#facc15','#f97316','#fb923c','#ef4444','#dc2626','#991b1b'];

const ReportsListPage = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const { items, pagination, isLoading } = useSelector((s) => s.reports);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const loadData = useCallback(() => {
    dispatch(fetchReports({ page, limit }));
  }, [dispatch, page, limit]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = () => {
    if (deleteTarget) {
      dispatch(deleteReport(deleteTarget._id)).then(() => {
        setDeleteTarget(null);
        loadData();
      });
    }
  };

  const columns = [
    {
      field: 'earthquake',
      headerName: 'Earthquake',
      renderCell: (row) => (
        <span className="text-sm text-[var(--color-text-primary)] font-medium">
          {truncateText(row.earthquake?.place || row.earthquake?.title || 'Unknown Event', 40)}
        </span>
      ),
    },
    {
      field: 'feltIntensity',
      headerName: 'Felt Intensity',
      sortable: false,
      renderCell: (row) => {
        const color = INTENSITY_COLORS[row.feltIntensity] || '#6366f1';
        return (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: `${color}20`, color }}>
              {row.feltIntensity}
            </div>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {getIntensityLabel(row.feltIntensity)}
            </span>
          </div>
        );
      },
    },
    {
      field: 'comments',
      headerName: 'Comments',
      renderCell: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.comments ? truncateText(row.comments, 50) : <span className="text-[var(--color-text-muted)] italic">No comments</span>}
        </span>
      ),
    },
    {
      field: 'user',
      headerName: 'Submitted By',
      renderCell: (row) => (
        <span className="text-xs text-[var(--color-text-muted)]">
          {row.user?.username || row.user?.email || 'Unknown'}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      sortable: true,
      renderCell: (row) => (
        <span className="text-xs text-[var(--color-text-muted)]">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  const tableActions = (row) => (
    <>
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => setEditTarget(row)}
          sx={{ color: 'var(--color-text-muted)', '&:hover': { color: '#eab308', backgroundColor: 'rgba(234,179,8,0.1)' } }}>
          <Edit size={15} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" onClick={() => setDeleteTarget(row)}
          sx={{ color: 'var(--color-text-muted)', '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)' } }}>
          <Trash2 size={15} />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Felt Reports – Global Earthquakes Dashboard</title>
        <meta name="description" content="View and manage earthquake felt intensity reports submitted by users." />
      </Helmet>

      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
              {isAdmin ? 'All Felt Reports' : 'My Felt Reports'}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              {isAdmin
                ? `${pagination.totalRecords?.toLocaleString() || 0} reports from all users`
                : 'Your submitted earthquake felt intensity reports'}
            </p>
          </div>
          <button
            id="create-report-btn"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm
              font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25"
          >
            <Plus size={16} />
            Submit Report
          </button>
        </div>

        {/* Info banner for users */}
        {!isAdmin && (
          <div className="glass-card p-4 flex items-start gap-3 border border-primary-500/20">
            <FileText className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Felt an earthquake?</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Submit a felt report to share your intensity experience. You can also report from the earthquake detail page.
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
          actions={tableActions}
          emptyTitle="No felt reports yet"
          emptyMessage={isAdmin ? 'No reports submitted yet.' : 'You have not submitted any felt reports. Click "Submit Report" to get started.'}
        />
      </div>

      {/* Delete Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Felt Report"
        actions={
          <>
            <button onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]">
              Cancel
            </button>
            <button onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-[var(--color-text-secondary)] pt-2">
          Are you sure you want to delete this felt report? This action cannot be undone.
        </p>
      </Modal>

      {/* Create / Edit Modal */}
      {(createOpen || editTarget) && (
        <ReportFormModal
          open={createOpen || !!editTarget}
          onClose={() => { setCreateOpen(false); setEditTarget(null); }}
          editData={editTarget}
          onSuccess={loadData}
        />
      )}
    </>
  );
};

export default ReportsListPage;

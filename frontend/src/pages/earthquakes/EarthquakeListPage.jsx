import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Eye, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Chip, IconButton, Tooltip, Slider, TextField, MenuItem, Collapse } from '@mui/material';
import { fetchEarthquakes, deleteEarthquake, setFilters } from '../../features/earthquakes/earthquakeSlice';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import { formatDate, formatMagnitude, getAlertColor, truncateText } from '../../utils/formatters';
import { ALERT_LEVELS, STATUS_OPTIONS } from '../../utils/constants';
import EarthquakeFormModal from './EarthquakeFormModal';

const EarthquakeListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { items, pagination, filters, isLoading } = useSelector((s) => s.earthquakes);

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortField, setSortField] = useState('time');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Local filter state
  const [magRange, setMagRange] = useState([0, 10]);
  const [statusFilter, setStatusFilter] = useState('');
  const [alertFilter, setAlertFilter] = useState('');
  const [tsunamiFilter, setTsunamiFilter] = useState('');

  const debouncedSearch = useDebounce(searchInput, 500);

  const loadData = useCallback(() => {
    const params = {
      page,
      limit,
      sort: sortOrder === 'desc' ? `-${sortField}` : sortField,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(magRange[0] > 0 && { minMag: magRange[0] }),
      ...(magRange[1] < 10 && { maxMag: magRange[1] }),
      ...(statusFilter && { status: statusFilter }),
      ...(alertFilter && { alert: alertFilter }),
      ...(tsunamiFilter && { tsunami: tsunamiFilter }),
    };
    dispatch(fetchEarthquakes(params));
  }, [dispatch, page, limit, sortField, sortOrder, debouncedSearch, magRange, statusFilter, alertFilter, tsunamiFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      dispatch(deleteEarthquake(deleteTarget._id)).then(() => {
        setDeleteTarget(null);
        loadData();
      });
    }
  };

  const clearFilters = () => {
    setMagRange([0, 10]);
    setStatusFilter('');
    setAlertFilter('');
    setTsunamiFilter('');
    setSearchInput('');
    setPage(1);
  };

  const columns = [
    {
      field: 'mag',
      headerName: 'Magnitude',
      sortable: true,
      renderCell: (row) => {
        const { value, color } = formatMagnitude(row.mag);
        return (
          <span className="font-display font-bold text-sm" style={{ color }}>
            M{value}
          </span>
        );
      },
    },
    {
      field: 'place',
      headerName: 'Location',
      sortable: true,
      renderCell: (row) => (
        <span className="text-[var(--color-text-primary)]">{truncateText(row.place, 45)}</span>
      ),
    },
    {
      field: 'time',
      headerName: 'Date & Time',
      sortable: true,
      renderCell: (row) => (
        <span className="text-[var(--color-text-secondary)] text-xs">{formatDate(row.time)}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => (
        <Chip
          label={row.status}
          size="small"
          sx={{
            fontSize: '0.65rem',
            fontWeight: 600,
            backgroundColor: row.status === 'reviewed' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
            color: row.status === 'reviewed' ? '#22c55e' : '#eab308',
            borderRadius: '0.5rem',
            height: 22,
          }}
        />
      ),
    },
    {
      field: 'alert',
      headerName: 'Alert',
      renderCell: (row) =>
        row.alert ? (
          <Chip
            label={row.alert}
            size="small"
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              backgroundColor: `${getAlertColor(row.alert)}18`,
              color: getAlertColor(row.alert),
              borderRadius: '0.5rem',
              height: 22,
              textTransform: 'capitalize',
            }}
          />
        ) : (
          <span className="text-xs text-[var(--color-text-muted)]">—</span>
        ),
    },
    {
      field: 'tsunami',
      headerName: 'Tsunami',
      renderCell: (row) =>
        row.tsunami ? (
          <span className="text-xs font-semibold text-blue-500">Yes</span>
        ) : (
          <span className="text-xs text-[var(--color-text-muted)]">No</span>
        ),
    },
  ];

  const tableActions = (row) => (
    <>
      <Tooltip title="View details">
        <IconButton size="small" onClick={() => navigate(`/earthquakes/${row._id}`)}
          sx={{ color: 'var(--color-text-muted)', '&:hover': { color: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)' } }}>
          <Eye size={15} />
        </IconButton>
      </Tooltip>
      {isAdmin && (
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
      )}
    </>
  );

  return (
    <>
      <Helmet>
        <title>Earthquakes – Global Earthquakes Dashboard</title>
        <meta name="description" content="Browse and manage global earthquake data with filters, search, and sorting." />
      </Helmet>

      <div className="space-y-5 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Earthquakes</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              {pagination.totalRecords?.toLocaleString() || 0} total events in database
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all
                ${showFilters
                  ? 'bg-primary-500/10 border-primary-500/30 text-primary-500'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
                }`}
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
            {isAdmin && (
              <button
                id="create-earthquake-btn"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm
                  font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25"
              >
                <Plus size={16} />
                Add Event
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        <Collapse in={showFilters}>
          <div className="glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Filter Options</p>
              <button onClick={clearFilters} className="text-xs text-primary-500 hover:text-primary-400 font-medium flex items-center gap-1">
                <X size={12} /> Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] mb-2 font-medium">
                  Magnitude Range: {magRange[0]} – {magRange[1]}
                </p>
                <Slider
                  value={magRange}
                  onChange={(_, v) => { setMagRange(v); setPage(1); }}
                  min={0} max={10} step={0.5}
                  sx={{ color: '#6366f1' }}
                />
              </div>
              <TextField
                select label="Status" size="small" value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                sx={{ '& .MuiInputBase-root': { borderRadius: '0.75rem', color: 'var(--color-text-primary)' }, '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' } }}
              >
                <MenuItem value="">All</MenuItem>
                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
              <TextField
                select label="Alert Level" size="small" value={alertFilter}
                onChange={(e) => { setAlertFilter(e.target.value); setPage(1); }}
                sx={{ '& .MuiInputBase-root': { borderRadius: '0.75rem', color: 'var(--color-text-primary)' }, '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' } }}
              >
                <MenuItem value="">All</MenuItem>
                {ALERT_LEVELS.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
              </TextField>
              <TextField
                select label="Tsunami" size="small" value={tsunamiFilter}
                onChange={(e) => { setTsunamiFilter(e.target.value); setPage(1); }}
                sx={{ '& .MuiInputBase-root': { borderRadius: '0.75rem', color: 'var(--color-text-primary)' }, '& .MuiInputLabel-root': { color: 'var(--color-text-secondary)' } }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
            </div>
          </div>
        </Collapse>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
          searchValue={searchInput}
          onSearchChange={(v) => { setSearchInput(v); setPage(1); }}
          searchPlaceholder="Search by location..."
          onRowClick={(row) => navigate(`/earthquakes/${row._id}`)}
          actions={tableActions}
          emptyTitle="No earthquakes found"
          emptyMessage="Try adjusting your filters or search query."
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Earthquake Event"
        actions={
          <>
            <button onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-[var(--color-text-secondary)] pt-2">
          Are you sure you want to delete <strong className="text-[var(--color-text-primary)]">{deleteTarget?.place}</strong>?
          This action will soft-delete the record.
        </p>
      </Modal>

      {/* Create / Edit Modal */}
      {(createOpen || editTarget) && (
        <EarthquakeFormModal
          open={createOpen || !!editTarget}
          onClose={() => { setCreateOpen(false); setEditTarget(null); }}
          editData={editTarget}
          onSuccess={loadData}
        />
      )}
    </>
  );
};

export default EarthquakeListPage;

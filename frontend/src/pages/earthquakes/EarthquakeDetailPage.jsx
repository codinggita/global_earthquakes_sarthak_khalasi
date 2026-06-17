import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Edit, Trash2, MapPin, Clock, Activity, Waves, AlertCircle, FileText } from 'lucide-react';
import { Chip } from '@mui/material';
import { fetchEarthquakeById, deleteEarthquake } from '../../features/earthquakes/earthquakeSlice';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import EarthquakeFormModal from './EarthquakeFormModal';
import ReportFormModal from '../reports/ReportFormModal';
import useAuth from '../../hooks/useAuth';
import { formatDate, formatMagnitude, formatCoordinates, getAlertColor, getMagnitudeLabel } from '../../utils/formatters';

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-[var(--color-border-light)] last:border-0">
    <span className="text-xs text-[var(--color-text-muted)] w-36 flex-shrink-0">{label}</span>
    <span className="text-sm text-[var(--color-text-primary)] font-medium text-right">{value || '—'}</span>
  </div>
);

const EarthquakeDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { selectedItem: eq, isLoading, error } = useSelector((s) => s.earthquakes);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEarthquakeById(id));
  }, [dispatch, id]);

  const handleDelete = () => {
    dispatch(deleteEarthquake(eq._id)).then(() => navigate('/earthquakes'));
  };

  if (isLoading) return (
    <div className="space-y-4"><SkeletonLoader type="chart" /><SkeletonLoader type="card" count={2} /></div>
  );
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchEarthquakeById(id))} />;
  if (!eq) return null;

  const { value: magVal, color: magColor } = formatMagnitude(eq.mag);

  return (
    <>
      <Helmet>
        <title>{eq.place || 'Earthquake'} – Global Earthquakes</title>
        <meta name="description" content={`Detailed information about ${eq.place}, magnitude ${eq.mag}.`} />
      </Helmet>

      <div className="space-y-5 animate-fade-in">
        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/earthquakes')}
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            <ArrowLeft size={16} />
            Back to Earthquakes
          </button>
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <button onClick={() => setReportOpen(true)} id="submit-report-btn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  bg-primary-500/10 text-primary-500 border border-primary-500/20 hover:bg-primary-500/20 transition-colors">
                <FileText size={15} />
                Submit Felt Report
              </button>
            )}
            {isAdmin && (
              <>
                <button onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                    border border-[var(--color-border)] text-[var(--color-text-secondary)]
                    hover:bg-[var(--color-surface-elevated)] transition-colors">
                  <Edit size={15} />
                  Edit
                </button>
                <button onClick={() => setDeleteOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                    border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={15} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hero Card */}
        <div className="glass-card p-6 gradient-border">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-2xl flex-shrink-0"
              style={{ backgroundColor: `${magColor}15`, color: magColor }}>
              M{magVal}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-2">
                {eq.title || eq.place}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Chip label={getMagnitudeLabel(eq.mag)} size="small"
                  sx={{ backgroundColor: `${magColor}15`, color: magColor, fontWeight: 700, fontSize: '0.7rem', borderRadius: '0.5rem' }} />
                {eq.status && (
                  <Chip label={eq.status} size="small"
                    sx={{ backgroundColor: eq.status === 'reviewed' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                      color: eq.status === 'reviewed' ? '#22c55e' : '#eab308', fontWeight: 600, fontSize: '0.7rem', borderRadius: '0.5rem' }} />
                )}
                {eq.alert && (
                  <Chip label={`${eq.alert} alert`} size="small"
                    sx={{ backgroundColor: `${getAlertColor(eq.alert)}18`, color: getAlertColor(eq.alert),
                      fontWeight: 600, fontSize: '0.7rem', borderRadius: '0.5rem', textTransform: 'capitalize' }} />
                )}
                {eq.tsunami && (
                  <Chip label="Tsunami Warning" size="small"
                    sx={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 700, fontSize: '0.7rem', borderRadius: '0.5rem' }} />
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary-400" />
                  {formatCoordinates(eq.geometry?.coordinates)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-primary-400" />
                  {formatDate(eq.time)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h2 className="text-sm font-display font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <Activity size={15} className="text-primary-500" />
              Seismic Properties
            </h2>
            <DetailRow label="Event ID" value={eq.eventId} />
            <DetailRow label="Magnitude" value={`${eq.mag} (${eq.magType || '—'})`} />
            <DetailRow label="Significance" value={eq.sig?.toLocaleString()} />
            <DetailRow label="CDI (Felt)" value={eq.cdi} />
            <DetailRow label="MMI (ShakeMap)" value={eq.mmi} />
            <DetailRow label="Felt Reports" value={eq.felt?.toLocaleString()} />
            <DetailRow label="RMS Error" value={eq.rms} />
            <DetailRow label="Gap" value={eq.gap ? `${eq.gap}°` : undefined} />
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-display font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <MapPin size={15} className="text-primary-500" />
              Location & Source
            </h2>
            <DetailRow label="Place" value={eq.place} />
            <DetailRow label="Coordinates" value={formatCoordinates(eq.geometry?.coordinates)} />
            <DetailRow label="Network" value={eq.net} />
            <DetailRow label="Code" value={eq.code} />
            <DetailRow label="Status" value={eq.status} />
            <DetailRow label="Time (UTC)" value={formatDate(eq.time)} />
            <DetailRow label="Updated" value={formatDate(eq.updated)} />
            <DetailRow label="Stations (NST)" value={eq.nst} />
          </div>
        </div>

        {/* External Link */}
        {eq.url && (
          <div className="glass-card p-4 flex items-center justify-between">
            <p className="text-sm text-[var(--color-text-secondary)]">View official USGS event page</p>
            <a href={eq.url} target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors">
              Open USGS →
            </a>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Delete"
        actions={
          <>
            <button onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 rounded-xl text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]">
              Cancel
            </button>
            <button onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600">
              Delete
            </button>
          </>
        }>
        <p className="text-sm text-[var(--color-text-secondary)] pt-2">
          Delete <strong>{eq.place}</strong>? This action cannot be undone.
        </p>
      </Modal>

      {editOpen && (
        <EarthquakeFormModal open={editOpen} onClose={() => setEditOpen(false)}
          editData={eq} onSuccess={() => dispatch(fetchEarthquakeById(id))} />
      )}

      {reportOpen && (
        <ReportFormModal open={reportOpen} onClose={() => setReportOpen(false)}
          defaultEarthquakeId={eq._id} defaultEarthquakeTitle={eq.place} />
      )}
    </>
  );
};

export default EarthquakeDetailPage;

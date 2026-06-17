import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Globe, Activity, AlertTriangle, Waves, TrendingUp, Star } from 'lucide-react';
import { fetchEarthquakes, fetchEarthquakeStats } from '../../features/earthquakes/earthquakeSlice';
import StatsCard from '../../components/common/StatsCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import ErrorState from '../../components/common/ErrorState';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import SeverityBarChart from '../../components/charts/SeverityBarChart';
import TsunamiPieChart from '../../components/charts/TsunamiPieChart';
import useAuth from '../../hooks/useAuth';
import { formatDate, formatMagnitude, truncateText } from '../../utils/formatters';

const DashboardHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, isAdmin } = useAuth();
  const { items, stats, isLoading, statsLoading, error } = useSelector((s) => s.earthquakes);

  useEffect(() => {
    dispatch(fetchEarthquakes({ limit: 5, sort: '-time' }));
    dispatch(fetchEarthquakeStats());
  }, [dispatch]);

  const summaryStats = useMemo(() => {
    if (!stats) return null;
    const total = (stats.severityTiers || []).reduce((s, t) => s + (t.count || 0), 0);
    const tsunamiCount = (stats.tsunamiRisk || []).find((t) => t.tsunamiTriggered)?.count || 0;
    const topEvent = (stats.topSignificantEvents || [])[0];
    return { total, tsunamiCount, topEvent };
  }, [stats]);

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <Helmet>
        <title>Dashboard – Global Earthquakes</title>
        <meta name="description" content="Seismic activity overview, analytics, and real-time earthquake monitoring dashboard." />
      </Helmet>

      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
              {getHour()}, {username}! 👋
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {isAdmin ? "Here's your admin overview of seismic activity." : "Here's your seismic monitoring overview."}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass-card text-xs text-[var(--color-text-secondary)]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live data from MongoDB
          </div>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonLoader key={i} type="stats" />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => dispatch(fetchEarthquakeStats())} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={Globe}
              label="Total Earthquakes"
              value={summaryStats?.total?.toLocaleString() || '—'}
              color="primary"
            />
            <StatsCard
              icon={Activity}
              label="Top Significance Score"
              value={summaryStats?.topEvent?.sig?.toLocaleString() || '—'}
              color="violet"
            />
            <StatsCard
              icon={Waves}
              label="Tsunami Events"
              value={summaryStats?.tsunamiCount?.toLocaleString() || '—'}
              color="blue"
            />
            <StatsCard
              icon={AlertTriangle}
              label="Highest Magnitude"
              value={summaryStats?.topEvent ? `M${summaryStats.topEvent.mag?.toFixed(1)}` : '—'}
              color="red"
            />
          </div>
        )}

        {/* Charts Row */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MonthlyTrendChart data={stats.monthlyTrends || []} />
            <SeverityBarChart data={stats.severityTiers || []} />
          </div>
        )}

        {/* Tsunami + Regional */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TsunamiPieChart data={stats.tsunamiRisk || []} />

            {/* Top Significant Events */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-primary-500" />
                <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)]">
                  Top Significant Events
                </h3>
              </div>
              <div className="space-y-3">
                {(stats.topSignificantEvents || []).map((eq, i) => {
                  const { value: magVal, color } = formatMagnitude(eq.mag);
                  return (
                    <button
                      key={eq._id || i}
                      onClick={() => navigate(`/earthquakes/${eq._id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-surface-elevated)]
                        transition-colors text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        M{magVal}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                          {truncateText(eq.place, 40)}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Sig: {eq.sig?.toLocaleString()} · {formatDate(eq.time, { hour: undefined, minute: undefined })}
                        </p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent Earthquakes */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)]">
              Recent Earthquakes
            </h3>
            <button
              onClick={() => navigate('/earthquakes')}
              className="text-xs text-primary-500 hover:text-primary-400 font-medium transition-colors"
            >
              View all →
            </button>
          </div>
          {isLoading ? (
            <SkeletonLoader type="table-row" count={5} />
          ) : (
            <div className="divide-y divide-[var(--color-border-light)]">
              {items.map((eq) => {
                const { value: magVal, color } = formatMagnitude(eq.mag);
                return (
                  <button
                    key={eq._id}
                    onClick={() => navigate(`/earthquakes/${eq._id}`)}
                    className="w-full flex items-center gap-4 py-3 hover:bg-[var(--color-surface-elevated)]
                      transition-colors rounded-lg px-2 text-left"
                  >
                    <span
                      className="font-display font-bold text-sm w-10 text-center flex-shrink-0"
                      style={{ color }}
                    >
                      M{magVal}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] font-medium truncate">
                        {eq.place}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {formatDate(eq.time)}
                      </p>
                    </div>
                    {eq.tsunami && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500 flex-shrink-0">
                        Tsunami
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardHome;

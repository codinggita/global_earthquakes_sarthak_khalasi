import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchEarthquakeStats } from '../../features/earthquakes/earthquakeSlice';
import SeverityBarChart from '../../components/charts/SeverityBarChart';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import TsunamiPieChart from '../../components/charts/TsunamiPieChart';
import RegionalChart from '../../components/charts/RegionalChart';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatMagnitude } from '../../utils/formatters';
import { TrendingUp, Award, Globe } from 'lucide-react';

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { stats, statsLoading, error } = useSelector((s) => s.earthquakes);

  useEffect(() => { dispatch(fetchEarthquakeStats()); }, [dispatch]);

  if (statsLoading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader type="chart" count={4} />
      </div>
    );
  }

  if (error && !stats) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchEarthquakeStats())} />;
  }

  const topEvents = stats?.topSignificantEvents || [];
  const total = (stats?.severityTiers || []).reduce((s, t) => s + (t.count || 0), 0);

  return (
    <>
      <Helmet>
        <title>Analytics – Global Earthquakes Dashboard</title>
        <meta name="description" content="Advanced seismic analytics: severity distributions, tsunami risk, regional frequencies, and monthly trends." />
      </Helmet>

      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Analytics</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            MongoDB aggregation-powered insights from {total.toLocaleString()} seismic events
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MonthlyTrendChart data={stats?.monthlyTrends || []} />
          <SeverityBarChart data={stats?.severityTiers || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TsunamiPieChart data={stats?.tsunamiRisk || []} />
          <RegionalChart data={stats?.regionalFrequencies || []} />
        </div>

        {/* Top Significant Events Table */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-primary-500" />
            <h2 className="text-sm font-display font-bold text-[var(--color-text-primary)]">
              Top 5 Most Significant Events
            </h2>
            <span className="ml-auto text-xs text-[var(--color-text-muted)]">Ranked by USGS significance score</span>
          </div>
          <div className="space-y-2">
            {topEvents.map((eq, i) => {
              const { value: magVal, color } = formatMagnitude(eq.mag);
              return (
                <div key={eq._id || i}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary-500/10 flex items-center justify-center
                    text-xs font-bold text-primary-500 flex-shrink-0">
                    #{i + 1}
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    M{magVal}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{eq.place}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{formatDate(eq.time, { hour: undefined, minute: undefined })}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <TrendingUp className="w-3 h-3 text-primary-400" />
                      <span className="text-sm font-bold text-primary-500">{eq.sig?.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)]">sig. score</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regional Frequencies Table */}
        {(stats?.regionalFrequencies || []).length > 0 && (
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary-500" />
              <h2 className="text-sm font-display font-bold text-[var(--color-text-primary)]">
                Regional Network Details
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    {['Network', 'Event Count', 'Max Magnitude', 'Avg Depth (km)'].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.regionalFrequencies.map((r, i) => (
                    <tr key={i} className="border-b border-[var(--color-border-light)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[var(--color-text-primary)]">{r.reportingNetwork}</td>
                      <td className="py-2.5 px-3 text-[var(--color-text-secondary)]">{r.eventCount?.toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <span style={{ color: formatMagnitude(r.maximumMagnitude).color }} className="font-bold">
                          M{r.maximumMagnitude?.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[var(--color-text-secondary)]">{r.averageDepthKm} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AnalyticsDashboard;

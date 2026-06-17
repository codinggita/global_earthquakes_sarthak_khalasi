import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd','#818cf8','#7c3aed','#9333ea','#a21caf','#6d28d9','#5b21b6'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="font-semibold text-[var(--color-text-primary)] mb-1">Network: {d.reportingNetwork}</p>
      <p className="text-[var(--color-text-secondary)]">Events: <span className="font-bold">{d.eventCount}</span></p>
      <p className="text-[var(--color-text-secondary)]">Max Mag: <span className="font-bold">{d.maximumMagnitude}</span></p>
      <p className="text-[var(--color-text-secondary)]">Avg Depth: <span className="font-bold">{d.averageDepthKm} km</span></p>
    </div>
  );
};

const RegionalChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    return data.slice(0, 10).map((d) => ({
      reportingNetwork: d.reportingNetwork || 'Unknown',
      eventCount: d.eventCount || 0,
      maximumMagnitude: d.maximumMagnitude || 0,
      averageDepthKm: d.averageDepthKm || 0,
    }));
  }, [data]);

  if (!chartData.length) return null;

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)] mb-4">
        Top 10 Regional Seismic Networks
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 30, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="reportingNetwork"
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="eventCount" radius={[6, 6, 0, 0]} barSize={28}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionalChart;

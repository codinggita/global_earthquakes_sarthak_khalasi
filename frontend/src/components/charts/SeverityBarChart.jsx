import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TIER_COLORS = {
  'Minor/Light (0 - 4.0)': '#22c55e',
  'Moderate (4.0 - 5.0)': '#eab308',
  'Strong (5.0 - 6.0)': '#f97316',
  'Major (6.0 - 7.0)': '#ef4444',
  'Great (7.0 - 10.0)': '#dc2626',
  'Extreme/Other': '#7c3aed',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="font-semibold text-[var(--color-text-primary)] mb-1">{d.tier}</p>
      <p className="text-[var(--color-text-secondary)]">Count: <span className="font-bold">{d.count}</span></p>
      <p className="text-[var(--color-text-secondary)]">Avg Mag: <span className="font-bold">{d.avgMagnitude}</span></p>
    </div>
  );
};

const SeverityBarChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      tier: d.tier || 'Unknown',
      count: d.count || 0,
      avgMagnitude: d.avgMagnitude || d.avgMag || 0,
    }));
  }, [data]);

  if (!chartData.length) return null;

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)] mb-4">
        Severity Distribution
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
          <YAxis
            type="category"
            dataKey="tier"
            width={140}
            tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={TIER_COLORS[entry.tier] || '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeverityBarChart;

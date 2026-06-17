import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getMonthName } from '../../utils/formatters';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="font-semibold text-[var(--color-text-primary)] mb-1">{d.label}</p>
      <p className="text-[var(--color-text-secondary)]">Events: <span className="font-bold text-primary-500">{d.eventCount}</span></p>
      <p className="text-[var(--color-text-secondary)]">Avg Mag: <span className="font-bold text-accent-500">{d.averageMagnitude}</span></p>
    </div>
  );
};

const MonthlyTrendChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .map((d) => ({
        label: `${getMonthName(d.month)} ${d.year}`,
        eventCount: d.eventCount || 0,
        averageMagnitude: d.averageMagnitude || 0,
      }));
  }, [data]);

  if (!chartData.length) return null;

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)] mb-4">
        Monthly Earthquake Trends
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="gradientCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="eventCount"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#gradientCount)"
            dot={{ r: 3, fill: '#6366f1' }}
            activeDot={{ r: 5, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;

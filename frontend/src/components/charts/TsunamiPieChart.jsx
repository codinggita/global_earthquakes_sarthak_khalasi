import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#22c55e', '#ef4444'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="font-semibold text-[var(--color-text-primary)] mb-1">{d.name}</p>
      <p className="text-[var(--color-text-secondary)]">Count: <span className="font-bold">{d.value}</span></p>
      <p className="text-[var(--color-text-secondary)]">Avg Mag: <span className="font-bold">{d.avgMagnitude}</span></p>
    </div>
  );
};

const TsunamiPieChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      name: d.tsunamiTriggered ? 'Tsunami Triggered' : 'No Tsunami',
      value: d.count || 0,
      avgMagnitude: d.avgMagnitude || 0,
    }));
  }, [data]);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  if (!chartData.length) return null;

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-display font-bold text-[var(--color-text-primary)] mb-4">
        Tsunami Risk Analysis
      </h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-3">
          {chartData.map((d, i) => {
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : 0;
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                    {d.name}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    {d.value.toLocaleString()} events ({pct}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TsunamiPieChart;

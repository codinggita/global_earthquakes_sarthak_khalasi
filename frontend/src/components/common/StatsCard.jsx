const StatsCard = ({ icon: Icon, label, value, trend, trendUp, color = 'primary', className = '' }) => {
  const colorMap = {
    primary: { bg: 'bg-primary-500/10', text: 'text-primary-500', border: 'border-primary-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className={`glass-card p-5 border ${c.border} ${className} animate-slide-up`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
          {Icon && <Icon className={`w-5 h-5 ${c.text}`} />}
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}
          >
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">{label}</p>
      <p className="text-2xl font-display font-bold text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
};

export default StatsCard;

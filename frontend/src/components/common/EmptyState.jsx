import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No data found', message = 'There is nothing to display here yet.', icon: Icon = Inbox, action, actionLabel = 'Add New' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="text-lg font-display font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] text-center max-w-sm mb-6">
        {message}
      </p>
      {action && (
        <button
          onClick={action}
          className="px-5 py-2.5 bg-gradient-primary text-white rounded-xl font-medium text-sm
            hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

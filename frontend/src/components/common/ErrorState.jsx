import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
        <AlertCircle className="w-10 h-10 text-red-400" />
      </div>
      <h3 className="text-lg font-display font-semibold text-[var(--color-text-primary)] mb-2">
        Error Loading Data
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] text-center max-w-sm mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-medium text-sm
            hover:bg-red-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;

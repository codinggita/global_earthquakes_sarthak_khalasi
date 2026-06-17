const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`rounded-2xl p-6 space-y-4 ${className}`}>
            <div className="shimmer h-4 w-1/3 rounded-lg" />
            <div className="shimmer h-8 w-2/3 rounded-lg" />
            <div className="shimmer h-3 w-1/2 rounded-lg" />
          </div>
        );
      case 'table-row':
        return (
          <div className={`flex items-center gap-4 p-4 ${className}`}>
            <div className="shimmer h-4 w-16 rounded" />
            <div className="shimmer h-4 w-32 rounded flex-1" />
            <div className="shimmer h-4 w-24 rounded" />
            <div className="shimmer h-4 w-20 rounded" />
            <div className="shimmer h-4 w-16 rounded" />
          </div>
        );
      case 'chart':
        return (
          <div className={`rounded-2xl p-6 space-y-4 ${className}`}>
            <div className="shimmer h-4 w-1/4 rounded-lg" />
            <div className="shimmer h-48 w-full rounded-xl" />
          </div>
        );
      case 'stats':
        return (
          <div className={`rounded-2xl p-6 space-y-3 ${className}`}>
            <div className="shimmer h-3 w-1/2 rounded" />
            <div className="shimmer h-10 w-2/3 rounded-lg" />
            <div className="shimmer h-3 w-1/3 rounded" />
          </div>
        );
      case 'page':
        return (
          <div className="space-y-6 p-6 w-full max-w-6xl mx-auto animate-pulse">
            <div className="shimmer h-8 w-48 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shimmer h-28 rounded-2xl" />
              ))}
            </div>
            <div className="shimmer h-64 rounded-2xl" />
          </div>
        );
      case 'profile':
        return (
          <div className={`flex items-center gap-4 ${className}`}>
            <div className="shimmer h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <div className="shimmer h-4 w-24 rounded" />
              <div className="shimmer h-3 w-32 rounded" />
            </div>
          </div>
        );
      default:
        return <div className={`shimmer h-4 w-full rounded ${className}`} />;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default SkeletonLoader;

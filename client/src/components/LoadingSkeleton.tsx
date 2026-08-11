interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="py-3 border-b border-zinc-800 animate-pulse">
          <div className="h-3.5 bg-zinc-800 rounded w-3/5 mb-2" />
          <div className="h-3 bg-zinc-800/60 rounded w-2/5" />
        </div>
      ))}
    </div>
  );
}

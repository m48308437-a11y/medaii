export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded-xl bg-white/5 shimmer ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

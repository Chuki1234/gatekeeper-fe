"use client";

export function HistorySkeleton() {
  return (
    <div className="animate-fade-in-up animation-delay-200 space-y-3">
      <div className="h-3 w-28 animate-pulse rounded bg-borderMain" />
      <div className="overflow-hidden rounded-xl border border-borderMain">
        <div className="border-b border-borderMain bg-borderLight px-4 py-2.5">
          <div className="flex gap-8">
            <div className="h-2.5 w-16 animate-pulse rounded bg-borderMain" />
            <div className="h-2.5 w-10 animate-pulse rounded bg-borderMain" />
            <div className="h-2.5 w-14 animate-pulse rounded bg-borderMain" />
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-8 border-b border-borderMain px-4 py-3 last:border-b-0"
          >
            <div className="h-3 w-32 animate-pulse rounded bg-borderMain" />
            <div className="h-3 w-10 animate-pulse rounded bg-borderMain" />
            <div className="h-3 w-14 animate-pulse rounded bg-borderMain" />
          </div>
        ))}
      </div>
    </div>
  );
}

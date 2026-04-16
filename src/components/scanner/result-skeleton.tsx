"use client";

export function ResultSkeleton() {
  return (
    <div className="animate-fade-in-up rounded-2xl border-2 border-borderMain bg-borderLight p-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-borderMain" />
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-borderMain" />
            <div className="h-4 w-48 animate-pulse rounded bg-borderMain" />
          </div>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white/50 px-3 py-1.5">
                <div className="h-2.5 w-10 animate-pulse rounded bg-borderMain mb-1" />
                <div className="h-3 w-14 animate-pulse rounded bg-borderMain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Clock, RefreshCw } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { HistoryTable } from "@/components/scanner/history-table";
import { HistorySkeleton } from "@/components/scanner/history-skeleton";
import { useHistory } from "@/hooks/use-history";

export default function HistoryPage() {
  const { history, loading, error, refresh } = useHistory();

  return (
    <div className="flex flex-col items-center pt-12 md:pt-16">
      <div className="w-full max-w-3xl space-y-8">
        <div className="animate-fade-in-up text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-charcoal">
            Scan History
          </h1>
          <p className="mt-2 text-sm text-charcoalMuted">
            All scans persisted in your database.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <SectionHeader icon={Clock} title="Timeline" />
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-lg border border-borderMain px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-charcoalMuted transition-colors hover:bg-borderLight hover:text-charcoal"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-300/40 bg-red-50 p-4 text-center">
            <p className="font-mono text-xs text-red-400">{error}</p>
          </div>
        )}

        {loading ? <HistorySkeleton /> : <HistoryTable history={history} />}

        {!loading && history.length === 0 && !error && (
          <div className="rounded-xl border border-borderMain bg-borderLight p-8 text-center">
            <p className="font-mono text-xs text-charcoalMuted">
              No scans yet. Go scan something!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

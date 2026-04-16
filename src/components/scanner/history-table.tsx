"use client";

import { ShieldCheck, ShieldAlert, ShieldX, FileIcon, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScanResult } from "@/services/api";

interface HistoryTableProps {
  history: ScanResult[];
}

const statusIcons = {
  clean: { icon: ShieldCheck, color: "text-neon" },
  suspicious: { icon: ShieldAlert, color: "text-yellow-600" },
  malicious: { icon: ShieldX, color: "text-red-500" },
} as const;

export function HistoryTable({ history }: HistoryTableProps) {
  if (history.length === 0) return null;

  return (
    <div className="animate-fade-in-up animation-delay-200 space-y-3">
      <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-charcoalMuted">
        Recent Scans
      </h3>

      <div className="overflow-hidden rounded-xl border border-borderMain">
        <table className="w-full">
          <thead>
            <tr className="border-b border-borderMain bg-borderLight">
              <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-charcoalMuted">
                Target
              </th>
              <th className="hidden px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-charcoalMuted sm:table-cell">
                Type
              </th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-charcoalMuted">
                Status
              </th>
              <th className="hidden px-4 py-2.5 text-right font-mono text-[10px] font-medium uppercase tracking-wider text-charcoalMuted sm:table-cell">
                Detections
              </th>
              <th className="hidden px-4 py-2.5 text-right font-mono text-[10px] font-medium uppercase tracking-wider text-charcoalMuted md:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => {
              const cfg = statusIcons[item.status];
              const StatusIcon = cfg.icon;
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "transition-colors hover:bg-borderLight",
                    i !== history.length - 1 && "border-b border-borderMain"
                  )}
                >
                  <td className="max-w-[200px] truncate px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.type === "file" ? (
                        <FileIcon className="h-3.5 w-3.5 shrink-0 text-charcoalMuted" />
                      ) : (
                        <Globe className="h-3.5 w-3.5 shrink-0 text-charcoalMuted" />
                      )}
                      <span className="truncate font-mono text-xs text-charcoal">
                        {item.target}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="rounded bg-borderLight px-2 py-0.5 font-mono text-[10px] uppercase text-charcoalMuted">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <StatusIcon
                        className={cn("h-3.5 w-3.5", cfg.color)}
                      />
                      <span className="font-mono text-xs capitalize text-charcoal">
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-right sm:table-cell">
                    <span className="font-mono text-xs text-charcoalMuted">
                      {item.detections}/{item.totalEngines}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-right md:table-cell">
                    <span className="font-mono text-[10px] text-charcoalMuted">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

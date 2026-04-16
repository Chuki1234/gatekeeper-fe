"use client";

import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScanResult } from "@/services/api";

interface ResultCardsProps {
  result: ScanResult;
}

const statusConfig = {
  clean: {
    icon: ShieldCheck,
    label: "Clean",
    color: "text-neon",
    bg: "bg-neonGhost",
    border: "border-neon/30",
  },
  suspicious: {
    icon: ShieldAlert,
    label: "Suspicious",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  malicious: {
    icon: ShieldX,
    label: "Malicious",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
} as const;

export function ResultCards({ result }: ResultCardsProps) {
  const config = statusConfig[result.status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "animate-fade-in-up rounded-2xl border-2 p-6",
        config.border,
        config.bg
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            config.bg
          )}
        >
          <Icon className={cn("h-6 w-6", config.color)} />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                  config.color,
                  config.bg
                )}
              >
                {config.label}
              </span>
              <span className="font-mono text-[10px] text-charcoalMuted">
                {result.detections}/{result.totalEngines} engines
              </span>
            </div>
            <p className="mt-1.5 truncate text-sm font-medium text-charcoal">
              {result.target}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Stat label="Type" value={result.type.toUpperCase()} />
            <Stat label="Detection Rate" value={`${result.score}%`} />
            {result.typeDescription && (
              <Stat label="File Type" value={result.typeDescription} />
            )}
            <Stat
              label="Scanned"
              value={new Date(result.timestamp).toLocaleTimeString()}
            />
            {result.source && (
              <Stat
                label="Source"
                value={result.source === "cache" ? "Cached" : "New Scan"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/50 px-3 py-1.5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-charcoalMuted">
        {label}
      </p>
      <p className="font-mono text-xs font-medium text-charcoal">{value}</p>
    </div>
  );
}

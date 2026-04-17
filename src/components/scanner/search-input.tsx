"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  isScanning: boolean;
  onSearch: (query: string) => void;
}

export function SearchInput({ isScanning, onSearch }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const normalized = query.trim();
    setError(null);

    if (!normalized) {
      setError("Please enter a hash, domain, IP, or URL");
      return;
    }

    onSearch(normalized);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "group flex items-center gap-3 rounded-lg border bg-white px-4 py-3 transition-all",
          error
            ? "border-red-300/60"
            : "border-borderMain focus-within:border-neon focus-within:ring-1 focus-within:ring-neon",
        )}
      >
        <Search
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            error ? "text-red-400" : "text-charcoalMuted group-focus-within:text-neon",
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Search hash, IP, domain, or URL"
          className="flex-1 bg-transparent font-mono text-sm text-charcoal placeholder:text-charcoalMuted/50 focus:outline-none"
          disabled={isScanning}
        />
        {query && !isScanning && (
          <button
            onClick={() => {
              setQuery("");
              setError(null);
            }}
            className="font-mono text-xs text-charcoalMuted hover:text-charcoal transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {error && <p className="text-center font-mono text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isScanning || !query.trim()}
        className="w-full rounded-lg bg-neon px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-neon/90 disabled:opacity-50"
      >
        {isScanning ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-mono text-xs">Fetching intelligence...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Search className="h-4 w-4" />
            <span className="font-mono text-xs">Search</span>
          </span>
        )}
      </button>
    </div>
  );
}

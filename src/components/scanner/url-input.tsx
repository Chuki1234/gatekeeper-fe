"use client";

import { useState } from "react";
import { Globe, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlInputProps {
  isScanning: boolean;
  onScan: (url: string) => void;
}

export function UrlInput({ isScanning, onScan }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError("Invalid URL format");
      return;
    }

    onScan(normalizedUrl);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "group flex items-center gap-3 rounded-lg border bg-white px-4 py-3 transition-all",
          error
            ? "border-red-300/60"
            : "border-borderMain focus-within:border-neon focus-within:ring-1 focus-within:ring-neon"
        )}
      >
        <Globe
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            error ? "text-red-400" : "text-charcoalMuted group-focus-within:text-neon"
          )}
        />
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter URL to scan (e.g. https://example.com)"
          className="flex-1 bg-transparent font-mono text-sm text-charcoal placeholder:text-charcoalMuted/50 focus:outline-none"
          disabled={isScanning}
        />
        {url && !isScanning && (
          <button
            onClick={() => {
              setUrl("");
              setError(null);
            }}
            className="font-mono text-xs text-charcoalMuted hover:text-charcoal transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <p className="text-center font-mono text-xs text-red-400">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isScanning || !url.trim()}
        className="w-full bg-charcoal text-white font-medium px-6 py-3 rounded-lg text-sm hover:bg-charcoalLight transition-colors disabled:opacity-50"
      >
        {isScanning ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-mono text-xs">Analyzing with VirusTotal...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Search className="h-4 w-4" />
            <span className="font-mono text-xs">Scan URL</span>
          </span>
        )}
      </button>
    </div>
  );
}

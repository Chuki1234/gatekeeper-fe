"use client";

import { useRef } from "react";
import { Upload, FileIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_FILE_SIZE_MB } from "@/lib/constants";

interface FileDropzoneProps {
  file: File | null;
  error: string | null;
  isDragging: boolean;
  isScanning: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onScan: () => void;
}

export function FileDropzone({
  file,
  error,
  isDragging,
  isScanning,
  onDrop,
  onDragOver,
  onDragLeave,
  onInputChange,
  onClear,
  onScan,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e);
    // Auto-trigger scan after a tick so the file state settles
    setTimeout(() => onScan(), 50);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !file && inputRef.current?.click()}
        className={cn(
          "group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300",
          isDragging
            ? "border-neon bg-neonGhostMid shadow-[0_0_30px_rgba(57,255,20,0.12)]"
            : "border-borderMain bg-cream hover:border-neon/40 hover:bg-neonGhost",
          file && "cursor-default border-neon/30 bg-neonGhost",
          error && "border-destructive/40 bg-destructive/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={onInputChange}
          className="hidden"
          accept="*/*"
        />

        {!file ? (
          <div className="flex flex-col items-center gap-3 p-8">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-300",
                isDragging
                  ? "border-neon/40 bg-neonGhostMid shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                  : "border-borderMain bg-borderLight group-hover:border-neon/30 group-hover:bg-neonGhost"
              )}
            >
              <Upload
                className={cn(
                  "h-6 w-6 transition-colors",
                  isDragging ? "text-neon" : "text-charcoalMuted group-hover:text-neon"
                )}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-charcoal">
                {isDragging ? "Drop your file here" : "Drag & drop a file to scan"}
              </p>
              <p className="mt-1 font-mono text-xs text-charcoalMuted">
                or click to browse &middot; max {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neon/30 bg-neonGhost">
              <FileIcon className="h-5 w-5 text-neon" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-charcoal">
                {file.name}
              </p>
              <p className="font-mono text-xs text-charcoalMuted">
                {formatSize(file.size)}
              </p>
            </div>
            {!isScanning && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-charcoalMuted transition-colors hover:bg-borderLight hover:text-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-center font-mono text-xs text-red-400">{error}</p>
      )}

      {file && (
        <button
          onClick={onScan}
          disabled={isScanning}
          className="w-full bg-charcoal text-white font-medium px-6 py-3 rounded-lg text-sm hover:bg-charcoalLight transition-colors disabled:opacity-50"
        >
          {isScanning ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="font-mono text-xs">Analyzing with VirusTotal...</span>
            </span>
          ) : (
            <span className="font-mono text-xs">Scan File</span>
          )}
        </button>
      )}
    </div>
  );
}

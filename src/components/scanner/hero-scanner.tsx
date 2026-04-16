"use client";

import { FileIcon, Globe, Shield } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileDropzone } from "./file-dropzone";
import { UrlInput } from "./url-input";
import { ResultCards } from "./result-cards";
import { ResultSkeleton } from "./result-skeleton";
import { HistoryTable } from "./history-table";
import { HistorySkeleton } from "./history-skeleton";
import { SectionHeader } from "@/components/shared/section-header";
import { useFileHandler } from "@/hooks/use-file-handler";
import { useScanner } from "@/hooks/use-scanner";
import { useHistory } from "@/hooks/use-history";
import { SCAN_STATUSES } from "@/lib/constants";

export function HeroScanner() {
  const historyHook = useHistory();
  const fileHandler = useFileHandler();
  const scanner = useScanner(() => {
    historyHook.refresh();
  });

  const isScanning =
    scanner.status === SCAN_STATUSES.UPLOADING ||
    scanner.status === SCAN_STATUSES.SCANNING;

  const handleFileScan = async () => {
    if (!fileHandler.file) return;
    const result = await scanner.performFileScan(fileHandler.file);
    if (result) {
      toast.success(
        result.status === "clean"
          ? `${result.target} is clean — 0 detections`
          : `${result.target} flagged — ${result.detections}/${result.totalEngines} engines`,
      );
    }
  };

  const handleUrlScan = async (url: string) => {
    const result = await scanner.performUrlScan(url);
    if (result) {
      toast.success(
        result.status === "clean"
          ? `${result.target} is clean — 0 detections`
          : `${result.target} flagged — ${result.detections}/${result.totalEngines} engines`,
      );
    }
  };

  return (
    <section className="pb-20">
      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-charcoal">
          Scan files & URLs
          <br />
          for threats
        </h1>
        <p className="mt-4 text-sm text-charcoalMuted leading-relaxed max-w-lg mx-auto">
          Upload a suspicious file or enter a URL to check it against multiple
          security engines. Fast, private, and thorough.
        </p>
      </div>

      <SectionHeader icon={Shield} title="Scanner" />

      <div className="animate-fade-in-up animation-delay-100 space-y-10">
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="mx-auto grid h-11 w-full max-w-xs grid-cols-2 rounded-xl bg-borderLight p-1">
            <TabsTrigger
              value="file"
              className="flex items-center gap-2 rounded-lg font-mono text-xs data-active:bg-charcoal data-active:text-cream data-active:shadow-sm"
            >
              <FileIcon className="h-3.5 w-3.5" />
              File
            </TabsTrigger>
            <TabsTrigger
              value="url"
              className="flex items-center gap-2 rounded-lg font-mono text-xs data-active:bg-charcoal data-active:text-cream data-active:shadow-sm"
            >
              <Globe className="h-3.5 w-3.5" />
              URL
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="file">
              <FileDropzone
                file={fileHandler.file}
                error={fileHandler.error}
                isDragging={fileHandler.isDragging}
                isScanning={isScanning}
                onDrop={fileHandler.handleDrop}
                onDragOver={fileHandler.handleDragOver}
                onDragLeave={fileHandler.handleDragLeave}
                onInputChange={fileHandler.handleInputChange}
                onClear={() => {
                  fileHandler.clearFile();
                  scanner.reset();
                }}
                onScan={handleFileScan}
              />
            </TabsContent>

            <TabsContent value="url">
              <UrlInput isScanning={isScanning} onScan={handleUrlScan} />
            </TabsContent>
          </div>
        </Tabs>

        {isScanning && <ResultSkeleton />}

        {scanner.result && !isScanning && <ResultCards result={scanner.result} />}

        {scanner.error && (
          <div className="animate-fade-in-up rounded-xl border border-red-300/40 bg-red-50 p-4 text-center">
            <p className="font-mono text-xs text-red-400">{scanner.error}</p>
          </div>
        )}

        {historyHook.loading ? (
          <HistorySkeleton />
        ) : (
          <HistoryTable history={historyHook.history} />
        )}
      </div>
    </section>
  );
}

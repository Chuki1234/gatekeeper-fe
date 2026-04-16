"use client";

import { useState, useCallback } from "react";
import {
  scanFile as apiScanFile,
  scanUrl as apiScanUrl,
  type ScanResult,
} from "@/services/api";
import { type ScanStatus, SCAN_STATUSES } from "@/lib/constants";

interface ScannerState {
  status: ScanStatus;
  result: ScanResult | null;
  error: string | null;
}

export type { ScanResult };

export function useScanner(onScanComplete?: () => void) {
  const [state, setState] = useState<ScannerState>({
    status: SCAN_STATUSES.IDLE,
    result: null,
    error: null,
  });

  const performFileScan = useCallback(
    async (file: File) => {
      setState({ status: SCAN_STATUSES.UPLOADING, error: null, result: null });

      try {
        setState((prev) => ({ ...prev, status: SCAN_STATUSES.SCANNING }));
        const result = await apiScanFile(file);

        setState({ status: SCAN_STATUSES.COMPLETE, result, error: null });
        onScanComplete?.();
        return result;
      } catch (err) {
        const message = extractErrorMessage(err);
        setState((prev) => ({ ...prev, status: SCAN_STATUSES.ERROR, error: message }));
        return null;
      }
    },
    [onScanComplete]
  );

  const performUrlScan = useCallback(
    async (url: string) => {
      setState({ status: SCAN_STATUSES.SCANNING, error: null, result: null });

      try {
        const result = await apiScanUrl(url);

        setState({ status: SCAN_STATUSES.COMPLETE, result, error: null });
        onScanComplete?.();
        return result;
      } catch (err) {
        const message = extractErrorMessage(err);
        setState((prev) => ({ ...prev, status: SCAN_STATUSES.ERROR, error: message }));
        return null;
      }
    },
    [onScanComplete]
  );

  const reset = useCallback(() => {
    setState({ status: SCAN_STATUSES.IDLE, result: null, error: null });
  }, []);

  return { ...state, performFileScan, performUrlScan, reset };
}

function extractErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    if (axiosErr.response?.data?.error) return axiosErr.response.data.error;
  }
  if (err instanceof Error) return err.message;
  return "Scan failed. Please try again.";
}

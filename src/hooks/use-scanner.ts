"use client";

import { useState, useCallback } from "react";
import {
  scanFile as apiScanFile,
  scanUrl as apiScanUrl,
  searchIntelligence as apiSearchIntelligence,
  type ScanResult,
} from "@/services/api";
import { type ScanStatus, SCAN_STATUSES } from "@/lib/constants";

interface ScannerState {
  status: ScanStatus;
  result: ScanResult | null;
  error: string | null;
  noResults: boolean;
}

export type { ScanResult };

export function useScanner(onScanComplete?: () => void) {
  const [state, setState] = useState<ScannerState>({
    status: SCAN_STATUSES.IDLE,
    result: null,
    error: null,
    noResults: false,
  });

  const performFileScan = useCallback(
    async (file: File) => {
      setState({ status: SCAN_STATUSES.UPLOADING, error: null, result: null, noResults: false });

      try {
        setState((prev) => ({ ...prev, status: SCAN_STATUSES.SCANNING }));
        const result = await apiScanFile(file);

        setState({ status: SCAN_STATUSES.COMPLETE, result, error: null, noResults: false });
        onScanComplete?.();
        return result;
      } catch (err) {
        const info = extractErrorInfo(err);
        setState((prev) => ({
          ...prev,
          status: SCAN_STATUSES.ERROR,
          error: info.message,
          noResults: info.statusCode === 404,
        }));
        return null;
      }
    },
    [onScanComplete]
  );

  const performUrlScan = useCallback(
    async (url: string) => {
      setState({ status: SCAN_STATUSES.SCANNING, error: null, result: null, noResults: false });

      try {
        const result = await apiScanUrl(url);

        setState({ status: SCAN_STATUSES.COMPLETE, result, error: null, noResults: false });
        onScanComplete?.();
        return result;
      } catch (err) {
        const info = extractErrorInfo(err);
        setState((prev) => ({
          ...prev,
          status: SCAN_STATUSES.ERROR,
          error: info.message,
          noResults: info.statusCode === 404,
        }));
        return null;
      }
    },
    [onScanComplete]
  );

  const performSearchQuery = useCallback(
    async (query: string) => {
      setState({ status: SCAN_STATUSES.SCANNING, error: null, result: null, noResults: false });

      try {
        const result = await apiSearchIntelligence(query);

        setState({ status: SCAN_STATUSES.COMPLETE, result, error: null, noResults: false });
        onScanComplete?.();
        return result;
      } catch (err) {
        const info = extractErrorInfo(err);
        setState((prev) => ({
          ...prev,
          status: SCAN_STATUSES.ERROR,
          error: info.message,
          noResults: info.statusCode === 404,
        }));
        return null;
      }
    },
    [onScanComplete]
  );

  const reset = useCallback(() => {
    setState({ status: SCAN_STATUSES.IDLE, result: null, error: null, noResults: false });
  }, []);

  return { ...state, performFileScan, performUrlScan, performSearchQuery, reset };
}

function extractErrorInfo(err: unknown): { message: string; statusCode?: number } {
  if (typeof err === "object" && err !== null && "response" in err) {
    const axiosErr = err as { response?: { status?: number; data?: { error?: string } } };
    if (axiosErr.response?.data?.error) {
      return { message: axiosErr.response.data.error, statusCode: axiosErr.response.status };
    }
  }
  if (err instanceof Error) return { message: err.message };
  return { message: "Scan failed. Please try again." };
}

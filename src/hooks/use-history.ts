"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchHistory, type ScanResult } from "@/services/api";

export function useHistory() {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchHistory();
      setHistory(data);
    } catch {
      setError("Failed to load scan history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { history, loading, error, refresh };
}

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 300_000,
});

// TODO: Re-enable when integrating with CafeToolbox login
// client.interceptors.request.use(async (config) => {
//   const token = await getSessionToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// ─── Types matching the backend response shape ────────────

export interface ScanStats {
  total_engines: number;
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  positive_hits: number;
}

export interface FileScanResult {
  scan_id: string;
  file_name: string;
  file_hash: string;
  scan_date: string;
  stats: ScanStats;
  status: "clean" | "danger";
  reputation: number | null;
  type_description: string | null;
  source: "cache" | "new_scan";
}

export interface UrlScanResult {
  scan_id: string;
  url: string;
  scan_date: string;
  stats: ScanStats;
  status: "clean" | "danger";
  categories: Record<string, string>;
  source: "cache" | "new_scan";
}

export interface AnalysisResult {
  analysis_id: string;
  status: "queued" | "completed" | string;
  stats: Record<string, number>;
  date: string;
}

export interface HistoryRecord {
  id: string;
  target_type: "file" | "url";
  target_name: string;
  target_hash: string | null;
  stats: ScanStats;
  verdict: "clean" | "suspicious" | "malicious" | "scanning";
  analysis_id: string | null;
  created_at: string;
}

// ─── Unified ScanResult for the UI ───────────────────────

export interface ScanResult {
  id: string;
  type: "file" | "url";
  target: string;
  status: "clean" | "malicious" | "suspicious";
  score: number;
  detections: number;
  totalEngines: number;
  timestamp: string;
  typeDescription?: string | null;
  reputation?: number | null;
  source?: "cache" | "new_scan";
}

function mapFileResult(r: FileScanResult): ScanResult {
  const { stats } = r;
  const detections = stats.positive_hits;
  const total = stats.total_engines || 1;
  return {
    id: r.scan_id,
    type: "file",
    target: r.file_name,
    status: detections > 3 ? "malicious" : detections > 0 ? "suspicious" : "clean",
    score: Math.round((detections / total) * 100),
    detections,
    totalEngines: stats.total_engines,
    timestamp: r.scan_date,
    typeDescription: r.type_description,
    reputation: r.reputation,
    source: r.source,
  };
}

function mapUrlResult(r: UrlScanResult): ScanResult {
  const { stats } = r;
  const detections = stats.positive_hits;
  const total = stats.total_engines || 1;
  return {
    id: r.scan_id,
    type: "url",
    target: r.url,
    status: detections > 3 ? "malicious" : detections > 0 ? "suspicious" : "clean",
    score: Math.round((detections / total) * 100),
    detections,
    totalEngines: stats.total_engines,
    timestamp: r.scan_date,
    source: r.source,
  };
}

export function mapHistoryRecord(r: HistoryRecord): ScanResult {
  const stats = r.stats;
  const detections = stats?.positive_hits ?? 0;
  const total = stats?.total_engines || 1;
  return {
    id: r.id,
    type: r.target_type,
    target: r.target_name,
    status: r.verdict === "scanning" ? "clean" : r.verdict,
    score: Math.round((detections / total) * 100),
    detections,
    totalEngines: stats?.total_engines ?? 0,
    timestamp: r.created_at,
  };
}

// ─── API calls ────────────────────────────────────────────

export async function scanFile(file: File): Promise<ScanResult> {
  const form = new FormData();
  form.append("file", file);

  const { data } = await client.post<FileScanResult>("/api/scan/file", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return mapFileResult(data);
}

export async function scanUrl(url: string): Promise<ScanResult> {
  const { data } = await client.post<UrlScanResult>("/api/scan/url", { url });
  return mapUrlResult(data);
}

export async function getAnalysis(analysisId: string): Promise<AnalysisResult> {
  const { data } = await client.get<AnalysisResult>(`/api/scan/analysis/${analysisId}`);
  return data;
}

export async function getReport(scanId: string): Promise<HistoryRecord> {
  const { data } = await client.get<HistoryRecord>(`/api/scan/report/${scanId}`);
  return data;
}

export async function fetchHistory(): Promise<ScanResult[]> {
  const { data } = await client.get<HistoryRecord[]>("/api/scan/history");
  return (data ?? []).map(mapHistoryRecord);
}

export async function healthCheck(): Promise<boolean> {
  try {
    await client.get("/api/health");
    return true;
  } catch {
    return false;
  }
}

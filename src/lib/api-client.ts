import { MAX_FILE_SIZE_BYTES } from "./constants";

export interface ScanResult {
  id: string;
  type: "file" | "url";
  target: string;
  status: "clean" | "malicious" | "suspicious" | "error";
  score: number;
  detections: number;
  totalEngines: number;
  timestamp: string;
  details?: string;
}

export async function scanFile(file: File): Promise<ScanResult> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File exceeds maximum size of ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`);
  }

  await delay(2000);

  return mockScanResult("file", file.name);
}

export async function scanUrl(url: string): Promise<ScanResult> {
  if (!isValidUrl(url)) {
    throw new Error("Invalid URL format");
  }

  await delay(1500);

  return mockScanResult("url", url);
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockScanResult(
  type: "file" | "url",
  target: string
): ScanResult {
  const totalEngines = 72;
  const detections = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
  const score = detections === 0 ? 0 : Math.round((detections / totalEngines) * 100);

  let status: ScanResult["status"] = "clean";
  if (detections > 3) status = "malicious";
  else if (detections > 0) status = "suspicious";

  return {
    id: crypto.randomUUID(),
    type,
    target,
    status,
    score,
    detections,
    totalEngines,
    timestamp: new Date().toISOString(),
  };
}

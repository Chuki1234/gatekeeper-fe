export const SITE_NAME = "Gatekeeper";
export const SITE_DESCRIPTION =
  "Virus & URL Scanner — detect threats before they reach you.";

export const GITHUB_URL = "https://github.com/example/gatekeeper";

export const NAV_LINKS = [
  { label: "Scanner", href: "/" },
  { label: "History", href: "/history" },
  { label: "API", href: "/api-docs" },
  { label: "About", href: "/about" },
] as const;

export const MAX_FILE_SIZE_MB = 650;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/x-msdownload",
  "application/octet-stream",
  "application/vnd.microsoft.portable-executable",
  "text/plain",
  "text/html",
  "text/javascript",
  "application/javascript",
] as const;

export const SCAN_STATUSES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  SCANNING: "scanning",
  COMPLETE: "complete",
  ERROR: "error",
} as const;

export type ScanStatus = (typeof SCAN_STATUSES)[keyof typeof SCAN_STATUSES];

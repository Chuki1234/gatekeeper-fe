/**
 * Transform raw VirusTotal file-report JSON into a clean,
 * frontend-friendly shape aligned with the CafeToolbox design metrics.
 */
function formatFileReport(vtData, originalName) {
  const attrs = vtData.data?.attributes ?? {};
  const stats = attrs.last_analysis_stats ?? {};

  const malicious = stats.malicious ?? 0;
  const suspicious = stats.suspicious ?? 0;
  const harmless = stats.harmless ?? 0;
  const undetected = stats.undetected ?? 0;
  const totalEngines = malicious + suspicious + harmless + undetected
    + (stats.timeout ?? 0) + (stats['confirmed-timeout'] ?? 0)
    + (stats.failure ?? 0) + (stats['type-unsupported'] ?? 0);

  const positiveHits = malicious + suspicious;

  return {
    scan_id: vtData.data?.id ?? null,
    file_name: originalName ?? attrs.meaningful_name ?? attrs.names?.[0] ?? 'unknown',
    file_hash: attrs.sha256 ?? null,
    scan_date: attrs.last_analysis_date
      ? new Date(attrs.last_analysis_date * 1000).toISOString()
      : new Date().toISOString(),
    stats: {
      total_engines: totalEngines,
      malicious,
      suspicious,
      harmless,
      undetected,
      positive_hits: positiveHits,
    },
    status: positiveHits > 0 ? 'danger' : 'clean',
    reputation: attrs.reputation ?? null,
    type_description: attrs.type_description ?? null,
  };
}

/**
 * Transform raw VirusTotal URL-report JSON into a clean shape.
 */
function formatUrlReport(vtData, originalUrl) {
  const attrs = vtData.data?.attributes ?? {};
  const stats = attrs.last_analysis_stats ?? {};

  const malicious = stats.malicious ?? 0;
  const suspicious = stats.suspicious ?? 0;
  const harmless = stats.harmless ?? 0;
  const undetected = stats.undetected ?? 0;
  const totalEngines = malicious + suspicious + harmless + undetected
    + (stats.timeout ?? 0);

  const positiveHits = malicious + suspicious;

  return {
    scan_id: vtData.data?.id ?? null,
    url: originalUrl ?? attrs.url ?? null,
    scan_date: attrs.last_analysis_date
      ? new Date(attrs.last_analysis_date * 1000).toISOString()
      : new Date().toISOString(),
    stats: {
      total_engines: totalEngines,
      malicious,
      suspicious,
      harmless,
      undetected,
      positive_hits: positiveHits,
    },
    status: positiveHits > 0 ? 'danger' : 'clean',
    categories: attrs.categories ?? {},
  };
}

/**
 * Transform a VirusTotal analysis object (returned after submitting
 * a new file/URL) into a lightweight polling-friendly shape.
 */
function formatAnalysis(vtData) {
  const attrs = vtData.data?.attributes ?? {};
  const stats = attrs.stats ?? {};

  return {
    analysis_id: vtData.data?.id ?? null,
    status: attrs.status ?? 'queued',
    stats: stats,
    date: attrs.date
      ? new Date(attrs.date * 1000).toISOString()
      : new Date().toISOString(),
  };
}

module.exports = { formatFileReport, formatUrlReport, formatAnalysis };

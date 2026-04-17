/**
 * Central error-handling middleware.
 * Must be registered AFTER all routes.
 */
function errorHandler(err, _req, res, _next) {
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  if (err.isAxiosError) {
    const status = err.response?.status ?? 502;
    const vtMessage = err.response?.data?.error?.message;
    return res.status(status).json({
      error: vtMessage ?? 'VirusTotal API request failed',
      detail: err.message,
    });
  }

  console.error('[Gatekeeper Error]', err);

  const status = err.status ?? err.statusCode ?? 500;
  res.status(status).json({
    error: err.message ?? 'Internal server error',
  });
}

module.exports = errorHandler;

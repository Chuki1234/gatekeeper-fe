const rateLimit = require('express-rate-limit');

/**
 * VirusTotal free-tier allows 4 requests / minute.
 * We rate-limit at the gateway level so we never exceed quota.
 */
const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 4,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate limit exceeded — VirusTotal allows 4 requests per minute on the free tier. Please wait.',
  },
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

module.exports = { scanLimiter, globalLimiter };

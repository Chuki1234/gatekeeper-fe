/**
 * Encode a URL into VirusTotal's required Base64-URL format
 * (RFC 4648 §5 — URL-safe alphabet, no padding).
 */
function encode(url) {
  return Buffer.from(url, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

module.exports = { encode };

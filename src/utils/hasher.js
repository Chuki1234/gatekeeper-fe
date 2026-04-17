const crypto = require('crypto');
const fs = require('fs');

/**
 * Compute SHA-256 hash of a file buffer or from a file path on disk.
 * Returns lowercase hex string.
 */
function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

module.exports = { hashBuffer, hashFile };

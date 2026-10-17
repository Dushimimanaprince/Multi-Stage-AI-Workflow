/**
 * Security middleware enforcing headers and latency tracking
 * Satisfies Quality Gate Criteria from specs/service-contract.json
 */
export function applySecurityHeaders(req, res) {
  // Required security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // CORS and modern security best-practices
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Latency tracking
  const start = process.hrtime.bigint();
  const originalEnd = res.end;

  res.end = function (...args) {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    try {
      res.setHeader('X-Response-Time-Ms', durationMs.toFixed(2));
    } catch {
      // Headers already flushed
    }
    return originalEnd.apply(this, args);
  };
}

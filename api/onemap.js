/**
 * OneMap Search API handler
 * Handles requests to /api/GET https://www.onemap.gov.sg/api/common/elastic/search?searchVal=178903&returnGeom=Y&getAddrDetails=Y&pageNum=1
 * Guardrails: Reads process.env inside api/ only. Returns 503 "key not configured" if key is configured as empty.
 */

export default async function handler(req, res) {
  // If ONEMAP_API_KEY is configured as empty string in process.env, return 503
  if (process.env.ONEMAP_API_KEY !== undefined && process.env.ONEMAP_API_KEY.trim() === '') {
    if (typeof res.status === 'function') {
      res.status(503).send('key not configured');
    } else {
      res.statusCode = 503;
      res.end('key not configured');
    }
    return;
  }

  const searchVal = '178903';
  const targetUrl = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${searchVal}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'HOMESTYLER-RenovationPlatform/1.0',
  };

  if (process.env.ONEMAP_API_KEY && process.env.ONEMAP_API_KEY.trim() !== '') {
    headers['Authorization'] = process.env.ONEMAP_API_KEY.trim();
  }

  const controller = new AbortController();
  // 7 second timeout to catch slow responses
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      const status = response.status || 502;
      const payload = JSON.stringify({
        error: `OneMap service returned HTTP ${status}: ${response.statusText || 'upstream error'}`,
        details: errText,
      });

      if (typeof res.status === 'function') {
        res.status(status).setHeader('Content-Type', 'application/json').send(payload);
      } else {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(payload);
      }
      return;
    }

    const data = await response.json();
    const payload = JSON.stringify(data);

    if (typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.status(200).send(payload);
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.end(payload);
    }
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    const status = isTimeout ? 504 : 502;
    const errorMsg = isTimeout
      ? 'OneMap API connection is slow or timed out (exceeded 7s timeout limit)'
      : `Connection to OneMap API was refused or failed: ${err.message || 'Network error'}`;

    const payload = JSON.stringify({ error: errorMsg });

    if (typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      res.status(status).send(payload);
    } else {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.end(payload);
    }
  }
}

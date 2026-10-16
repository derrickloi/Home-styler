/**
 * Vercel Serverless Function: api/onemap.js
 * Fetches Singapore OneMap location data for postal code 178903 (or requested postal code) without any API key.
 */

export default async function handler(req, res) {
  let searchVal = '178903';
  if (req.query && req.query.searchVal) {
    searchVal = encodeURIComponent(String(req.query.searchVal).trim());
  } else if (req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      const q = parsedUrl.searchParams.get('searchVal');
      if (q) searchVal = encodeURIComponent(q.trim());
    } catch (_) {}
  }

  const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${searchVal}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      const status = response.status || 502;
      const payload = {
        error: `OneMap API returned status ${status}`,
        details: errText,
      };

      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(status).json(payload);
      } else if (typeof res.status === 'function') {
        res.setHeader('Content-Type', 'application/json');
        return res.status(status).send(JSON.stringify(payload));
      } else {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(payload));
      }
    }

    const data = await response.json();

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.status(200).json(data);
    } else if (typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.status(200).send(JSON.stringify(data));
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.end(JSON.stringify(data));
    }
  } catch (error) {
    const payload = {
      error: 'Failed to fetch from OneMap',
      message: error.message || 'Unknown network error',
    };

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(500).json(payload);
    } else if (typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).send(JSON.stringify(payload));
    } else {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(payload));
    }
  }
}

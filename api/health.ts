/**
 * Vercel Serverless Function: api/health.ts
 * Health check endpoint for uptime and service monitoring.
 */

export default function handler(req: any, res: any) {
  const payload = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(payload);
  } else if (typeof res.status === 'function') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(payload));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(payload));
  }
}

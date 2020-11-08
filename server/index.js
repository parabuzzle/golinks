const globalAgent = require('global-agent');
globalAgent.bootstrap();

const express = require('express');
const next = require('next');
const env = process.env.NODE_ENV || 'production';
const dev = env !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;
const promMid = require('express-prometheus-middleware');

(async () => {
  try {
    await app.prepare();
    const server = express();
    server.use(promMid({
      metricsPath: '/api/metrics',
      collectDefaultMetrics: true,
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
      extraMasks:['_next/static/*']
    }));
    server.all("*", (req, res) => {
      return handle(req, res);
    });
    server.listen(port, host, (err) => {
      if (err) throw err;
      console.log(`> Ready on ${host}:${port} - env ${env}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

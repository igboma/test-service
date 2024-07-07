const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: process.env.APP_NAME || 'Palindrome'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create a histogram metric
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.2, 0.5, 1, 2, 5, 10] // Define your buckets here
});

// Register the histogram
register.registerMetric(httpRequestDurationMicroseconds);

// Create a counter metric
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});

// Register the counter
register.registerMetric(httpRequestCounter);

// Middleware to record metrics
const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();

  res.on('finish', () => {
    const route = req.route ? req.route.path : 'unknown_route';
    const method = req.method;
    const statusCode = res.statusCode;

    end({ method, route, code: statusCode });
    httpRequestCounter.inc({ method, route, code: statusCode });
  });
  next();
};

module.exports = {
  metricsMiddleware,
  register,
};

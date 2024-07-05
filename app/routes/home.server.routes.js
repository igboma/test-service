let express = require("express");
let router = express.Router();

const metricsController = require("../controllers/metrics.server.controller");
const healthController = require("../controllers/health.server.controller");

router.get("/metrics", metricsController.metrics);
router.get("/health", healthController.healthCheck);

module.exports = router;

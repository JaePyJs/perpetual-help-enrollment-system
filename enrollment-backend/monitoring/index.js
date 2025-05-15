/**
 * Application Monitoring System
 * Provides health checks, performance monitoring, and error tracking
 */

const os = require("os");
const express = require("express");

// Use global config if available, otherwise use an empty config object
const config = global.config || require("../config");

// Monitoring state
let isMonitoringEnabled = false;
let metricsServer = null;
let healthCheckInterval = null;

// System metrics
const metrics = {
  startTime: Date.now(),
  requests: {
    total: 0,
    success: 0,
    error: 0,
    byEndpoint: {},
    byStatusCode: {},
  },
  performance: {
    responseTime: {
      avg: 0,
      min: Number.MAX_SAFE_INTEGER,
      max: 0,
      samples: [],
    },
    memory: {
      history: [],
    },
    cpu: {
      history: [],
    },
  },
  errors: {
    total: 0,
    byType: {},
  },
  users: {
    active: 0,
    sessions: 0,
  },
  students: {
    byGradYear: {}, // Track students by enrollment year (from ID format m[YY])
    byDepartment: {}, // Track students by department (from ID segments)
  },
};

/**
 * Initialize the monitoring system
 * @param {Object} app - Express application
 */
exports.init = function (app) {
  if (config.monitoring && config.monitoring.enabled) {
    isMonitoringEnabled = true;

    // Set up request tracking middleware
    app.use(requestTracker);

    // Set up health check endpoint
    if (
      config.monitoring.healthCheck &&
      config.monitoring.healthCheck.enabled
    ) {
      const healthCheckPath = config.monitoring.healthCheck.path || "/health";
      app.get(healthCheckPath, healthCheckHandler);

      // Start periodic health checks
      const interval = config.monitoring.healthCheck.interval || 60;
      healthCheckInterval = setInterval(runHealthCheck, interval * 1000);

      console.log(`Health check endpoint enabled at ${healthCheckPath}`);
    }

    // Set up Prometheus metrics server if enabled
    if (config.monitoring.prometheus && config.monitoring.prometheus.enabled) {
      setupPrometheusServer();
    }

    // Set up Sentry error tracking if configured
    if (config.monitoring.sentry && config.monitoring.sentry.dsn) {
      setupSentryErrorTracking();
    }

    // Start performance metrics collection
    const metricsInterval = config.monitoring.metrics?.interval || 60;
    setInterval(collectPerformanceMetrics, metricsInterval * 1000);

    console.log("Monitoring system initialized");
  } else {
    console.log("Monitoring system disabled");
  }
};

/**
 * Middleware to track request metrics
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function requestTracker(req, res, next) {
  if (!isMonitoringEnabled) {
    return next();
  }

  // Start timer
  const startTime = Date.now();

  // Track endpoint
  const endpoint = `${req.method} ${req.route?.path || req.path}`;
  metrics.requests.byEndpoint[endpoint] =
    (metrics.requests.byEndpoint[endpoint] || 0) + 1;

  // Track total requests
  metrics.requests.total++;

  // Track response
  const originalSend = res.send;
  res.send = function () {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Update response time metrics
    const samples = metrics.performance.responseTime.samples;
    samples.push(responseTime);

    // Keep only the last 100 samples
    if (samples.length > 100) {
      samples.shift();
    }

    // Update min/max
    metrics.performance.responseTime.min = Math.min(
      metrics.performance.responseTime.min,
      responseTime
    );
    metrics.performance.responseTime.max = Math.max(
      metrics.performance.responseTime.max,
      responseTime
    );

    // Calculate average
    const sum = samples.reduce((a, b) => a + b, 0);
    metrics.performance.responseTime.avg = sum / samples.length;

    // Track status code
    const statusCode = res.statusCode;
    metrics.requests.byStatusCode[statusCode] =
      (metrics.requests.byStatusCode[statusCode] || 0) + 1;

    // Track success/error
    if (statusCode >= 200 && statusCode < 400) {
      metrics.requests.success++;
    } else {
      metrics.requests.error++;
    }

    // Call original send
    return originalSend.apply(res, arguments);
  };

  next();
}

/**
 * Health check endpoint handler
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
function healthCheckHandler(req, res) {
  const healthCheck = runHealthCheck();

  // Return appropriate status code based on health
  if (healthCheck.status === "healthy") {
    res.status(200).json(healthCheck);
  } else {
    res.status(503).json(healthCheck);
  }
}

/**
 * Run a health check
 * @returns {Object} - Health check result
 */
function runHealthCheck() {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  const checks = [
    // Memory check
    {
      name: "memory",
      status: memoryUsage.heapUsed < 1024 * 1024 * 1024 ? "pass" : "warn", // Warning if heap > 1GB
      details: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        unit: "MB",
      },
    },

    // CPU check - warning if load average > 0.7 * cores
    {
      name: "cpu",
      status: os.loadavg()[0] < os.cpus().length * 0.7 ? "pass" : "warn",
      details: {
        loadAvg: os.loadavg(),
        cores: os.cpus().length,
      },
    },

    // Response time check
    {
      name: "responseTime",
      status: metrics.performance.responseTime.avg < 500 ? "pass" : "warn", // Warning if avg > 500ms
      details: {
        avg: Math.round(metrics.performance.responseTime.avg),
        min:
          metrics.performance.responseTime.min === Number.MAX_SAFE_INTEGER
            ? 0
            : metrics.performance.responseTime.min,
        max: metrics.performance.responseTime.max,
        unit: "ms",
      },
    },

    // Error rate check
    {
      name: "errorRate",
      status:
        metrics.requests.total === 0
          ? "pass"
          : metrics.requests.error / metrics.requests.total < 0.05
          ? "pass"
          : "warn", // Warning if error rate > 5%
      details: {
        total: metrics.requests.total,
        errors: metrics.requests.error,
        rate:
          metrics.requests.total === 0
            ? 0
            : (metrics.requests.error / metrics.requests.total).toFixed(4),
      },
    },
  ];

  // Overall status is worst of all checks
  let overallStatus = "healthy";
  if (checks.some((check) => check.status === "fail")) {
    overallStatus = "unhealthy";
  } else if (checks.some((check) => check.status === "warn")) {
    overallStatus = "degraded";
  }

  const healthCheck = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.round(uptime),
    checks: checks,
    environment: config.app.environment,
    version: config.app.version,
  };

  return healthCheck;
}

/**
 * Collect performance metrics
 */
function collectPerformanceMetrics() {
  if (!isMonitoringEnabled) return;

  try {
    // Memory metrics
    const memoryUsage = process.memoryUsage();
    metrics.performance.memory.history.push({
      timestamp: Date.now(),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
    });

    // Keep only last 60 samples (1 hour with 1 minute interval)
    if (metrics.performance.memory.history.length > 60) {
      metrics.performance.memory.history.shift();
    }

    // CPU metrics
    metrics.performance.cpu.history.push({
      timestamp: Date.now(),
      loadAvg: os.loadavg(),
      cpus: os.cpus().length,
    });

    // Keep only last 60 samples
    if (metrics.performance.cpu.history.length > 60) {
      metrics.performance.cpu.history.shift();
    }
  } catch (error) {
    console.error("Error collecting performance metrics:", error);
  }
}

/**
 * Set up Prometheus metrics server
 */
function setupPrometheusServer() {
  try {
    // In a real application, we would set up Prometheus client
    // For this example, we'll just create a simple metrics endpoint

    const app = express();
    const port = config.monitoring.prometheus.port || 9090;

    app.get("/metrics", (req, res) => {
      // Generate Prometheus-style metrics
      let prometheusMetrics = "";

      // Add request metrics
      prometheusMetrics += `# HELP app_requests_total Total number of requests\n`;
      prometheusMetrics += `# TYPE app_requests_total counter\n`;
      prometheusMetrics += `app_requests_total ${metrics.requests.total}\n`;

      prometheusMetrics += `# HELP app_requests_success Total number of successful requests\n`;
      prometheusMetrics += `# TYPE app_requests_success counter\n`;
      prometheusMetrics += `app_requests_success ${metrics.requests.success}\n`;

      prometheusMetrics += `# HELP app_requests_error Total number of error requests\n`;
      prometheusMetrics += `# TYPE app_requests_error counter\n`;
      prometheusMetrics += `app_requests_error ${metrics.requests.error}\n`;

      // Add response time metrics
      prometheusMetrics += `# HELP app_response_time_avg Average response time in milliseconds\n`;
      prometheusMetrics += `# TYPE app_response_time_avg gauge\n`;
      prometheusMetrics += `app_response_time_avg ${metrics.performance.responseTime.avg}\n`;

      prometheusMetrics += `# HELP app_response_time_max Maximum response time in milliseconds\n`;
      prometheusMetrics += `# TYPE app_response_time_max gauge\n`;
      prometheusMetrics += `app_response_time_max ${metrics.performance.responseTime.max}\n`;

      // Add memory metrics
      const memoryUsage = process.memoryUsage();
      prometheusMetrics += `# HELP app_memory_heap_used Node.js heap memory used in bytes\n`;
      prometheusMetrics += `# TYPE app_memory_heap_used gauge\n`;
      prometheusMetrics += `app_memory_heap_used ${memoryUsage.heapUsed}\n`;

      prometheusMetrics += `# HELP app_memory_heap_total Node.js heap memory total in bytes\n`;
      prometheusMetrics += `# TYPE app_memory_heap_total gauge\n`;
      prometheusMetrics += `app_memory_heap_total ${memoryUsage.heapTotal}\n`;

      prometheusMetrics += `# HELP app_memory_rss Node.js RSS memory in bytes\n`;
      prometheusMetrics += `# TYPE app_memory_rss gauge\n`;
      prometheusMetrics += `app_memory_rss ${memoryUsage.rss}\n`;

      // Add CPU metrics
      prometheusMetrics += `# HELP app_cpu_load_avg System load average\n`;
      prometheusMetrics += `# TYPE app_cpu_load_avg gauge\n`;
      prometheusMetrics += `app_cpu_load_avg{period="1m"} ${os.loadavg()[0]}\n`;
      prometheusMetrics += `app_cpu_load_avg{period="5m"} ${os.loadavg()[1]}\n`;
      prometheusMetrics += `app_cpu_load_avg{period="15m"} ${
        os.loadavg()[2]
      }\n`;

      // Add uptime metric
      prometheusMetrics += `# HELP app_uptime Application uptime in seconds\n`;
      prometheusMetrics += `# TYPE app_uptime counter\n`;
      prometheusMetrics += `app_uptime ${process.uptime()}\n`;

      // Add student metrics based on ID patterns
      prometheusMetrics += `# HELP app_students_by_year Student count by enrollment year\n`;
      prometheusMetrics += `# TYPE app_students_by_year gauge\n`;

      Object.keys(metrics.students.byGradYear).forEach((year) => {
        prometheusMetrics += `app_students_by_year{year="${year}"} ${metrics.students.byGradYear[year]}\n`;
      });

      prometheusMetrics += `# HELP app_students_by_department Student count by department\n`;
      prometheusMetrics += `# TYPE app_students_by_department gauge\n`;

      Object.keys(metrics.students.byDepartment).forEach((dept) => {
        prometheusMetrics += `app_students_by_department{department="${dept}"} ${metrics.students.byDepartment[dept]}\n`;
      });

      res.set("Content-Type", "text/plain");
      res.send(prometheusMetrics);
    });

    metricsServer = app.listen(port, () => {
      console.log(`Prometheus metrics server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error setting up Prometheus metrics server:", error);
  }
}

/**
 * Set up Sentry error tracking
 */
function setupSentryErrorTracking() {
  try {
    console.log(
      "Sentry error tracking would be initialized here with DSN:",
      config.monitoring.sentry.dsn
    );
    // In a real application, we would initialize Sentry here
    // For example:
    // const Sentry = require('@sentry/node');
    // Sentry.init({
    //   dsn: config.monitoring.sentry.dsn,
    //   environment: config.monitoring.sentry.environment,
    //   tracesSampleRate: config.monitoring.sentry.tracesSampleRate
    // });
  } catch (error) {
    console.error("Error setting up Sentry error tracking:", error);
  }
}

/**
 * Track application error
 * @param {Error} error - Error object
 * @param {string} type - Error type
 */
exports.trackError = function (error, type = "unknown") {
  if (!isMonitoringEnabled) return;

  try {
    metrics.errors.total++;
    metrics.errors.byType[type] = (metrics.errors.byType[type] || 0) + 1;

    // In a real application, we would send this to Sentry if configured
    console.error(`[Monitoring] Error tracked: ${type}`, error.message);
  } catch (err) {
    console.error("Error in trackError:", err);
  }
};

/**
 * Track user activity
 * @param {string} userId - User ID
 * @param {string} action - User action
 */
exports.trackUserActivity = function (userId, action) {
  if (!isMonitoringEnabled) return;

  try {
    // This would typically integrate with an analytics service
    console.log(`[Monitoring] User activity: ${userId} - ${action}`);
  } catch (err) {
    console.error("Error in trackUserActivity:", err);
  }
};

/**
 * Track student registration
 * @param {string} studentId - Student ID in format m[YY]-XXXX-XXX
 * @param {string} departmentCode - Department code
 */
exports.trackStudentRegistration = function (studentId, departmentCode) {
  if (!isMonitoringEnabled) return;

  try {
    // Extract enrollment year from student ID (format: m[YY]-XXXX-XXX)
    const match = studentId.match(/^m(\d{2})-\d{4}-\d{3}$/);
    if (match) {
      const enrollmentYear = `20${match[1]}`; // Convert YY to full year

      // Update enrollment year metrics
      metrics.students.byGradYear[enrollmentYear] =
        (metrics.students.byGradYear[enrollmentYear] || 0) + 1;

      // Update department metrics
      if (departmentCode) {
        metrics.students.byDepartment[departmentCode] =
          (metrics.students.byDepartment[departmentCode] || 0) + 1;
      }

      console.log(
        `[Monitoring] Student registered: ${studentId} (Year: ${enrollmentYear}, Dept: ${
          departmentCode || "Unknown"
        })`
      );
    } else {
      console.warn(`[Monitoring] Invalid student ID format: ${studentId}`);
    }
  } catch (err) {
    console.error("Error in trackStudentRegistration:", err);
  }
};

/**
 * Update active user count
 * @param {number} count - New active user count
 */
exports.updateActiveUsers = function (count) {
  if (!isMonitoringEnabled) return;

  metrics.users.active = count;
};

/**
 * Update active session count
 * @param {number} count - New active session count
 */
exports.updateActiveSessions = function (count) {
  if (!isMonitoringEnabled) return;

  metrics.users.sessions = count;
};

/**
 * Get current metrics
 * @returns {Object} - Current metrics
 */
exports.getMetrics = function () {
  return { ...metrics };
};

/**
 * Shut down the monitoring system
 */
exports.shutdown = function () {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }

  if (metricsServer) {
    metricsServer.close();
  }

  isMonitoringEnabled = false;
  console.log("Monitoring system shut down");
};

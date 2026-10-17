export class HealthController {
  constructor(startTime = Date.now()) {
    this.startTime = startTime;
  }

  getHealth(req, res) {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const memoryUsage = process.memoryUsage();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'workflow-task-engine',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryRssMb: (memoryUsage.rss / 1024 / 1024).toFixed(2)
      }
    }));
  }
}

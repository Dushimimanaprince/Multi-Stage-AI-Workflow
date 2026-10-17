import http from 'node:http';
import { TaskRepository } from './repositories/task-repository.js';
import { TaskService } from './services/task-service.js';
import { TaskController } from './controllers/task-controller.js';
import { HealthController } from './controllers/health-controller.js';
import { applySecurityHeaders } from './middleware/security.js';

export function createServer(options = {}) {
  const repository = options.repository || new TaskRepository(options.initialData);
  const taskService = new TaskService(repository);
  const taskController = new TaskController(taskService);
  const healthController = new HealthController();

  const server = http.createServer(async (req, res) => {
    applySecurityHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.searchParams;

    // Helper to parse JSON body
    const parseBody = () => {
      return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
          if (body.length > 1e6) { // 1MB limit
            reject(new Error('Payload Too Large'));
          }
        });
        req.on('end', () => {
          if (!body.trim()) {
            resolve({});
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error('Invalid JSON'));
          }
        });
        req.on('error', reject);
      });
    };

    try {
      // 1. Health endpoint: GET /api/v1/health
      if (req.method === 'GET' && pathname === '/api/v1/health') {
        return healthController.getHealth(req, res);
      }

      // 2. Tasks collection: GET & POST /api/v1/tasks
      if (pathname === '/api/v1/tasks') {
        if (req.method === 'GET') {
          return await taskController.listTasks(req, res, query);
        }
        if (req.method === 'POST') {
          const body = await parseBody();
          return await taskController.createTask(req, res, body);
        }
      }

      // 3. Individual task: /api/v1/tasks/:id
      const taskItemMatch = pathname.match(/^\/api\/v1\/tasks\/([^/]+)$/);
      if (taskItemMatch) {
        const id = decodeURIComponent(taskItemMatch[1]);
        if (req.method === 'GET') {
          return await taskController.getTask(req, res, id);
        }
        if (req.method === 'PATCH') {
          const body = await parseBody();
          return await taskController.updateTask(req, res, id, body);
        }
        if (req.method === 'DELETE') {
          return await taskController.deleteTask(req, res, id);
        }
      }

      // Route Not Found
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'NotFoundError',
        message: `Endpoint ${req.method} ${pathname} not found on this service`
      }));
    } catch (err) {
      if (err.message === 'Invalid JSON') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'BadRequest',
          message: 'Malformed JSON payload in request body'
        }));
        return;
      }
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'InternalServerError',
        message: err.message
      }));
    }
  });

  return { server, repository, taskService };
}

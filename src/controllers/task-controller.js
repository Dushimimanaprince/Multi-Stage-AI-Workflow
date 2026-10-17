import { ValidationError, NotFoundError } from '../models/task.js';

export class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  async listTasks(req, res, query) {
    try {
      const filters = {
        status: query.get('status') || undefined,
        priority: query.get('priority') || undefined,
        tag: query.get('tag') || undefined
      };

      const tasks = await this.taskService.getAllTasks(filters);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        count: tasks.length,
        data: tasks.map(t => t.toJSON())
      }));
    } catch (err) {
      this.handleError(res, err);
    }
  }

  async getTask(req, res, id) {
    try {
      const task = await this.taskService.getTaskById(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: task.toJSON()
      }));
    } catch (err) {
      this.handleError(res, err);
    }
  }

  async createTask(req, res, body) {
    try {
      const task = await this.taskService.createTask(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: task.toJSON()
      }));
    } catch (err) {
      this.handleError(res, err);
    }
  }

  async updateTask(req, res, id, body) {
    try {
      const task = await this.taskService.updateTask(id, body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: task.toJSON()
      }));
    } catch (err) {
      this.handleError(res, err);
    }
  }

  async deleteTask(req, res, id) {
    try {
      await this.taskService.deleteTask(id);
      res.writeHead(204);
      res.end();
    } catch (err) {
      this.handleError(res, err);
    }
  }

  handleError(res, err) {
    if (err instanceof ValidationError) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'ValidationError',
        message: err.message,
        details: err.errors
      }));
      return;
    }

    if (err instanceof NotFoundError) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'NotFoundError',
        message: err.message
      }));
      return;
    }

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'InternalServerError',
      message: err.message || 'An unexpected error occurred'
    }));
  }
}

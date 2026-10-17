import crypto from 'node:crypto';
import { Task, ValidationError, NotFoundError } from '../models/task.js';

export class TaskService {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async getAllTasks(filters = {}) {
    return this.taskRepository.findAll(filters);
  }

  async getTaskById(id) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with id '${id}' not found`);
    }
    return task;
  }

  async createTask(data) {
    Task.validate(data, false);

    const id = data.id || `task-${crypto.randomBytes(4).toString('hex')}`;
    const now = new Date().toISOString();

    const task = new Task({
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    });

    return this.taskRepository.create(task);
  }

  async updateTask(id, updates) {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Task with id '${id}' not found`);
    }

    Task.validate(updates, true);

    return this.taskRepository.update(id, updates);
  }

  async deleteTask(id) {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Task with id '${id}' not found`);
    }

    await this.taskRepository.delete(id);
    return true;
  }
}

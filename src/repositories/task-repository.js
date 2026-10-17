import { Task } from '../models/task.js';

export class TaskRepository {
  constructor(initialData = null) {
    this.tasks = new Map();
    if (initialData && Array.isArray(initialData)) {
      initialData.forEach((taskData) => {
        const task = new Task(taskData);
        this.tasks.set(task.id, task);
      });
    } else {
      this.seedDefaultData();
    }
  }

  seedDefaultData() {
    const defaultTasks = [
      {
        id: 'task-101',
        title: 'Architect multi-stage AI workflow contract',
        description: 'Establish standard JSON schema for handoff between Chat and IDE UX',
        priority: 'critical',
        status: 'completed',
        dueDate: '2026-10-18T00:00:00.000Z',
        tags: ['architecture', 'ai-ux', 'schema'],
        createdAt: '2026-10-17T12:00:00.000Z',
        updatedAt: '2026-10-17T14:30:00.000Z'
      },
      {
        id: 'task-102',
        title: 'Synthesize microservice inside IDE assistant',
        description: 'Scaffold domain models, controllers, and security middleware in IDE',
        priority: 'high',
        status: 'in_progress',
        dueDate: '2026-10-19T00:00:00.000Z',
        tags: ['ide', 'implementation', 'backend'],
        createdAt: '2026-10-17T14:30:00.000Z',
        updatedAt: '2026-10-17T15:00:00.000Z'
      },
      {
        id: 'task-103',
        title: 'Execute CLI Quality Gate verification',
        description: 'Perform contract compliance audit and edge-case regression test via CLI AI',
        priority: 'high',
        status: 'backlog',
        dueDate: '2026-10-20T00:00:00.000Z',
        tags: ['cli', 'qa', 'automation'],
        createdAt: '2026-10-17T15:00:00.000Z',
        updatedAt: '2026-10-17T15:00:00.000Z'
      }
    ];

    defaultTasks.forEach((item) => {
      this.tasks.set(item.id, new Task(item));
    });
  }

  async findAll({ status, priority, tag } = {}) {
    let result = Array.from(this.tasks.values());

    if (status) {
      result = result.filter((t) => t.status === status);
    }
    if (priority) {
      result = result.filter((t) => t.priority === priority);
    }
    if (tag) {
      result = result.filter((t) => t.tags.includes(tag));
    }

    // Sort descending by creation date
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findById(id) {
    return this.tasks.get(id) || null;
  }

  async create(task) {
    this.tasks.set(task.id, task);
    return task;
  }

  async update(id, updatedFields) {
    const existing = this.tasks.get(id);
    if (!existing) {
      return null;
    }

    const updated = new Task({
      ...existing.toJSON(),
      ...updatedFields,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    });

    this.tasks.set(id, updated);
    return updated;
  }

  async delete(id) {
    return this.tasks.delete(id);
  }

  async count() {
    return this.tasks.size;
  }

  clear() {
    this.tasks.clear();
  }
}

/**
 * Task Domain Model
 * Enforces contract constraints from specs/service-contract.json
 */
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'];
export const TASK_STATUSES = ['backlog', 'in_progress', 'review', 'completed'];

export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class Task {
  constructor({
    id,
    title,
    description = '',
    priority = 'medium',
    status = 'backlog',
    dueDate = null,
    tags = [],
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.dueDate = dueDate;
    this.tags = Array.isArray(tags) ? tags : [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static validate(data, isUpdate = false) {
    const errors = [];

    // Title validation
    if (!isUpdate || data.title !== undefined) {
      if (!data.title || typeof data.title !== 'string') {
        errors.push({ field: 'title', message: 'Title is required and must be a string' });
      } else {
        const trimmed = data.title.trim();
        if (trimmed.length < 3 || trimmed.length > 100) {
          errors.push({ field: 'title', message: 'Title must be between 3 and 100 characters' });
        }
      }
    }

    // Priority validation
    if (data.priority !== undefined && !TASK_PRIORITIES.includes(data.priority)) {
      errors.push({
        field: 'priority',
        message: `Priority must be one of: ${TASK_PRIORITIES.join(', ')}`
      });
    }

    // Status validation
    if (data.status !== undefined && !TASK_STATUSES.includes(data.status)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${TASK_STATUSES.join(', ')}`
      });
    }

    // DueDate validation
    if (data.dueDate !== undefined && data.dueDate !== null) {
      const parsed = Date.parse(data.dueDate);
      if (isNaN(parsed)) {
        errors.push({ field: 'dueDate', message: 'dueDate must be a valid ISO date string' });
      }
    }

    // Tags validation
    if (data.tags !== undefined && !Array.isArray(data.tags)) {
      errors.push({ field: 'tags', message: 'tags must be an array of strings' });
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed for Task entity', errors);
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      dueDate: this.dueDate,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

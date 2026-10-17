import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { TaskRepository } from '../../src/repositories/task-repository.js';
import { TaskService } from '../../src/services/task-service.js';
import { NotFoundError, ValidationError } from '../../src/models/task.js';

describe('TaskService Business Logic', () => {
  let repository;
  let service;

  beforeEach(() => {
    repository = new TaskRepository([]);
    service = new TaskService(repository);
  });

  test('creates a task with generated ID and timestamps', async () => {
    const task = await service.createTask({
      title: 'Setup automated CI pipeline',
      priority: 'high',
      status: 'in_progress'
    });

    assert.ok(task.id.startsWith('task-'));
    assert.equal(task.title, 'Setup automated CI pipeline');
    assert.equal(task.priority, 'high');
    assert.equal(task.status, 'in_progress');
    assert.ok(task.createdAt);
  });

  test('retrieves all tasks with filter support', async () => {
    await service.createTask({ title: 'Task A', status: 'backlog', priority: 'low' });
    await service.createTask({ title: 'Task B', status: 'completed', priority: 'critical' });
    await service.createTask({ title: 'Task C', status: 'completed', priority: 'high' });

    const all = await service.getAllTasks();
    assert.equal(all.length, 3);

    const completed = await service.getAllTasks({ status: 'completed' });
    assert.equal(completed.length, 2);

    const critical = await service.getAllTasks({ priority: 'critical' });
    assert.equal(critical.length, 1);
    assert.equal(critical[0].title, 'Task B');
  });

  test('throws NotFoundError for non-existent task ID', async () => {
    await assert.rejects(
      async () => service.getTaskById('non-existent-id'),
      (err) => err instanceof NotFoundError
    );
  });

  test('updates task fields while validating updates', async () => {
    const task = await service.createTask({ title: 'Original Title', priority: 'low' });
    const updated = await service.updateTask(task.id, {
      title: 'Updated Title',
      status: 'in_progress'
    });

    assert.equal(updated.title, 'Updated Title');
    assert.equal(updated.status, 'in_progress');

    // Reject invalid update
    await assert.rejects(
      async () => service.updateTask(task.id, { priority: 'invalid-prio' }),
      (err) => err instanceof ValidationError
    );
  });

  test('deletes task successfully and errors on re-delete', async () => {
    const task = await service.createTask({ title: 'To be deleted' });
    const deleted = await service.deleteTask(task.id);
    assert.equal(deleted, true);

    await assert.rejects(
      async () => service.deleteTask(task.id),
      (err) => err instanceof NotFoundError
    );
  });
});

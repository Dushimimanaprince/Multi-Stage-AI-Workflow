import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { Task, ValidationError } from '../../src/models/task.js';

describe('Task Domain Model', () => {
  test('creates a valid task with default values', () => {
    const task = new Task({
      id: 'task-test-1',
      title: 'Valid task title'
    });

    assert.equal(task.id, 'task-test-1');
    assert.equal(task.title, 'Valid task title');
    assert.equal(task.priority, 'medium');
    assert.equal(task.status, 'backlog');
    assert.deepEqual(task.tags, []);
    assert.ok(task.createdAt);
    assert.ok(task.updatedAt);
  });

  test('validates title constraints (length 3-100)', () => {
    // Too short (< 3)
    assert.throws(() => {
      Task.validate({ title: 'ab' });
    }, (err) => {
      return err instanceof ValidationError && err.errors.some(e => e.field === 'title');
    });

    // Too long (> 100)
    assert.throws(() => {
      Task.validate({ title: 'a'.repeat(101) });
    }, (err) => {
      return err instanceof ValidationError && err.errors.some(e => e.field === 'title');
    });

    // Valid title
    assert.doesNotThrow(() => {
      Task.validate({ title: 'Feature release v1' });
    });
  });

  test('validates priority enums', () => {
    assert.throws(() => {
      Task.validate({ title: 'Task with invalid priority', priority: 'urgent' });
    }, (err) => {
      return err instanceof ValidationError && err.errors.some(e => e.field === 'priority');
    });

    assert.doesNotThrow(() => {
      Task.validate({ title: 'Valid priority', priority: 'critical' });
    });
  });

  test('validates status enums', () => {
    assert.throws(() => {
      Task.validate({ title: 'Task with invalid status', status: 'archived' });
    }, (err) => {
      return err instanceof ValidationError && err.errors.some(e => e.field === 'status');
    });

    assert.doesNotThrow(() => {
      Task.validate({ title: 'Valid status', status: 'in_progress' });
    });
  });

  test('validates ISO dueDate format', () => {
    assert.throws(() => {
      Task.validate({ title: 'Invalid date task', dueDate: 'not-a-date' });
    }, (err) => {
      return err instanceof ValidationError && err.errors.some(e => e.field === 'dueDate');
    });

    assert.doesNotThrow(() => {
      Task.validate({ title: 'Valid date task', dueDate: '2026-12-31T23:59:59.000Z' });
    });
  });

  test('serializes to clean JSON object', () => {
    const task = new Task({
      id: 'task-test-2',
      title: 'Serialization check',
      tags: ['json', 'model']
    });

    const json = task.toJSON();
    assert.equal(json.id, 'task-test-2');
    assert.equal(json.title, 'Serialization check');
    assert.deepEqual(json.tags, ['json', 'model']);
  });
});

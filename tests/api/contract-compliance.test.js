import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../../src/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contractPath = path.resolve(__dirname, '../../specs/service-contract.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

describe('Contract Compliance Integration Tests', () => {
  let server;
  let baseUrl;
  const PORT = 4991;

  before(async () => {
    const serverInstance = createServer();
    server = serverInstance.server;

    await new Promise((resolve) => {
      server.listen(PORT, () => {
        baseUrl = `http://localhost:${PORT}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  // Helper request function
  function makeRequest({ method, path, body = null }) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const options = {
        method,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          let json = null;
          try {
            json = raw ? JSON.parse(raw) : null;
          } catch {
            json = raw;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: json
          });
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  test('Security headers present on all responses', async () => {
    const res = await makeRequest({ method: 'GET', path: '/api/v1/health' });

    for (const header of contract.qualityGateCriteria.requiredSecurityHeaders) {
      assert.ok(res.headers[header.toLowerCase()], `Missing required security header: ${header}`);
    }
  });

  test('GET /api/v1/health satisfies contract', async () => {
    const res = await makeRequest({ method: 'GET', path: '/api/v1/health' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'healthy');
    assert.equal(res.body.service, contract.serviceName);
  });

  test('Full CRUD Lifecycle satisfies contract requirements', async () => {
    // 1. GET /api/v1/tasks initially
    const initialList = await makeRequest({ method: 'GET', path: '/api/v1/tasks' });
    assert.equal(initialList.statusCode, 200);
    assert.ok(Array.isArray(initialList.body.data));

    // 2. POST /api/v1/tasks (valid) -> 201
    const createRes = await makeRequest({
      method: 'POST',
      path: '/api/v1/tasks',
      body: {
        title: 'Contract validation automated task',
        description: 'Verifying end-to-end chaining',
        priority: 'high',
        status: 'in_progress',
        tags: ['integration', 'test']
      }
    });
    assert.equal(createRes.statusCode, 201);
    const createdTask = createRes.body.data;
    assert.ok(createdTask.id);
    assert.equal(createdTask.title, 'Contract validation automated task');

    // 3. POST /api/v1/tasks (invalid title too short) -> 400
    const invalidRes = await makeRequest({
      method: 'POST',
      path: '/api/v1/tasks',
      body: { title: 'x' }
    });
    assert.equal(invalidRes.statusCode, 400);
    assert.equal(invalidRes.body.error, 'ValidationError');

    // 4. GET /api/v1/tasks/:id -> 200
    const getRes = await makeRequest({
      method: 'GET',
      path: `/api/v1/tasks/${createdTask.id}`
    });
    assert.equal(getRes.statusCode, 200);
    assert.equal(getRes.body.data.id, createdTask.id);

    // 5. GET /api/v1/tasks/:id (non-existent) -> 404
    const notFoundRes = await makeRequest({
      method: 'GET',
      path: '/api/v1/tasks/non-existent-999'
    });
    assert.equal(notFoundRes.statusCode, 404);

    // 6. PATCH /api/v1/tasks/:id -> 200
    const patchRes = await makeRequest({
      method: 'PATCH',
      path: `/api/v1/tasks/${createdTask.id}`,
      body: {
        status: 'completed',
        priority: 'critical'
      }
    });
    assert.equal(patchRes.statusCode, 200);
    assert.equal(patchRes.body.data.status, 'completed');
    assert.equal(patchRes.body.data.priority, 'critical');

    // 7. DELETE /api/v1/tasks/:id -> 204
    const deleteRes = await makeRequest({
      method: 'DELETE',
      path: `/api/v1/tasks/${createdTask.id}`
    });
    assert.equal(deleteRes.statusCode, 204);

    // 8. Confirm deletion with subsequent GET -> 404
    const verifyDelete = await makeRequest({
      method: 'GET',
      path: `/api/v1/tasks/${createdTask.id}`
    });
    assert.equal(verifyDelete.statusCode, 404);
  });
});

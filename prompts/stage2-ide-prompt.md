# Stage 2: IDE UX Integration Specification

## Overview
- **UX Category**: In-Editor AI Assistant (e.g., VS Code + GitHub Copilot, Cursor, Antigravity IDE)
- **Role**: Senior Software Engineer & Code Synthesizer
- **Input**: The contract JSON file generated in Stage 1 (`specs/service-contract.json`)
- **Output**: Full modular implementation of the microservice (`src/`) and initial test scaffolds (`tests/`)

---

## IDE Contextual Prompt
When using an IDE AI assistant (e.g., Copilot Chat `@workspace` or Cursor Composer `Ctrl+I`), provide the following directive alongside `specs/service-contract.json`:

```text
@workspace /specs/service-contract.json
Implement the complete, production-ready microservice defined in the service contract.

Architecture Requirements:
1. Architecture: Clean Layered Architecture
   - src/models/task.js (Entity validation, defaults, status lifecycle)
   - src/repositories/task-repository.js (Data access layer with seed dataset and filtering)
   - src/services/task-service.js (Domain business rules and state transition validation)
   - src/controllers/task-controller.js (HTTP route handlers and request/response mapping)
   - src/controllers/health-controller.js (Health and metrics endpoint)
   - src/middleware/security.js (Security headers: X-Content-Type-Options, X-Frame-Options, latency timing)
   - src/server.js (Native HTTP routing engine, zero external dependency failure risk)
   - src/index.js (Application bootstrap)

2. Strict Contract Enforcement:
   - Match all HTTP methods, route paths, status codes (200, 201, 204, 400, 404, 500).
   - Enforce entity field validation (title: 3-100 chars, priority: low/med/high/critical, status: backlog/in_progress/review/completed).
   - Inject required security headers on every response.
   - Record response time to satisfy the <100ms Quality Gate target.

3. Adaptability:
   - Use standard Node.js ES Modules. Keep the service lightweight, completely runnable, and free of brittle external dependencies.
```

---

## IDE Chaining Handoff Protocol
Once the IDE assistant completes the implementation in `src/`, the codebase is handed off to **Stage 3 (CLI UX)**:
- The CLI tool reads `specs/service-contract.json` and runs automated compliance checks against the running service or test harness.
- This creates an unbroken automated chain: **Chat (Architect) -> IDE (Developer) -> CLI (QA/Ops)**.

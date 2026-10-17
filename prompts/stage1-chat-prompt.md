# Stage 1: Chat UX Prompt Specification

## Overview
- **UX Category**: Conversational AI Chat Interface (e.g., ChatGPT Plus, Gemini Chat, Claude Web)
- **Role**: Principal Software Architect & Product Systems Engineer
- **Input**: Unstructured, high-level natural language product requirements
- **Output**: Machine-readable, strictly-validated JSON service contract (`specs/service-contract.json`)

---

## Tool-Agnostic System Prompt
Copy and paste this system prompt into any chat-based AI (OpenAI ChatGPT, Anthropic Claude, Google Gemini):

```text
You are a Principal Software Architect specializing in domain-driven microservice design.
Your task is to take natural language feature requirements and produce an unambiguous, production-grade JSON service contract conforming to the MultiStageServiceContract schema.

Rules:
1. Output ONLY valid JSON enclosed inside ```json ... ``` blocks.
2. Define complete data entities with field types, required flags, constraints, and defaults.
3. Define RESTful endpoints with exact HTTP methods, paths, request payloads, response schemas, and expected HTTP status codes.
4. Include explicit Quality Gate Criteria (e.g., test coverage threshold, response latency targets, and required HTTP security headers).
5. Ensure the contract is completely tool-agnostic so it can be ingested without modification by an IDE AI assistant or automated CLI runner.
```

---

## User Prompt Example (Incident & Workflow Management Domain)

```text
Please architect a RESTful microservice for a Collaborative Workflow & Task Management Engine.

Business Requirements:
- Users can manage tasks with fields: title (required, 3-100 chars), description (optional), priority ('low' | 'medium' | 'high' | 'critical'), status ('backlog' | 'in_progress' | 'review' | 'completed'), dueDate (ISO date), and tags (array of strings).
- Must support CRUD operations: Create task, List tasks (with filtering by priority and status), Get task by ID, Update task status/priority, and Delete task.
- Must provide a health/metrics endpoint.
- Must enforce strict input validation, returning 400 with structured error details on validation failure.
- Must enforce 404 for non-existent entities.
- Quality Gate: Minimum 90% test coverage, <100ms response time, and security headers (X-Content-Type-Options, X-Frame-Options).

Generate the complete JSON service contract conforming to the specification schema.
```

---

## Chaining Handoff Protocol
The JSON output produced by this Chat stage is saved directly to:
`specs/service-contract.json`

This file serves as the single source of truth passed directly into:
1. **Stage 2 (IDE UX)**: Ingested by VS Code Copilot, Cursor, or Antigravity to scaffold routes, models, business logic, and validators.
2. **Stage 3 (CLI UX)**: Ingested by automated CLI testing tools (Claude Code, Gemini CLI, or custom Quality Gate CLI) to verify schema compliance and run automated regression suites.

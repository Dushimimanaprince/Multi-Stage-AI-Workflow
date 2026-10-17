# Step-by-Step Implementation Guide

This guide provides operational step-by-step instructions for executing the Multi-Stage AI Workflow across Chat, IDE, and CLI UX interfaces.

---

## 1. Problem Formulation & Scope

### The Problem
Translating natural language product requirements into a production-ready, secure, typed backend microservice with contract-compliance test suites and CI/CD quality gate reports typically requires manual coordination across Product Architects, Backend Engineers, and QA/DevOps teams.

### The Multi-Stage Solution
We chain outputs between three distinct AI UX categories:
1. **Chat UX (ChatGPT / Claude / Gemini Chat)**: Conversational requirements elicitation & schema contract generation.
2. **IDE UX (VS Code Copilot / Cursor / Antigravity)**: Contextual code synthesis and clean-architecture codebase integration.
3. **CLI UX (Claude Code / Gemini CLI / Workflow Runner)**: Headless compliance testing, security header audit, latency profiling, and release certification.

---

## 2. Stage 1: Chat UX (Conversational AI)

### Objective
Convert unstructured human product ideas into an unambiguous machine-readable JSON service contract conforming to `specs/contract.schema.json`.

### Recommended Tools
- OpenAI ChatGPT (GPT-4o / GPT-4.5)
- Anthropic Claude (Claude 3.5 Sonnet / Claude 3 Opus)
- Google Gemini (Gemini 1.5 Pro / Gemini 2.0)

### Steps
1. Open your chosen Chat AI interface.
2. Provide the tool-agnostic system prompt from `prompts/stage1-chat-prompt.md`:
   ```text
   You are a Principal Software Architect specializing in domain-driven microservice design.
   Your task is to take natural language feature requirements and produce an unambiguous,
   production-grade JSON service contract conforming to the MultiStageServiceContract schema.
   ```
3. Input the product requirements:
   ```text
   Architect a RESTful microservice for a Collaborative Workflow & Task Management Engine.
   - Task fields: title (3-100 chars), description, priority (low/medium/high/critical), status (backlog/in_progress/review/completed), dueDate, tags.
   - Endpoints: Health check, List tasks (with filter), Create task (validate title), Get by ID, Update status/priority, Delete task.
   - Quality Gate: Minimum 90% test coverage, <100ms response time, security headers (X-Content-Type-Options, X-Frame-Options).
   ```
4. Copy the generated JSON block and save it to:
   `specs/service-contract.json`
5. Validate the contract structure:
   ```bash
   node -e "import fs from 'node:fs'; import { validateServiceContract } from './src/utils/contract-validator.js'; console.log(validateServiceContract(JSON.parse(fs.readFileSync('./specs/service-contract.json', 'utf8'))));"
   ```

---

## 3. Stage 2: IDE UX (Contextual Assistant)

### Objective
Ingest the contract into an IDE-based AI assistant to scaffold and synthesize the complete modular microservice.

### Recommended Tools
- VS Code + GitHub Copilot Chat
- Cursor (Composer Mode `Ctrl+I` / `Cmd+I`)
- Antigravity IDE / Windsurf

### Steps
1. Open the repository root in your IDE.
2. Open the AI Assistant Chat / Composer.
3. Reference the contract generated in Stage 1:
   ```text
   @workspace /specs/service-contract.json
   Implement the complete, production-ready microservice defined in the service contract.
   Follow clean layered architecture:
   - src/models/task.js
   - src/repositories/task-repository.js
   - src/services/task-service.js
   - src/controllers/task-controller.js
   - src/controllers/health-controller.js
   - src/middleware/security.js
   - src/server.js
   - src/index.js
   Enforce all contract constraints, security headers, and error codes.
   ```
4. Accept and integrate the generated files into the workspace.
5. Verify basic server boot:
   ```bash
   npm start
   ```

---

## 4. Stage 3: CLI UX (Headless Agent & Quality Gate)

### Objective
Execute automated compliance verification, test execution, security header audit, and produce a signed release report.

### Recommended Tools
- Claude Code CLI (`claude "audit the codebase against specs/service-contract.json"`)
- Gemini CLI (`gemini run "verify contract compliance"`)
- Built-in Zero-Dependency Quality Gate Runner (`npm run quality-gate`)

### Steps
1. Open your terminal in the repository root.
2. Run the test suite:
   ```bash
   npm test
   ```
   *Expected output: 14 passing tests across models, services, and integration endpoints.*
3. Run the automated CLI Quality Gate:
   ```bash
   npm run quality-gate
   ```
4. Inspect the generated release artifacts:
   - Markdown report: `reports/quality-gate-report.md`
   - Machine-readable JSON summary: `reports/audit-summary.json`

---

## 5. End-to-End Orchestrated Execution

You can run the entire multi-stage chain end-to-end with a single command:

```bash
# Run the complete multi-stage workflow orchestrator
npm run workflow
```

Or run individual stages:
```bash
npm run workflow:stage1    # Validate Stage 1 contract
npm run workflow:stage2    # Validate Stage 2 IDE codebase integrity
npm run workflow:stage3    # Execute Stage 3 test suite and Quality Gate
```

---

## 6. Launching the Interactive Visual Dashboard

To explore the workflow visually in your browser:

```bash
npm run dashboard
```
Open [http://localhost:3000](http://localhost:3000) to view:
- Interactive three-stage pipeline track with live state transitions
- Prompt and artifact deep-dives
- Live simulation console with real-time log output
- Quantified efficiency benchmarks and evaluation scorecards

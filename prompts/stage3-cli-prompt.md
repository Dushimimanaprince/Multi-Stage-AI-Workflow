# Stage 3: CLI UX Quality Gate Specification

## Overview
- **UX Category**: Command-Line AI Agent Interface (e.g., Claude Code CLI, Gemini CLI, Aider, custom Quality Gate CLI)
- **Role**: Headless QA Automation Engineer & Security Auditor
- **Input**: The codebase in `src/`, test suites in `tests/`, and contract `specs/service-contract.json`
- **Output**: Verified test execution, contract compliance verification, and signed Quality Gate Audit Report (`reports/quality-gate-report.md`)

---

## Tool-Agnostic CLI Command & Prompt
When running an AI CLI tool (e.g. `claude-code`, `gemini-cli`, or our included zero-dependency CLI runner `npm run quality-gate`), invoke it with:

```bash
# Example invocation via CLI AI tool:
claude "Read specs/service-contract.json and audit the src/ codebase. Execute test suite, verify all endpoints, security headers, and latency constraints. Generate reports/quality-gate-report.md."
```

Or execute directly using the built-in runner:
```bash
npm run quality-gate
```

---

## CLI Automated Audit Directives
The CLI stage executes the following headless checks:

1. **Schema Compliance Verification**:
   - Inspects every endpoint defined in `specs/service-contract.json` against the actual server routes.
   - Confirms HTTP methods, paths, and status codes (200, 201, 204, 400, 404).

2. **Security Headers Compliance**:
   - Asserts that all mandatory security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`) are present on all responses.

3. **Performance & Latency Budget**:
   - Measures response time for each endpoint call, ensuring latency is below the threshold specified in `qualityGateCriteria.maxResponseTimeMs` (100ms).

4. **Automated Audit Report Generation**:
   - Produces `reports/quality-gate-report.md` with pass/fail matrix, latency percentiles, and CI/CD clearance status.

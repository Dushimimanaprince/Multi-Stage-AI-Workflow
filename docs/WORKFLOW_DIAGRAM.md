# Multi-Stage AI Workflow Diagrams

This document contains visual diagrams illustrating the multi-stage AI workflow across Chat, IDE, and CLI UX types.

---

## 1. End-to-End Architecture Flowchart

```mermaid
flowchart TD
    %% Styling
    classDef human fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#f8fafc;
    classDef chatUx fill:#3b0764,stroke:#8b5cf6,stroke-width:2px,color:#f8fafc;
    classDef ideUx fill:#083344,stroke:#06b6d4,stroke-width:2px,color:#f8fafc;
    classDef cliUx fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef artifact fill:#0f172a,stroke:#6366f1,stroke-dasharray: 5 5,stroke-width:2px,color:#f8fafc;

    User(["👤 Human / Product Engineer"]):::human

    subgraph Stage1 ["Stage 1: Chat UX (Conversational AI)"]
        ChatTool["ChatGPT / Claude / Gemini Chat<br/><b>Role:</b> Principal Systems Architect"]:::chatUx
        PromptChat["Prompt: Business Rules & SLA"]:::chatUx
    end

    Contract["📄 specs/service-contract.json<br/>• Entity Validations<br/>• REST Endpoints<br/>• Quality Gate Targets"]:::artifact

    subgraph Stage2 ["Stage 2: IDE UX (Contextual Assistant)"]
        IdeTool["VS Code Copilot / Cursor / Antigravity<br/><b>Role:</b> Senior Code Synthesizer"]:::ideUx
        ScaffoldCode["Synthesize Clean Architecture:<br/>• Models & Repositories<br/>• Domain Services & Controllers<br/>• Security Headers & Router"]:::ideUx
    end

    Codebase["📁 src/ Microservice Codebase<br/>+ tests/ Unit & Integration Suites"]:::artifact

    subgraph Stage3 ["Stage 3: CLI UX (Headless Agent)"]
        CliTool["Claude Code / Gemini CLI / Node Runner<br/><b>Role:</b> Automated QA & Security Gate"]:::cliUx
        ExecuteAudits["Run Contract Audits:<br/>• Endpoint Status Checks<br/>• Latency Benchmarking (&lt;100ms)<br/>• Security Headers Verification"]:::cliUx
    end

    AuditReport["📊 reports/quality-gate-report.md<br/>• 100% Pass Clearance<br/>• Ready for CI/CD Deployment"]:::artifact

    %% Connections
    User -->|Natural Language Requirements| PromptChat
    PromptChat --> ChatTool
    ChatTool -->|Synthesize Strict Contract| Contract
    Contract -->|Ingested into Workspace| IdeTool
    IdeTool --> ScaffoldCode
    ScaffoldCode --> Codebase
    Codebase --> CliTool
    Contract -.->|Benchmark Specs| CliTool
    CliTool --> ExecuteAudits
    ExecuteAudits --> AuditReport
    AuditReport -->|Clearance Delivered| User
```

---

## 2. Sequence Diagram (Cross-UX Chaining Protocol)

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Human Engineer
    participant Chat as Stage 1: Chat UX (Architect)
    participant Spec as Artifact: service-contract.json
    participant IDE as Stage 2: IDE UX (Developer)
    participant Code as Artifact: src/ & tests/
    participant CLI as Stage 3: CLI UX (QA & Security)
    participant Report as Artifact: quality-gate-report.md

    Note over Dev,Chat: Requirements Elicitation & Domain Modeling
    Dev->>Chat: Provide natural language feature specs & constraints
    Chat->>Chat: Enforce MultiStageServiceContract JSON Schema
    Chat-->>Spec: Write specs/service-contract.json

    Note over Spec,IDE: Contextual Ingestion & Codebase Synthesis
    Dev->>IDE: Ingest service-contract.json (@workspace directive)
    IDE->>IDE: Scaffold clean layered Node.js architecture
    IDE-->>Code: Synthesize models, services, controllers, security middleware

    Note over Code,CLI: Headless Verification & Quality Gate Audit
    Dev->>CLI: Trigger automated quality gate (npm run quality-gate)
    CLI->>Spec: Read acceptance & SLA criteria (<100ms latency, security headers)
    CLI->>Code: Spin up in-memory instance & execute test suites (14/14 tests)
    CLI->>CLI: Audit HTTP status codes, measure latency, verify security headers
    CLI-->>Report: Generate signed Quality Gate Audit Report
    CLI->>Dev: Return Exit Code 0: APPROVED FOR PRODUCTION
```

---

## 3. Data Flow & Handoff Schema

```mermaid
graph LR
    subgraph NaturalLang ["Input Layer"]
        A[Unstructured Natural Language<br/>Requirements]
    end

    subgraph Stage1Data ["Chat UX Artifact"]
        B["specs/service-contract.json<br/>- serviceName<br/>- entities: Task<br/>- endpoints: 6 REST routes<br/>- qualityGateCriteria"]
    end

    subgraph Stage2Data ["IDE UX Artifact"]
        C["src/ Codebase<br/>- models/task.js<br/>- repositories/task-repository.js<br/>- services/task-service.js<br/>- controllers/task-controller.js<br/>- middleware/security.js<br/>- server.js"]
    end

    subgraph Stage3Data ["CLI UX Artifact"]
        D["reports/quality-gate-report.md<br/>& reports/audit-summary.json<br/>- 100% Endpoint Compliance<br/>- Avg Latency: 3.86ms<br/>- Status: APPROVED"]
    end

    A -->|Chat Prompting| B
    B -->|IDE Context Injection| C
    C -->|CLI Test Execution| D
    B -.->|Validation Rules| D
```

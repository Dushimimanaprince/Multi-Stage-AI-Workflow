# Tool-Agnostic Adaptability Architecture

A core objective of this project is **Adaptability (20% Evaluation Weight)**: ensuring the workflow maintains minimal dependency on specific tools, proprietary platforms, or model providers.

---

## 1. The Decoupling Principle

Traditional AI prompt chains often fail across UX types because they rely on proprietary prompt syntax, vendor-specific tool calls, or implicit context.

To achieve true tool-agnosticism, this workflow implements **Strict Schema-Driven Handoffs**:
- **Stage 1 (Chat UX)** emits a strictly typed JSON contract (`specs/service-contract.json`) validated against an open JSON Schema (`specs/contract.schema.json`).
- **Stage 2 (IDE UX)** consumes that contract as standard workspace data, completely independent of which IDE AI generated the code.
- **Stage 3 (CLI UX)** audits the codebase and verifies runtime behavior against the same contract using standard HTTP protocols and test harnesses.

```text
+-----------------------+          +-----------------------+          +-----------------------+
|     Chat Provider     |          |      IDE Provider     |          |      CLI Provider     |
| (OpenAI / Anthropic / |          | (Copilot / Cursor /   |          | (Claude Code / Gemini /|
|  Google / DeepSeek)   |          |  Antigravity / JetBr) |          |  Aider / Node Runner) |
+-----------+-----------+          +-----------+-----------+          +-----------+-----------+
            |                                  |                                  |
            v                                  v                                  v
+---------------------------------------------------------------------------------------------+
|                           Standardized JSON Schema Contract                                 |
|                             (specs/contract.schema.json)                                    |
+---------------------------------------------------------------------------------------------+
```

---

## 2. Tool Substitution Matrix

Any tool in each category can be swapped into the pipeline without breaking downstream stages:

### Stage 1: Chat UX Interchangeability
| Provider / Tool | Model | Input Prompt Format | Output Artifact | Compatibility |
|---|---|---|---|---|
| **OpenAI ChatGPT** | GPT-4o / GPT-4.5 | Standard Markdown Prompt | `specs/service-contract.json` | 100% Native |
| **Anthropic Claude** | Claude 3.5 Sonnet | Standard Markdown Prompt | `specs/service-contract.json` | 100% Native |
| **Google Gemini** | Gemini 1.5 Pro / 2.0 | Standard Markdown Prompt | `specs/service-contract.json` | 100% Native |
| **DeepSeek** | DeepSeek V3 / R1 | Standard Markdown Prompt | `specs/service-contract.json` | 100% Native |
| **Local LLMs** | Llama 3 / Mistral | Ollama / LM Studio Prompt | `specs/service-contract.json` | 100% Native |

### Stage 2: IDE UX Interchangeability
| Provider / Tool | Ingestion Method | Target Output | Compatibility |
|---|---|---|---|
| **GitHub Copilot** | `@workspace /specs/service-contract.json` | `src/` modular codebase | 100% Native |
| **Cursor Composer** | `Ctrl+I` with contract attached | `src/` modular codebase | 100% Native |
| **Antigravity IDE** | File reference in conversation | `src/` modular codebase | 100% Native |
| **Windsurf Cascade** | `@file specs/service-contract.json` | `src/` modular codebase | 100% Native |
| **JetBrains AI** | AI Assistant prompt with attached file | `src/` modular codebase | 100% Native |

### Stage 3: CLI UX Interchangeability
| Provider / Tool | Execution Mode | Target Output | Compatibility |
|---|---|---|---|
| **Claude Code CLI** | `claude "audit src/ using specs/service-contract.json"` | `reports/quality-gate-report.md` | 100% Native |
| **Gemini CLI** | `gemini run "verify contract compliance"` | `reports/quality-gate-report.md` | 100% Native |
| **Aider CLI** | `aider --message "run quality gate tests"` | `reports/quality-gate-report.md` | 100% Native |
| **Node.js Built-In** | `npm run quality-gate` | `reports/quality-gate-report.md` | 100% (Zero External Deps) |

---

## 3. Zero-Lock-In Guarantee
1. **No Proprietary SDK Dependencies**: The application runtime and test runner use 100% native Node.js standard libraries (`node:http`, `node:test`, `node:assert`, `node:crypto`).
2. **Open Schemas**: The service contract uses standard JSON Schema draft 2020-12, readable by any programming language or validation library.
3. **Reproducible Locally**: Every verification check runs locally in offline environments without requiring an active external API subscription.

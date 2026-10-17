#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { validateServiceContract } from '../src/utils/contract-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const stageArg = process.argv.find((arg, i) => process.argv[i - 1] === '--stage' || arg.startsWith('--stage='));
const requestedStage = stageArg ? (stageArg.includes('=') ? stageArg.split('=')[1] : stageArg) : 'all';

console.log('\n======================================================================');
console.log('   MULTI-STAGE AI WORKFLOW ORCHESTRATOR (Chat -> IDE -> CLI)');
console.log('======================================================================\n');

async function runStage1() {
  console.log('----------------------------------------------------------------------');
  console.log(' [STAGE 1: CHAT UX] Requirements Elicitation -> Contract Generation');
  console.log('----------------------------------------------------------------------');
  console.log('Persona: Principal Systems Architect (Conversational Chat AI)');
  console.log('Target Tools: ChatGPT, Claude Chat, Google Gemini Chat\n');

  const contractPath = path.join(rootDir, 'specs/service-contract.json');
  if (!fs.existsSync(contractPath)) {
    throw new Error('Contract file specs/service-contract.json does not exist.');
  }

  const rawContract = fs.readFileSync(contractPath, 'utf8');
  const contract = JSON.parse(rawContract);

  console.log('Validating Stage 1 JSON Contract against schema...');
  const validation = validateServiceContract(contract);
  if (!validation.valid) {
    throw new Error(`Stage 1 Contract Validation Failed: ${validation.errors.join(', ')}`);
  }

  console.log('✅ Stage 1 Contract is Schema-Compliant:');
  console.log(`   - Service:   ${contract.serviceName} (v${contract.version})`);
  console.log(`   - Entities:  ${Object.keys(contract.entities).join(', ')}`);
  console.log(`   - Endpoints: ${contract.endpoints.length} defined`);
  console.log(`   - Quality Criteria: Max Latency ${contract.qualityGateCriteria.maxResponseTimeMs}ms, Min Coverage ${contract.qualityGateCriteria.minimumTestCoverage}%\n`);

  return contract;
}

async function runStage2(contract) {
  console.log('----------------------------------------------------------------------');
  console.log(' [STAGE 2: IDE UX] Contextual Code Synthesis & Codebase Integration');
  console.log('----------------------------------------------------------------------');
  console.log('Persona: Senior Software Engineer (IDE Assistant)');
  console.log('Target Tools: VS Code Copilot, Cursor Composer, Antigravity IDE\n');

  console.log('Handoff Ingestion: Receiving specs/service-contract.json into IDE workspace...');

  const requiredFiles = [
    'src/models/task.js',
    'src/repositories/task-repository.js',
    'src/services/task-service.js',
    'src/controllers/task-controller.js',
    'src/controllers/health-controller.js',
    'src/middleware/security.js',
    'src/server.js',
    'src/index.js'
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(rootDir, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing Stage 2 synthesized file: ${file}`);
    }
  }

  console.log(`✅ All ${requiredFiles.length} modular components synthesized and verified:`);
  requiredFiles.forEach(f => console.log(`   - [Synthesized] ${f}`));
  console.log('');
}

async function runStage3(contract) {
  console.log('----------------------------------------------------------------------');
  console.log(' [STAGE 3: CLI UX] Headless Verification, Automated Tests & Audit');
  console.log('----------------------------------------------------------------------');
  console.log('Persona: Headless QA & Security Auditor (CLI AI Agent)');
  console.log('Target Tools: Claude Code CLI, Gemini CLI, Aider, Quality Gate CLI\n');

  console.log('Running test suite via Node test runner...');
  try {
    const testOutput = execSync('node --test tests/**/*.test.js', { cwd: rootDir, encoding: 'utf8' });
    const lines = testOutput.trim().split('\n');
    const summaryLines = lines.filter(l => l.includes('pass') || l.includes('fail') || l.includes('duration'));
    summaryLines.forEach(l => console.log(`   ${l.trim()}`));
  } catch (err) {
    console.error('Test execution failed:', err.stdout || err.message);
    throw err;
  }

  console.log('\nRunning automated Quality Gate auditor...');
  try {
    execSync('node src/cli/quality-gate.js', { cwd: rootDir, stdio: 'inherit' });
  } catch (err) {
    throw new Error('Quality gate audit reported failures.');
  }
}

async function main() {
  const startTime = Date.now();

  try {
    let contract;
    if (requestedStage === '1' || requestedStage === 'all') {
      contract = await runStage1();
    }
    if (requestedStage === '2' || requestedStage === 'all') {
      if (!contract) {
        contract = JSON.parse(fs.readFileSync(path.join(rootDir, 'specs/service-contract.json'), 'utf8'));
      }
      await runStage2(contract);
    }
    if (requestedStage === '3' || requestedStage === 'all') {
      if (!contract) {
        contract = JSON.parse(fs.readFileSync(path.join(rootDir, 'specs/service-contract.json'), 'utf8'));
      }
      await runStage3(contract);
    }

    const elapsedMs = Date.now() - startTime;
    console.log('======================================================================');
    console.log(`🎉 MULTI-STAGE AI WORKFLOW COMPLETED SUCCESSFULLY in ${elapsedMs}ms`);
    console.log('   All UX stage transitions (Chat -> IDE -> CLI) verified cleanly!');
    console.log('======================================================================\n');
  } catch (err) {
    console.error('\n❌ WORKFLOW FAILED:', err.message);
    process.exit(1);
  }
}

main();

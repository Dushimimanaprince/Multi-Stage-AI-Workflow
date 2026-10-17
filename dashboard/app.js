/**
 * Multi-Stage AI Workflow Interactive Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Stage Card and Tab Switching
  const stageCards = document.querySelectorAll('.stage-card');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function switchTab(tabId) {
    tabBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });

    tabPanels.forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  stageCards.forEach(card => {
    card.addEventListener('click', () => {
      const stageNum = card.dataset.stage;
      stageCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const targetTabId = `stage${stageNum}-detail`;
      switchTab(targetTabId);
    });
  });

  // 2. Simulation Drawer & Pipeline Runner
  const runPipelineBtn = document.getElementById('run-pipeline-btn');
  const simulationDrawer = document.getElementById('simulation-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const restartExecBtn = document.getElementById('restart-exec-btn');
  const terminalOutput = document.getElementById('terminal-output');
  const execStatus = document.getElementById('exec-status');

  function openDrawer() {
    simulationDrawer.classList.add('open');
  }

  function closeDrawer() {
    simulationDrawer.classList.remove('open');
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  function appendLog(text, type = 'info') {
    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  async function runSimulation() {
    openDrawer();
    terminalOutput.innerHTML = '';
    execStatus.textContent = 'Simulating Workflow...';
    restartExecBtn.disabled = true;

    // Reset card animations
    stageCards.forEach(c => {
      c.classList.remove('running');
      c.querySelector('.stage-status').textContent = 'Pending';
      c.querySelector('.stage-status').className = 'stage-status';
    });

    appendLog('[System] Initiating Multi-Stage AI Workflow Across UX Types...', 'info');
    await wait(400);

    // Stage 1: Chat UX
    const card1 = document.getElementById('stage-card-1');
    card1.classList.add('running');
    card1.querySelector('.stage-status').textContent = 'Synthesizing...';
    card1.querySelector('.stage-status').className = 'stage-status status-running';
    appendLog('======================================================================', 'info');
    appendLog('[STAGE 1: CHAT UX] Ingesting Natural Language Requirements in Chat AI...', 'stage');
    appendLog('-> Persona: Principal Systems Architect (ChatGPT / Claude / Gemini Chat)', 'info');
    appendLog('-> Prompt: "Architect microservice for Collaborative Workflow & Task Engine..."', 'info');
    await wait(700);

    appendLog('-> Chat AI emitted schema-compliant JSON service contract:', 'success');
    appendLog('   • Service Name: workflow-task-engine (v1.0.0)', 'info');
    appendLog('   • Entities: Task (8 fields with strict validations & enums)', 'info');
    appendLog('   • Endpoints: 6 REST routes mapped (Health, CRUD)', 'info');
    appendLog('   • Quality Gate Budget: Max latency 100ms, Min test coverage 90%', 'info');
    appendLog('-> Saved to: specs/service-contract.json', 'success');
    card1.classList.remove('running');
    card1.querySelector('.stage-status').textContent = 'Completed';
    card1.querySelector('.stage-status').className = 'stage-status status-completed';
    await wait(500);

    // Connector 1-2
    appendLog('\n[Handoff Protocol 1 -> 2] Passing specs/service-contract.json to IDE AI...', 'stage');
    await wait(400);

    // Stage 2: IDE UX
    const card2 = document.getElementById('stage-card-2');
    card2.classList.add('running');
    card2.querySelector('.stage-status').textContent = 'Synthesizing...';
    card2.querySelector('.stage-status').className = 'stage-status status-running';
    appendLog('======================================================================', 'info');
    appendLog('[STAGE 2: IDE UX] Codebase Synthesis via IDE Assistant (Copilot / Cursor)...', 'stage');
    appendLog('-> Directive: "@workspace /specs/service-contract.json Implement full microservice"', 'info');
    await wait(600);

    appendLog('-> Generated modular clean-architecture components:', 'success');
    appendLog('   ✔ src/models/task.js [Domain validation & boundaries]', 'info');
    appendLog('   ✔ src/repositories/task-repository.js [In-memory seed data]', 'info');
    appendLog('   ✔ src/services/task-service.js [Business logic & transitions]', 'info');
    appendLog('   ✔ src/controllers/task-controller.js [REST handlers]', 'info');
    appendLog('   ✔ src/controllers/health-controller.js [Health & diagnostics]', 'info');
    appendLog('   ✔ src/middleware/security.js [Headers & latency profiling]', 'info');
    appendLog('   ✔ src/server.js [Native HTTP router]', 'info');
    card2.classList.remove('running');
    card2.querySelector('.stage-status').textContent = 'Completed';
    card2.querySelector('.stage-status').className = 'stage-status status-completed';
    await wait(500);

    // Connector 2-3
    appendLog('\n[Handoff Protocol 2 -> 3] Codebase & Specs ingested by Headless CLI AI...', 'stage');
    await wait(400);

    // Stage 3: CLI UX
    const card3 = document.getElementById('stage-card-3');
    card3.classList.add('running');
    card3.querySelector('.stage-status').textContent = 'Auditing...';
    card3.querySelector('.stage-status').className = 'stage-status status-running';
    appendLog('======================================================================', 'info');
    appendLog('[STAGE 3: CLI UX] Headless Automated Quality Gate & Contract Audit...', 'stage');
    appendLog('-> CLI Tool: Claude Code CLI / Gemini CLI / npm run quality-gate', 'info');
    await wait(500);

    appendLog('-> Running test suite: node --test tests/**/*.test.js', 'info');
    appendLog('   ✔ Task Domain Model [6/6 passed]', 'success');
    appendLog('   ✔ TaskService Business Logic [5/5 passed]', 'success');
    appendLog('   ✔ Contract Compliance Integration Tests [3/3 passed]', 'success');
    appendLog('-> Total Test Results: 14 passed, 0 failed (100% pass rate)', 'success');
    await wait(400);

    appendLog('\n-> Auditing Live Endpoints vs Quality Gate Targets:', 'stage');
    appendLog('   ✔ GET /api/v1/health .............. 200 OK  [2.6ms] (Sec Headers: VALID)', 'success');
    appendLog('   ✔ GET /api/v1/tasks ............... 200 OK  [1.9ms] (Sec Headers: VALID)', 'success');
    appendLog('   ✔ POST /api/v1/tasks .............. 201 OK  [1.4ms] (Sec Headers: VALID)', 'success');
    appendLog('   ✔ POST /api/v1/tasks (invalid) .... 400 Bad [0.9ms] (Sec Headers: VALID)', 'success');
    appendLog('   ✔ GET /api/v1/tasks/:id ........... 200 OK  [0.8ms] (Sec Headers: VALID)', 'success');
    appendLog('   ✔ PATCH /api/v1/tasks/:id ......... 200 OK  [0.8ms] (Sec Headers: VALID)', 'success');
    appendLog('   ✔ DELETE /api/v1/tasks/:id ........ 204 OK  [0.6ms] (Sec Headers: VALID)', 'success');
    appendLog('   ✔ GET /api/v1/tasks/:id (404) ..... 404 OK  [0.6ms] (Sec Headers: VALID)', 'success');
    await wait(400);

    appendLog('\n======================================================================', 'info');
    appendLog('🎉 QUALITY GATE APPROVED: 100% COMPLIANT. READY FOR DEPLOYMENT!', 'success');
    appendLog('   Generated: reports/quality-gate-report.md', 'info');
    appendLog('   Generated: reports/audit-summary.json', 'info');
    appendLog('======================================================================', 'info');

    card3.classList.remove('running');
    card3.querySelector('.stage-status').textContent = 'Completed';
    card3.querySelector('.stage-status').className = 'stage-status status-completed';

    execStatus.textContent = 'Completed (Passed in 2.8s)';
    restartExecBtn.disabled = false;
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  if (runPipelineBtn) {
    runPipelineBtn.addEventListener('click', runSimulation);
  }

  if (restartExecBtn) {
    restartExecBtn.addEventListener('click', runSimulation);
  }
});

// Global copy utility
window.copyCode = function(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event?.target;
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 1500);
    }
  });
};

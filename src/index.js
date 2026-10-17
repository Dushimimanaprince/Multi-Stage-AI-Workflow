import { createServer } from './server.js';

const PORT = process.env.PORT || 4000;
const { server } = createServer();

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Workflow Task Engine Service (Stage 2 IDE Output)`);
  console.log(` Status: Listening on http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/v1/health`);
  console.log(` Tasks:  http://localhost:${PORT}/api/v1/tasks`);
  console.log(`======================================================\n`);
});

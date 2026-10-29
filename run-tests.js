const { spawn } = require('child_process');
const http = require('http');

console.log('1. Starting local HTTP server...');
const serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });

function waitForServer(callback, attempts = 0) {
  if (attempts > 30) {
    console.error('Timeout waiting for server.');
    serverProcess.kill();
    process.exit(1);
  }

  http.get('http://localhost:3000', (res) => {
    if (res.statusCode === 200) {
      console.log('2. Server is ready at http://localhost:3000/');
      callback();
    } else {
      setTimeout(() => waitForServer(callback, attempts + 1), 500);
    }
  }).on('error', () => {
    setTimeout(() => waitForServer(callback, attempts + 1), 500);
  });
}

waitForServer(() => {
  console.log('3. Running Cypress E2E tests and recording video...');
  const cypressProcess = spawn('npx.cmd', ['cypress', 'run', '--config', 'video=true'], { stdio: 'inherit', shell: true });

  cypressProcess.on('close', (code) => {
    console.log(`4. Cypress completed with code: ${code}`);
    serverProcess.kill();
    process.exit(code);
  });
});

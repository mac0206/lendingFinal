const { spawn } = require('child_process');
const path = require('path');

const proc = spawn('npm', ['start'], {
  cwd: path.join(__dirname, '..'),
  shell: true,
  stdio: 'inherit'
});

proc.on('exit', (code) => {
  process.exit(code || 0);
});

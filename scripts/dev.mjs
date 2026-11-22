import { spawn } from 'node:child_process'

const processes = [
  spawn(process.execPath, ['--env-file=.env', 'server/index.js'], { stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit' }),
]

let closing = false

function closeAll(exitCode = 0) {
  if (closing) return
  closing = true
  for (const child of processes) child.kill()
  process.exitCode = exitCode
}

for (const child of processes) {
  child.on('exit', code => {
    if (!closing && code) closeAll(code)
  })
}

process.on('SIGINT', () => closeAll())
process.on('SIGTERM', () => closeAll())

import { spawnSync } from 'node:child_process';
const result = spawnSync('npm', ['run', 'test:security'], {cwd: new URL('../backend', import.meta.url), stdio:'inherit'});
process.exitCode = result.status ?? 1;

import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

export function runProcess(executable, args, options = {}) {
  const {
    cwd,
    env = process.env,
    input = '',
    timeoutMs = 120000,
    maxBytes = 1048576,
    onStdout,
    onStderr,
  } = options;
  return new Promise((resolve) => {
    const started = performance.now();
    const stdout = [];
    const stderr = [];
    let bytes = 0;
    let reason = null;
    let settled = false;
    let drainTimer;
    const child = spawn(executable, args, {
      cwd,
      env,
      shell: false,
      detached: process.platform !== 'win32',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const cleanGroup = () => {
      if (process.platform === 'win32' || !child.pid) return;
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch (error) {
        if (error.code !== 'ESRCH') reason ??= `cleanup_error:${error.code ?? 'unknown'}`;
      }
    };
    const finish = (code, signal = null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(drainTimer);
      cleanGroup();
      child.stdout?.destroy();
      child.stderr?.destroy();
      resolve({
        status: reason ? 'blocked' : 'completed',
        reason,
        exit_code: code,
        signal,
        duration_ms: Math.round(performance.now() - started),
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8'),
        output_bytes: bytes,
        cleanup_scope:
          process.platform === 'win32'
            ? 'direct child only'
            : 'original POSIX process group; escaped groups are outside coverage',
      });
    };
    const stop = (why) => {
      reason ??= why;
      try {
        if (process.platform !== 'win32' && child.pid) process.kill(-child.pid, 'SIGKILL');
        else child.kill('SIGKILL');
      } catch {
        // The child may have already exited. A bounded drain still resolves the trial.
      }
      drainTimer ??= setTimeout(() => finish(child.exitCode, child.signalCode), 250);
    };
    const timer = setTimeout(() => stop('timeout'), timeoutMs);
    const collect = (target, chunk, sink) => {
      const remaining = Math.max(0, maxBytes - bytes);
      bytes += chunk.length;
      if (remaining) {
        const accepted = chunk.subarray(0, remaining);
        target.push(accepted);
        try {
          sink?.(accepted);
        } catch {
          stop('output_sink_error');
        }
      }
      if (bytes > maxBytes) stop('output_limit');
    };
    child.stdout.on('data', (chunk) => collect(stdout, chunk, onStdout));
    child.stderr.on('data', (chunk) => collect(stderr, chunk, onStderr));
    child.stdin.on('error', () => {});
    child.on('error', (error) => {
      reason = `spawn_error:${error.code ?? 'unknown'}`;
      finish(null);
    });
    child.on('exit', (code, signal) => {
      drainTimer ??= setTimeout(() => {
        stop('open_descendant_pipes');
        finish(code, signal);
      }, 250);
    });
    child.on('close', finish);
    child.stdin.end(input);
  });
}

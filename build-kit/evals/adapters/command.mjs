import { spawn } from 'node:child_process';

/**
 * Runs an external model adapter. The command receives the eval input as JSON on stdin and must emit
 * one JSON object on stdout matching the response contract supplied in that input.
 */
export async function run(input, options) {
  if (!options.command) throw new Error('The command adapter requires --command <executable>.');
  return new Promise((resolve, reject) => {
    const child = spawn(options.command, options.args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Adapter command exited ${code}: ${stderr.trim()}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(new Error(`Adapter command must emit one JSON object: ${error.message}`));
      }
    });
    child.stdin.end(JSON.stringify(input));
  });
}

import { resolve } from 'node:path';
import { collectSourceProvenance } from './provenance.ts';

/** Observe the actual source, also usable from a package without Git. Does not write. */
export async function runSource(args: string[]) {
  let kitRoot = resolve(import.meta.dirname, '../..');
  let seenRoot = false;
  let json = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    if (arg === '--json' && !json) json = true;
    else if ((arg === '--kit-root' || arg.startsWith('--kit-root=')) && !seenRoot) {
      const value = arg.startsWith('--kit-root=') ? arg.slice(11) : args[++i];
      if (!value || value.startsWith('--')) throw new Error('--kit-root requires a value.');
      kitRoot = resolve(value);
      seenRoot = true;
    } else throw new Error(`Unknown or repeated source option: ${arg}`);
  }
  const source = collectSourceProvenance(kitRoot);
  if (json) console.log(JSON.stringify(source, null, 2));
  else
    console.log(
      `Build Kit ${source.kit_version}\nSource: ${source.content_sha256}\nGit: ${source.git.revision ?? 'unavailable'} (${source.git.worktree})\nDependencies: not verified. Provenance is not authenticated.`,
    );
  return source;
}

import { intro, outro } from '@clack/prompts';
import { type DoctorResult, diagnosticOptions, inspectProject } from './diagnostics.ts';

export type { DoctorResult } from './diagnostics.ts';

export async function runDoctor(args: string[]): Promise<DoctorResult> {
  const json = args.includes('--json');
  const { result } = inspectProject(diagnosticOptions(args));
  if (json) console.log(JSON.stringify(result, null, 2));
  else {
    intro('composed-kit doctor');
    console.log(`Scope: ${result.scope}. Native runtime behavior is not verified.`);
    if (result.agents.length) console.log(`Agents: ${result.agents.join(', ')}`);
    for (const finding of result.findings) {
      console.log(
        `  ${finding.severity === 'error' ? '✗' : '⚠'} [${finding.id}] ${finding.message}`,
      );
    }
    outro(
      result.healthy
        ? `✓ Healthy installation. ${result.warnings.length} warning(s).`
        : '✗ Issues detected.',
    );
  }
  return result;
}

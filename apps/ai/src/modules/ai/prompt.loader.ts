import * as fs from 'fs';
import * as path from 'path';

export function loadMasterPrompt(): string {
  const p = path.join(
    process.cwd(),
    '../../packages/prompts/system/master.system.md'
  );
  return fs.readFileSync(p, 'utf-8');
}

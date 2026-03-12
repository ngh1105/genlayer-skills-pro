import { access } from 'node:fs/promises';
import { join } from 'node:path';
import type { AIType } from '../types/index.js';

const DETECTION_MAP: Array<{ folders: string[]; aiType: AIType }> = [
  { folders: ['.claude'], aiType: 'claude' },
  { folders: ['.cursor'], aiType: 'cursor' },
  { folders: ['.windsurf'], aiType: 'windsurf' },
  { folders: ['.agent'], aiType: 'antigravity' },
  { folders: ['.github/copilot-instructions.md', '.github'], aiType: 'copilot' },
  { folders: ['.kiro'], aiType: 'kiro' },
  { folders: ['AGENTS.md'], aiType: 'codex' },
  { folders: ['.roo'], aiType: 'roocode' },
  { folders: ['.gemini'], aiType: 'gemini' },
];

async function pathExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect which AI assistants are present in the current project directory.
 * Returns a list of detected AI types and a suggested default.
 */
export async function detectAITypes(cwd: string): Promise<{
  detected: AIType[];
  suggested: AIType | null;
}> {
  const detected: AIType[] = [];

  for (const { folders, aiType } of DETECTION_MAP) {
    for (const folder of folders) {
      if (await pathExists(join(cwd, folder))) {
        detected.push(aiType);
        break;
      }
    }
  }

  return {
    detected,
    suggested: detected.length === 1 ? detected[0] : null,
  };
}

export function getAIDescription(aiType: AIType): string {
  const names: Record<AIType, string> = {
    claude: 'Claude Code',
    cursor: 'Cursor IDE',
    windsurf: 'Windsurf IDE',
    antigravity: 'Antigravity',
    copilot: 'GitHub Copilot',
    kiro: 'Kiro IDE',
    codex: 'Codex CLI',
    roocode: 'Roo Code',
    gemini: 'Gemini CLI',
    all: 'All AI Assistants',
  };
  return names[aiType];
}

import { access } from 'node:fs/promises';
import { join } from 'node:path';
const DETECTION_MAP = [
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
async function pathExists(p) {
    try {
        await access(p);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Detect which AI assistants are present in the current project directory.
 * Returns a list of detected AI types and a suggested default.
 */
export async function detectAITypes(cwd) {
    const detected = [];
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
export function getAIDescription(aiType) {
    const names = {
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
//# sourceMappingURL=detect.js.map
import { mkdir, cp, writeFile, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
// After tsc: dist/utils/template.js → ../../
const ROOT_DIR = join(__dirname, '..', '..');
const ASSETS_DIR = join(ROOT_DIR, 'assets');
const SKILLS = ['write-contract', 'genvm-lint', 'direct-tests', 'integration-tests', 'commit'];
const AI_TO_PLATFORM = {
    claude: 'claude',
    cursor: 'cursor',
    windsurf: 'windsurf',
    antigravity: 'antigravity',
    copilot: 'copilot',
    kiro: 'kiro',
    codex: 'codex',
    roocode: 'roocode',
    gemini: 'gemini',
};
async function exists(path) {
    try {
        await access(path);
        return true;
    }
    catch {
        return false;
    }
}
async function loadPlatformConfig(aiType) {
    const platformName = AI_TO_PLATFORM[aiType];
    const configPath = join(ASSETS_DIR, 'templates', 'platforms', `${platformName}.json`);
    const content = await readFile(configPath, 'utf-8');
    return JSON.parse(content);
}
/**
 * Install skills for a single AI platform.
 * Returns list of paths written.
 */
export async function installForPlatform(aiType, targetDir, force = false) {
    const config = await loadPlatformConfig(aiType);
    const written = [];
    if (config.installMode === 'folder' && config.skillsFolder) {
        const destDir = join(targetDir, config.skillsFolder);
        if (!force && await exists(destDir)) {
            // Merge: copy only missing files
        }
        await mkdir(destDir, { recursive: true });
        // Copy each skill folder individually from root
        for (const skill of SKILLS) {
            const skillSrc = join(ROOT_DIR, skill);
            const skillDest = join(destDir, skill);
            if (await exists(skillSrc)) {
                await cp(skillSrc, skillDest, { recursive: true });
            }
        }
        written.push(config.skillsFolder);
    }
    else if (config.installMode === 'file' && config.filePath) {
        // For single-file installs (e.g. copilot AGENTS.md)
        const destFile = join(targetDir, config.filePath);
        const destParent = dirname(destFile);
        await mkdir(destParent, { recursive: true });
        // Aggregate all skill content into one file
        const skillContent = await buildAggregatedSkillFile(ROOT_DIR, config.platform);
        if (!force && await exists(destFile)) {
            // Append to existing file
            const existing = await readFile(destFile, 'utf-8');
            if (!existing.includes('<!-- genlayer-skills -->')) {
                await writeFile(destFile, existing + '\n\n' + skillContent, 'utf-8');
            }
        }
        else {
            await writeFile(destFile, skillContent, 'utf-8');
        }
        written.push(config.filePath);
    }
    return written;
}
/**
 * Install skills for all supported platforms.
 */
export async function installForAll(targetDir, force = false) {
    const results = new Map();
    for (const aiType of Object.keys(AI_TO_PLATFORM)) {
        const written = await installForPlatform(aiType, targetDir, force);
        results.set(aiType, written);
    }
    return results;
}
/**
 * Build a single aggregated markdown file of all skill content.
 * Used for single-file platforms like copilot and codex.
 */
async function buildAggregatedSkillFile(skillsDir, platform) {
    const SKILLS = ['write-contract', 'genvm-lint', 'direct-tests', 'integration-tests', 'commit'];
    const sections = [
        `<!-- genlayer-skills -->`,
        `# GenLayer Skills\n`,
        `> Installed by glskills-cli for ${platform}\n`,
    ];
    for (const skill of SKILLS) {
        const skillFile = join(skillsDir, skill, 'SKILL.md');
        if (await exists(skillFile)) {
            const content = await readFile(skillFile, 'utf-8');
            // Strip frontmatter
            const stripped = content.replace(/^---[\s\S]*?---\n\n?/, '');
            sections.push(`---\n\n## Skill: ${skill}\n\n` + stripped);
        }
    }
    return sections.join('\n');
}
//# sourceMappingURL=template.js.map
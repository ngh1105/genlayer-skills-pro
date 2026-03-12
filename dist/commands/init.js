import chalk from 'chalk';
import prompts from 'prompts';
import { AI_TYPES, AI_DISPLAY_NAMES } from '../types/index.js';
import { detectAITypes, getAIDescription } from '../utils/detect.js';
import { installForPlatform, installForAll } from '../utils/template.js';
import { logger } from '../utils/logger.js';
export async function initCommand(options) {
    logger.title('GenLayer Skills — Installer');
    const cwd = process.cwd();
    let aiType = options.ai;
    // Auto-detect or prompt
    if (!aiType) {
        const { detected, suggested } = await detectAITypes(cwd);
        if (detected.length > 0) {
            logger.info(`Detected: ${detected.map(t => chalk.cyan(getAIDescription(t))).join(', ')}`);
        }
        const response = await prompts({
            type: 'select',
            name: 'aiType',
            message: 'Select AI assistant to install for:',
            choices: AI_TYPES.map(type => ({
                title: AI_DISPLAY_NAMES[type],
                value: type,
                description: type === 'all' ? 'Install for all supported AI assistants' : undefined,
            })),
            initial: suggested ? AI_TYPES.indexOf(suggested) : 0,
        });
        if (!response.aiType) {
            logger.warn('Installation cancelled.');
            return;
        }
        aiType = response.aiType;
    }
    logger.info(`Installing for: ${chalk.cyan(AI_DISPLAY_NAMES[aiType])}`);
    if (options.dryRun) {
        logger.warn('Dry run mode — no files will be written.');
        logger.blank();
    }
    const spinner = logger.spinner('Installing GenLayer skills...');
    try {
        let writtenPaths = [];
        if (options.dryRun) {
            spinner.succeed('Dry run complete — no files written.');
            logger.blank();
            return;
        }
        if (aiType === 'all') {
            const results = await installForAll(cwd, options.force ?? false);
            spinner.succeed('Installed for all AI assistants!');
            logger.blank();
            for (const [ai, paths] of results.entries()) {
                if (paths.length > 0) {
                    logger.success(`${AI_DISPLAY_NAMES[ai]}`);
                    for (const p of paths)
                        logger.file(p);
                }
            }
        }
        else {
            writtenPaths = await installForPlatform(aiType, cwd, options.force ?? false);
            spinner.succeed(`GenLayer skills installed for ${AI_DISPLAY_NAMES[aiType]}!`);
            logger.blank();
            for (const p of writtenPaths)
                logger.file(p);
        }
        logger.blank();
        logger.success('Done! Your AI assistant can now use GenLayer skills.');
        logger.info('Tip: Ask your AI to read skills/write-contract/SKILL.md to get started.');
        logger.blank();
    }
    catch (err) {
        spinner.fail('Installation failed.');
        logger.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}
//# sourceMappingURL=init.js.map
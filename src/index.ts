#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initCommand } from './commands/init.js';
import type { AIType } from './types/index.js';
import { AI_TYPES } from './types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getVersion(): Promise<string> {
  try {
    const pkgPath = join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8')) as { version: string };
    return pkg.version;
  } catch {
    return '1.0.0';
  }
}

const program = new Command();
const version = await getVersion();

program
  .name('glskills')
  .description(
    `${chalk.cyan('glskills')} — Install GenLayer skills for AI coding assistants\n` +
    `  Supports: Claude, Cursor, Windsurf, Antigravity, Copilot, Kiro, Codex, and more`
  )
  .version(version);

program
  .command('init')
  .description('Install GenLayer skills into your project')
  .option(
    '--ai <type>',
    `AI assistant to install for (${AI_TYPES.filter(t => t !== 'all').join(', ')}, all)`
  )
  .option('--force', 'Overwrite existing skill files', false)
  .option('--dry-run', 'Preview what would be installed without writing files', false)
  .action(async (options: { ai?: string; force: boolean; dryRun: boolean }) => {
    const aiType = options.ai as AIType | undefined;
    if (aiType && aiType !== 'all' && !AI_TYPES.includes(aiType)) {
      console.error(chalk.red(`Unknown AI type: "${aiType}"`));
      console.error(`Supported: ${AI_TYPES.join(', ')}`);
      process.exit(1);
    }
    await initCommand({ ai: aiType, force: options.force, dryRun: options.dryRun });
  });

program
  .command('list')
  .description('List available GenLayer skills')
  .action(() => {
    console.log('');
    console.log(`  ${chalk.cyan('GenLayer Skills')}`);
    console.log('');
    const skills = [
      ['write-contract', 'Write GenLayer intelligent contracts'],
      ['genvm-lint', 'Validate contracts with the GenVM linter'],
      ['direct-tests', 'Fast in-memory direct mode tests'],
      ['integration-tests', 'Full consensus integration tests'],
      ['commit', 'Git commit with conventional message'],
    ];
    for (const [name, desc] of skills) {
      console.log(`  ${chalk.green('▸')} ${chalk.bold(name.padEnd(22))} ${chalk.dim(desc)}`);
    }
    console.log('');
    console.log(`  Run ${chalk.cyan('glskills init')} to install skills for your AI assistant.`);
    console.log('');
  });

program.parse();

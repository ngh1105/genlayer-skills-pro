import chalk from 'chalk';
import ora, { type Ora } from 'ora';

const BRAND = chalk.cyan('glskills');

export const logger = {
  title(msg: string): void {
    console.log('');
    console.log(`  ${BRAND}  ${chalk.bold(msg)}`);
    console.log('');
  },

  info(msg: string): void {
    console.log(`  ${chalk.blue('ℹ')}  ${msg}`);
  },

  success(msg: string): void {
    console.log(`  ${chalk.green('✔')}  ${msg}`);
  },

  warn(msg: string): void {
    console.log(`  ${chalk.yellow('⚠')}  ${chalk.yellow(msg)}`);
  },

  error(msg: string): void {
    console.log(`  ${chalk.red('✖')}  ${chalk.red(msg)}`);
  },

  file(path: string): void {
    console.log(`     ${chalk.dim('→')} ${chalk.dim(path)}`);
  },

  blank(): void {
    console.log('');
  },

  spinner(text: string): Ora {
    return ora({ text, indent: 2 }).start();
  },
};

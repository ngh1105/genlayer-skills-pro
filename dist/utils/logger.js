import chalk from 'chalk';
import ora from 'ora';
const BRAND = chalk.cyan('glskills');
export const logger = {
    title(msg) {
        console.log('');
        console.log(`  ${BRAND}  ${chalk.bold(msg)}`);
        console.log('');
    },
    info(msg) {
        console.log(`  ${chalk.blue('ℹ')}  ${msg}`);
    },
    success(msg) {
        console.log(`  ${chalk.green('✔')}  ${msg}`);
    },
    warn(msg) {
        console.log(`  ${chalk.yellow('⚠')}  ${chalk.yellow(msg)}`);
    },
    error(msg) {
        console.log(`  ${chalk.red('✖')}  ${chalk.red(msg)}`);
    },
    file(path) {
        console.log(`     ${chalk.dim('→')} ${chalk.dim(path)}`);
    },
    blank() {
        console.log('');
    },
    spinner(text) {
        return ora({ text, indent: 2 }).start();
    },
};
//# sourceMappingURL=logger.js.map
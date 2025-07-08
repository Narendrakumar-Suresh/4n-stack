import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, '..', 'templates');
const extrasDir = path.join(templateDir, 'addons');

export async function main() {
  console.log(chalk.bold.green('\n✨ Welcome to create-4n-app CLI'));

  const responses = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:'
    },
    {
      type: 'confirm',
      name: 'wantBetterAuth',
      message: 'Include Better Auth?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'wantDrizzle',
      message: 'Include Drizzle (DB)?',
      initial: true
    },
    {
      type: 'select',
      name: 'pm',
      message: 'Choose your package manager:',
      choices: [
        { title: 'pnpm', value: 'pnpm' },
        { title: 'npm', value: 'npm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'bun', value: 'bun' },
      ]
    }
  ]);

  const { projectName, wantBetterAuth, wantDrizzle, pm } = responses;
  const targetDir = path.join(process.cwd(), projectName);
  const spinner = ora('Scaffolding project...').start();

  try {
    await fs.copy(path.join(templateDir, 'base'), targetDir);

    // Auth + DB logic
    if (wantBetterAuth && wantDrizzle) {
      await fs.copy(path.join(extrasDir, 'drizzle', 'db-auth'), path.join(targetDir, 'db'));
    } else if (wantDrizzle) {
      await fs.copy(path.join(extrasDir, 'drizzle', 'db'), path.join(targetDir, 'db'));
    }

    if (wantBetterAuth) {
      await fs.copy(path.join(extrasDir, 'better-auth'), path.join(targetDir, 'auth'));
    }

    spinner.succeed('Project scaffolded successfully.');

    console.log(chalk.cyan('\nInstalling dependencies...'));
    const installCmd = getInstallCommand(pm);
    await execa(pm, installCmd, { cwd: targetDir, stdio: 'inherit' });

    console.log(chalk.green(`\n✅ Done! CD into your project with \`cd ${projectName}\` and start building!`));
  } catch (err) {
    spinner.fail('Setup failed.');
    console.error(err);
  }
}

function getInstallCommand(pm) {
  switch (pm) {
    case 'yarn':
      return ['install'];
    case 'pnpm':
      return ['install'];
    case 'bun':
      return ['install'];
    default:
      return ['install'];
  }
}
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import { exit } from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, '..', 'templates');
const extrasDir = path.join(templateDir, 'addons');

export class SetupError extends Error {
  constructor(message, code = 1) {
    super(message);
    this.name = 'SetupError';
    this.code = code;
  }
}

const handleInterrupt = () => {
  console.log(chalk.yellow('\nOperation cancelled by user. Exiting...'));
  exit(0);
};

export async function main() {
  // Handle process interruptions
  process.on('SIGINT', handleInterrupt);
  
  try {
    console.log(chalk.bold.green('\n✨ Welcome to create-4n-app CLI'));

    const responses = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      validate: value => {
        if (!value || value.trim() === '') {
          return 'Project name cannot be empty';
        }
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Project name can only contain lowercase letters, numbers, and hyphens';
        }
        return true;
      }
    },
    {
      type: 'toggle',
      name: 'wantBetterAuth',
      message: 'Would you like to use Better Auth?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
    },
    {
      type: 'toggle',
      name: 'wantDrizzle',
      message: 'Would you like to use Drizzle (DB)?',
      initial: true,
      active: 'Yes',
      inactive: 'No'
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

  if (Object.keys(responses).length === 0) {
    throw new SetupError('No responses received. Setup aborted.');
  }

  const { projectName, wantBetterAuth, wantDrizzle, pm } = responses;
  
  // Validate package manager
  const validPackageManagers = ['pnpm', 'npm', 'yarn', 'bun'];
  if (!validPackageManagers.includes(pm)) {
    throw new SetupError(`Invalid package manager: ${pm}`);
  }

  const targetDir = path.join(process.cwd(), projectName);
  
  // Check if directory already exists
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory ${projectName} already exists. Overwrite?`,
      initial: false
    });
    
    if (!overwrite) {
      throw new SetupError('Operation cancelled by user.');
    }
    
    // Remove existing directory if exists and user confirms
    await fs.remove(targetDir);
  }

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
    // Project setup completed successfully
    } catch (err) {
      spinner.fail('Setup failed.');
      if (err instanceof SetupError) {
        console.error(chalk.red(`\n❌ ${err.message}`));
      } else {
        console.error(chalk.red(`\n❌ An unexpected error occurred:`));
        console.error(chalk.gray(err.stack || err.message));
      }
      
      // Clean up on failure
      try {
        if (fs.existsSync(targetDir)) {
          await fs.remove(targetDir);
        }
      } catch (cleanupErr) {
        console.error(chalk.yellow('\n⚠️  Failed to clean up temporary files:', cleanupErr.message));
      }
      
      process.exit(1);
    } finally {
      // Clean up event listeners
      process.off('SIGINT', handleInterrupt);
    }
  } catch (err) {
    console.error(chalk.red(`\n❌ Setup failed: ${err.message}`));
    process.exit(1);
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
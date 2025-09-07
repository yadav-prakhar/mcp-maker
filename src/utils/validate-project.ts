/**
 * Utility functions for project validation
 */
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Validate that the current directory is an MCP server project
 * @returns Promise that resolves if the project is valid, rejects otherwise
 */
export async function validateMCPProject(): Promise<void> {
  const cwd = process.cwd();

  // Check if package.json exists
  const packageJsonPath = path.join(cwd, 'package.json');
  if (!(await fs.pathExists(packageJsonPath))) {
    throw new Error(chalk.red('Error: Not in an MCP server project. No package.json found.'));
  }

  // Check if src directory exists
  const srcDirPath = path.join(cwd, 'src');
  if (!(await fs.pathExists(srcDirPath))) {
    throw new Error(chalk.red('Error: Not in an MCP server project. No src directory found.'));
  }

  // Check if src/server directory exists
  const serverDirPath = path.join(cwd, 'src', 'server');
  if (!(await fs.pathExists(serverDirPath))) {
    throw new Error(
      chalk.red('Error: Not in an MCP server project. No src/server directory found.')
    );
  }

  // Check if src/tools directory exists
  const toolsDirPath = path.join(cwd, 'src', 'tools');
  if (!(await fs.pathExists(toolsDirPath))) {
    throw new Error(
      chalk.red('Error: Not in an MCP server project. No src/tools directory found.')
    );
  }

  // Check if src/services directory exists
  const servicesDirPath = path.join(cwd, 'src', 'services');
  if (!(await fs.pathExists(servicesDirPath))) {
    throw new Error(
      chalk.red('Error: Not in an MCP server project. No src/services directory found.')
    );
  }
}

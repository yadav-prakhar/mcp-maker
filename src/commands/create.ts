import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import { execa } from 'execa';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

/**
 * Create a new MCP server project
 * @param name - The name of the project
 * @param options - Command options
 */
export async function createServer(
  name?: string,
  options?: { http?: boolean; cors?: boolean; port?: number; install?: boolean }
): Promise<void> {
  let projectName: string;
  // Default install to true if not specified
  const shouldInstall = options?.install !== false;

  // Prompt for project name if not provided
  if (!name) {
    const response = await prompts([
      {
        type: 'text',
        name: 'projectName',
        message: 'What is the name of your MCP server project?',
        validate: (value: string) =>
          /^[a-z0-9-]+$/.test(value)
            ? true
            : 'Project name can only contain lowercase letters, numbers, and hyphens',
      },
    ]);

    if (!response.projectName) {
      console.log(chalk.yellow('Project creation cancelled'));
      process.exit(1);
    }

    projectName = response.projectName as string;
  } else {
    projectName = name;
  }

  if (!projectName) {
    throw new Error('Project name is required');
  }

  // Set up project directories
  const projectDir = path.join(process.cwd(), projectName);
  const srcDir = path.join(projectDir, 'src');
  const serverDir = path.join(srcDir, 'server');
  const toolsDir = path.join(srcDir, 'tools');
  const servicesDir = path.join(srcDir, 'services');
  const utilsDir = path.join(srcDir, 'utils');
  const promptsDir = path.join(srcDir, 'prompts');
  const resourcesDir = path.join(srcDir, 'resources');
  const configDir = path.join(srcDir, 'config');

  try {
    console.log(chalk.blue('Creating project structure...'));
    
    // Create project directories
    await fs.mkdir(projectDir);
    await fs.mkdir(srcDir);
    await fs.mkdir(serverDir);
    await fs.mkdir(toolsDir);
    await fs.mkdir(servicesDir);
    await fs.mkdir(utilsDir);
    await fs.mkdir(promptsDir);
    await fs.mkdir(resourcesDir);
    await fs.mkdir(configDir);

    // Create package.json
    const packageJson = {
      name: projectName,
      version: '0.1.0',
      description: `${projectName} MCP server`,
      type: 'module',
      scripts: {
        build: 'tsc',
        watch: 'tsc --watch',
        start: 'node dist/index.js',
      },
      dependencies: {
        "@modelcontextprotocol/sdk": "^1.17.5",
        "pino": "^8.18.0",
        "pino-pretty": "^10.3.1",
      },
      devDependencies: {
        '@types/node': '^20.11.24',
        typescript: '^5.3.3',
      },
      engines: {
        node: '>=18.19.0',
      },
    };

    // Create tsconfig.json
    const tsconfig = {
      compilerOptions: {
        target: 'ESNext',
        module: 'ESNext',
        moduleResolution: 'node',
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
      },
      include: ['src/**/*'],
      exclude: ['node_modules'],
    };

    // Create .gitignore
    const gitignore = `node_modules
dist
.env
logs
.DS_Store
.idea
.vscode
`;

    // Get the template directory
    const templateDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'templates', 'project');
    
    // Read and compile templates
    const indexTemplate = await fs.readFile(path.join(templateDir, 'index.ts.template'), 'utf-8');
    const compiledIndexTemplate = Handlebars.compile(indexTemplate);
    
    const toolHandlerTemplate = await fs.readFile(path.join(templateDir, 'server', 'toolHandler.ts.template'), 'utf-8');
    const compiledToolHandlerTemplate = Handlebars.compile(toolHandlerTemplate);
    
    const promptHandlerTemplate = await fs.readFile(path.join(templateDir, 'server', 'promptHandler.ts.template'), 'utf-8');
    const compiledPromptHandlerTemplate = Handlebars.compile(promptHandlerTemplate);
    
    const resourceHandlerTemplate = await fs.readFile(path.join(templateDir, 'server', 'resourceHandler.ts.template'), 'utf-8');
    const compiledResourceHandlerTemplate = Handlebars.compile(resourceHandlerTemplate);
    
    const toolsIndexTemplate = await fs.readFile(path.join(templateDir, 'tools', 'index.ts.template'), 'utf-8');
    const compiledToolsIndexTemplate = Handlebars.compile(toolsIndexTemplate);
    
    const toolsUtilsTemplate = await fs.readFile(path.join(templateDir, 'tools', 'utils.ts.template'), 'utf-8');
    const compiledToolsUtilsTemplate = Handlebars.compile(toolsUtilsTemplate);
    
    const servicesIndexTemplate = await fs.readFile(path.join(templateDir, 'services', 'index.ts.template'), 'utf-8');
    const compiledServicesIndexTemplate = Handlebars.compile(servicesIndexTemplate);
    
    const promptsIndexTemplate = await fs.readFile(path.join(templateDir, 'prompts', 'index.ts.template'), 'utf-8');
    const compiledPromptsIndexTemplate = Handlebars.compile(promptsIndexTemplate);
    
    const resourcesIndexTemplate = await fs.readFile(path.join(templateDir, 'resources', 'index.ts.template'), 'utf-8');
    const compiledResourcesIndexTemplate = Handlebars.compile(resourcesIndexTemplate);
    
    const loggerTemplate = await fs.readFile(path.join(templateDir, 'utils', 'logger.ts.template'), 'utf-8');
    const compiledLoggerTemplate = Handlebars.compile(loggerTemplate);
    
    const serverUtilsTemplate = await fs.readFile(path.join(templateDir, 'utils', 'serverUtils.ts.template'), 'utf-8');
    const compiledServerUtilsTemplate = Handlebars.compile(serverUtilsTemplate);
    
    const configTemplate = await fs.readFile(path.join(templateDir, 'config', 'index.ts.template'), 'utf-8');
    const compiledConfigTemplate = Handlebars.compile(configTemplate);

    // Prepare template data
    const templateData = {
      name: projectName,
      http: options?.http || false,
      port: options?.port || 8080,
      cors: options?.cors || false,
      toolImports: {},
      toolExports: {},
      toolArrays: {},
      toolHandlers: [],
      serviceExports: {},
    };

    // Write files
    console.log(chalk.blue('Creating project files...'));
    
    const filesToWrite = [
      fs.writeFile(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2)),
      fs.writeFile(path.join(projectDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2)),
      fs.writeFile(path.join(projectDir, '.gitignore'), gitignore),
      fs.writeFile(path.join(srcDir, 'index.ts'), compiledIndexTemplate(templateData)),
      fs.writeFile(path.join(serverDir, 'toolHandler.ts'), compiledToolHandlerTemplate(templateData)),
      fs.writeFile(path.join(serverDir, 'promptHandler.ts'), compiledPromptHandlerTemplate(templateData)),
      fs.writeFile(path.join(serverDir, 'resourceHandler.ts'), compiledResourceHandlerTemplate(templateData)),
      fs.writeFile(path.join(toolsDir, 'index.ts'), compiledToolsIndexTemplate(templateData)),
      fs.writeFile(path.join(toolsDir, 'utils.ts'), compiledToolsUtilsTemplate(templateData)),
      fs.writeFile(path.join(servicesDir, 'index.ts'), compiledServicesIndexTemplate(templateData)),
      fs.writeFile(path.join(promptsDir, 'index.ts'), compiledPromptsIndexTemplate(templateData)),
      fs.writeFile(path.join(resourcesDir, 'index.ts'), compiledResourcesIndexTemplate(templateData)),
      fs.writeFile(path.join(utilsDir, 'logger.ts'), compiledLoggerTemplate(templateData)),
      fs.writeFile(path.join(utilsDir, 'serverUtils.ts'), compiledServerUtilsTemplate(templateData)),
      fs.writeFile(path.join(configDir, 'index.ts'), compiledConfigTemplate(templateData)),
    ];

    await Promise.all(filesToWrite);

    // Create README.md
    const readmeContent = `# ${projectName} MCP Server

A TypeScript MCP server created with mcp-cli.

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

### Start

\`\`\`bash
npm start
\`\`\`

## Adding Components

### Add a Tool

\`\`\`bash
mcp add tool <tool-name>
\`\`\`

### Add a Service

\`\`\`bash
mcp add service <service-name>
\`\`\`
`;

    await fs.writeFile(path.join(projectDir, 'README.md'), readmeContent);

    // Initialize git repository
    console.log(chalk.blue('Initializing git repository...'));
    const gitInit = spawnSync('git', ['init'], {
      cwd: projectDir,
      stdio: 'inherit',
      shell: true,
    });

    if (gitInit.status !== 0) {
      console.warn(chalk.yellow('Failed to initialize git repository. You may want to do this manually.'));
    }

    // Install dependencies if requested
    if (shouldInstall) {
      console.log(chalk.blue('Installing dependencies...'));
      const npmInstall = spawnSync('npm', ['install'], {
        cwd: projectDir,
        stdio: 'inherit',
        shell: true,
      });

      if (npmInstall.status !== 0) {
        console.warn(chalk.yellow('Failed to install dependencies. You may want to run npm install manually.'));
      } else {
        console.log(chalk.blue('Building project...'));
        const tscBuild = await execa('npx', ['tsc'], {
          cwd: projectDir,
          stdio: 'inherit',
        });

        if (tscBuild.exitCode !== 0) {
          console.warn(chalk.yellow('Failed to build TypeScript. You may want to run npm run build manually.'));
        }
      }

      console.log(chalk.green(`
Project ${projectName} created and built successfully!

You can now:
1. cd ${projectName}
2. Add tools using:
   mcp add tool <tool-name>
3. Add services using:
   mcp add service <service-name>
      `));
    } else {
      console.log(chalk.green(`
Project ${projectName} created successfully (without dependencies)!

You can now:
1. cd ${projectName}
2. Run 'npm install' to install dependencies
3. Run 'npm run build' to build the project
4. Add tools using:
   mcp add tool <tool-name>
5. Add services using:
   mcp add service <service-name>
      `));
    }
  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
    process.exit(1);
  }
}
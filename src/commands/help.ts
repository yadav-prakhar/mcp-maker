import chalk from 'chalk';

/**
 * Display general help information
 */
export function helpGeneral(): void {
  console.log(chalk.bold.blue('\nMCP CLI - Model Context Protocol Server Utility\n'));
  console.log(chalk.gray('A CLI utility to create and manage TypeScript MCP servers\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log('  mcp [command] [subcommand] [options]\n');
  
  console.log(chalk.bold('COMMANDS:'));
  console.log(`  ${chalk.green('create')}     Create new components`);
  console.log(`  ${chalk.green('add')}        Add components to an existing MCP server`);
  console.log(`  ${chalk.green('help')}       Display help for a specific command\n`);
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(`  ${chalk.cyan('mcp create server my-server')}     Create a new MCP server project`);
  console.log(`  ${chalk.cyan('mcp add tool my-tool')}            Add a new tool to an existing MCP server`);
  console.log(`  ${chalk.cyan('mcp add service my-service')}       Add a new service to an existing MCP server`);
  console.log(`  ${chalk.cyan('mcp help create server')}           Display help for the create server command\n`);
  
  console.log(chalk.bold('For more information:'));
  console.log(`  Run ${chalk.cyan('mcp help [command] [subcommand]')} for detailed help on a specific command\n`);
}

/**
 * Display help for the create command
 */
export function helpCreate(): void {
  console.log(chalk.bold.blue('\nMCP CLI - Create Command\n'));
  console.log(chalk.gray('Create new components for MCP servers\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log('  mcp create [subcommand] [options]\n');
  
  console.log(chalk.bold('SUBCOMMANDS:'));
  console.log(`  ${chalk.green('server')}     Create a new MCP server project\n`);
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(`  ${chalk.cyan('mcp create server my-server')}     Create a new MCP server project`);
  console.log(`  ${chalk.cyan('mcp create server my-server --http --port 3000')}     Create a server with HTTP transport\n`);
  
  console.log(chalk.bold('For more information:'));
  console.log(`  Run ${chalk.cyan('mcp help create server')} for detailed help on the create server command\n`);
}

/**
 * Display help for the create server command
 */
export function helpCreateServer(): void {
  console.log(chalk.bold.blue('\nMCP CLI - Create Server Command\n'));
  console.log(chalk.gray('Create a new MCP server project with a predefined structure\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log('  mcp create server [name] [options]\n');
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(`  ${chalk.green('name')}       Name of the project (optional, will prompt if not provided)\n`);
  
  console.log(chalk.bold('OPTIONS:'));
  console.log(`  ${chalk.green('--http')}     Use HTTP transport instead of default stdio`);
  console.log(`  ${chalk.green('--cors')}     Enable CORS with wildcard (*) access`);
  console.log(`  ${chalk.green('--port')} <number>     Specify HTTP port (only valid with --http)`);
  console.log(`  ${chalk.green('--no-install')}     Skip npm install and build steps\n`);
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(`  ${chalk.cyan('mcp create server my-server')}     Create a new MCP server with stdio transport`);
  console.log(`  ${chalk.cyan('mcp create server my-server --http --port 3000')}     Create with HTTP transport on port 3000`);
  console.log(`  ${chalk.cyan('mcp create server my-server --http --cors')}     Create with HTTP transport and CORS enabled`);
  console.log(`  ${chalk.cyan('mcp create server my-server --no-install')}     Create without installing dependencies\n`);
  
  console.log(chalk.bold('DESCRIPTION:'));
  console.log(`  This command creates a new MCP server project with the following structure:
  
  my-server/
  ├── src/
  │   ├── server/
  │   │   ├── toolHandler.ts
  │   │   ├── promptHandler.ts
  │   │   └── resourceHandler.ts
  │   ├── tools/
  │   │   ├── index.ts
  │   │   └── utils.ts
  │   ├── services/
  │   │   └── index.ts
  │   ├── prompts/
  │   │   └── index.ts
  │   ├── resources/
  │   │   └── index.ts
  │   ├── utils/
  │   │   └── logger.ts
  │   └── index.ts
  ├── package.json
  ├── tsconfig.json
  ├── .gitignore
  └── README.md
  
  The project is set up with TypeScript, and includes the necessary dependencies to run an MCP server.
  By default, it will also initialize a git repository, install dependencies, and build the project.
  `);
}

/**
 * Display help for the add command
 */
export function helpAdd(): void {
  console.log(chalk.bold.blue('\nMCP CLI - Add Command\n'));
  console.log(chalk.gray('Add new components to an existing MCP server\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log('  mcp add [subcommand] [options]\n');
  
  console.log(chalk.bold('SUBCOMMANDS:'));
  console.log(`  ${chalk.green('tool')}       Add a new tool to an existing MCP server`);
  console.log(`  ${chalk.green('service')}    Add a new service to an existing MCP server\n`);
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(`  ${chalk.cyan('mcp add tool my-tool')}            Add a new tool to an existing MCP server`);
  console.log(`  ${chalk.cyan('mcp add service my-service')}       Add a new service to an existing MCP server\n`);
  
  console.log(chalk.bold('For more information:'));
  console.log(`  Run ${chalk.cyan('mcp help add tool')} or ${chalk.cyan('mcp help add service')} for detailed help\n`);
}

/**
 * Display help for the add tool command
 */
export function helpAddTool(): void {
  console.log(chalk.bold.blue('\nMCP CLI - Add Tool Command\n'));
  console.log(chalk.gray('Add a new tool to an existing MCP server\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log('  mcp add tool [name]\n');
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(`  ${chalk.green('name')}       Name of the tool (optional, will prompt if not provided)\n`);
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(`  ${chalk.cyan('mcp add tool my-tool')}     Add a new tool named "my-tool"\n`);
  
  console.log(chalk.bold('DESCRIPTION:'));
  console.log(`  This command adds a new tool to an existing MCP server project. It will:
  
  1. Create a new directory for the tool in src/tools/
  2. Create the tool implementation file and index file
  3. Update the main tools/index.ts file to include the new tool
  4. Update the server/toolHandler.ts file to include the new tool handler
  
  The command must be run from within an MCP server project directory.
  `);
}

/**
 * Display help for the add service command
 */
export function helpAddService(): void {
  console.log(chalk.bold.blue('\nMCP CLI - Add Service Command\n'));
  console.log(chalk.gray('Add a new service to an existing MCP server\n'));
  
  console.log(chalk.bold('USAGE:'));
  console.log('  mcp add service [name]\n');
  
  console.log(chalk.bold('ARGUMENTS:'));
  console.log(`  ${chalk.green('name')}       Name of the service (optional, will prompt if not provided)\n`);
  
  console.log(chalk.bold('EXAMPLES:'));
  console.log(`  ${chalk.cyan('mcp add service my-service')}     Add a new service named "my-service"\n`);
  
  console.log(chalk.bold('DESCRIPTION:'));
  console.log(`  This command adds a new service to an existing MCP server project. It will:
  
  1. Create a new directory for the service in src/services/
  2. Create the service implementation file and index file
  3. Update the main services/index.ts file to include the new service
  
  The command must be run from within an MCP server project directory.
  `);
}

/**
 * Display help for a specific command
 * @param command - The command to display help for
 * @param subcommand - The subcommand to display help for
 */
export function displayHelp(command?: string, subcommand?: string): void {
  if (!command) {
    helpGeneral();
    return;
  }

  switch (command) {
    case 'create':
      if (subcommand === 'server') {
        helpCreateServer();
      } else {
        helpCreate();
      }
      break;
    case 'add':
      if (subcommand === 'tool') {
        helpAddTool();
      } else if (subcommand === 'service') {
        helpAddService();
      } else {
        helpAdd();
      }
      break;
    default:
      console.log(chalk.yellow(`Unknown command: ${command}`));
      helpGeneral();
      break;
  }
}

import chalk from "chalk";

/**
 * Display help for the main command in GNU style
 */
export function displayMainHelp(): void {
	console.log(chalk.bold("\nNAME"));
	console.log("  mcp-maker - CLI utility to create and manage TypeScript MCP servers");

	console.log(chalk.bold("\nSYNOPSIS"));
	console.log("  mcp-maker [OPTION]... [COMMAND]");

	console.log(chalk.bold("\nDESCRIPTION"));
	console.log("  A command-line utility to create and manage TypeScript MCP servers");
	console.log("  following the ServiceNow MCP structure.");

	console.log(chalk.bold("\nOPTIONS"));
	console.log(`  ${chalk.green("-h, --help")}             display help information`);
	console.log(`  ${chalk.green("-V, --version")}          display version information`);

	console.log(chalk.bold("\nCOMMANDS"));
	console.log(`  ${chalk.green("create")}              Create new components`);
	console.log(`  ${chalk.green("add")}                 Add components to an existing MCP server`);

	console.log(chalk.bold("\nEXAMPLES"));
	console.log(`  ${chalk.cyan("mcp-maker create server my-server")}`);
	console.log('    Create a new MCP server project named "my-server"');
	console.log(`  ${chalk.cyan("mcp-maker add tool my-tool")}`);
	console.log('    Add a new tool named "my-tool" to an existing MCP server');
	console.log(`  ${chalk.cyan("mcp-maker add service my-service")}`);
	console.log('    Add a new service named "my-service" to an existing MCP server');

	console.log(chalk.bold("\nREPORTING BUGS"));
	console.log("  Report bugs to: <your-email@example.com>");

	console.log(chalk.bold("\nCOPYRIGHT"));
	console.log(`  Copyright © ${new Date().getFullYear()} Prakhar Yadav.`);
	console.log("  License Apache-2.0: Apache License 2.0 <https://www.apache.org/licenses/LICENSE-2.0>");
	console.log("  This is free software: you are free to change and redistribute it.");
	console.log("  There is NO WARRANTY, to the extent permitted by law.\n");
}

/**
 * Display help for the create command in GNU style
 */
export function displayCreateHelp(): void {
	console.log(chalk.bold("\nNAME"));
	console.log("  mcp-maker create - Create new components");

	console.log(chalk.bold("\nSYNOPSIS"));
	console.log("  mcp-maker create [OPTION]... COMMAND");

	console.log(chalk.bold("\nDESCRIPTION"));
	console.log("  Create new components for MCP servers");

	console.log(chalk.bold("\nOPTIONS"));
	console.log(`  ${chalk.green("-h, --help")}             display help information`);

	console.log(chalk.bold("\nCOMMANDS"));
	console.log(`  ${chalk.green("server")}              Create a new MCP server project`);

	console.log(chalk.bold("\nEXAMPLES"));
	console.log(`  ${chalk.cyan("mcp-maker create server my-server")}`);
	console.log('    Create a new MCP server project named "my-server"');
	console.log(`  ${chalk.cyan("mcp-maker create server my-server --http --port 3000")}`);
	console.log("    Create a new MCP server with HTTP transport on port 3000\n");
}

/**
 * Display help for the create server command in GNU style
 */
export function displayCreateServerHelp(): void {
	console.log(chalk.bold("\nNAME"));
	console.log("  mcp-maker create server - Create a new MCP server project");

	console.log(chalk.bold("\nSYNOPSIS"));
	console.log("  mcp-maker create server [OPTION]... [NAME]");

	console.log(chalk.bold("\nDESCRIPTION"));
	console.log("  Create a new MCP server project with a predefined structure");

	console.log(chalk.bold("\nARGUMENTS"));
	console.log(`  ${chalk.green("NAME")}                 Name of the project (optional, will prompt if not provided)`);

	console.log(chalk.bold("\nOPTIONS"));
	console.log(`  ${chalk.green("-h, --help")}             display help information`);
	console.log(`  ${chalk.green("--http")}                 use HTTP transport instead of default stdio`);
	console.log(`  ${chalk.green("--cors")}                 enable CORS with wildcard (*) access`);
	console.log(`  ${chalk.green("--port")} <number>        specify HTTP port (only valid with --http)`);
	console.log(`  ${chalk.green("--no-install")}           skip npm install and build steps`);

	console.log(chalk.bold("\nEXAMPLES"));
	console.log(`  ${chalk.cyan("mcp-maker create server my-server")}`);
	console.log("    Create a new MCP server with stdio transport");
	console.log(`  ${chalk.cyan("mcp-maker create server my-server --http --port 3000")}`);
	console.log("    Create with HTTP transport on port 3000");
	console.log(`  ${chalk.cyan("mcp-maker create server my-server --http --cors")}`);
	console.log("    Create with HTTP transport and CORS enabled");
	console.log(`  ${chalk.cyan("mcp-maker create server my-server --no-install")}`);
	console.log("    Create without installing dependencies\n");
}

/**
 * Display help for the add command in GNU style
 */
export function displayAddHelp(): void {
	console.log(chalk.bold("\nNAME"));
	console.log("  mcp-maker add - Add components to an existing MCP server");

	console.log(chalk.bold("\nSYNOPSIS"));
	console.log("  mcp-maker add [OPTION]... COMMAND");

	console.log(chalk.bold("\nDESCRIPTION"));
	console.log("  Add new components to an existing MCP server");

	console.log(chalk.bold("\nOPTIONS"));
	console.log(`  ${chalk.green("-h, --help")}             display help information`);

	console.log(chalk.bold("\nCOMMANDS"));
	console.log(`  ${chalk.green("tool")}                Add a new tool to an existing MCP server`);
	console.log(`  ${chalk.green("service")}             Add a new service to an existing MCP server`);

	console.log(chalk.bold("\nEXAMPLES"));
	console.log(`  ${chalk.cyan("mcp-maker add tool my-tool")}`);
	console.log('    Add a new tool named "my-tool" to an existing MCP server');
	console.log(`  ${chalk.cyan("mcp-maker add service my-service")}`);
	console.log('    Add a new service named "my-service" to an existing MCP server\n');
}

/**
 * Display help for the add tool command in GNU style
 */
export function displayAddToolHelp(): void {
	console.log(chalk.bold("\nNAME"));
	console.log("  mcp-maker add tool - Add a new tool to an existing MCP server");

	console.log(chalk.bold("\nSYNOPSIS"));
	console.log("  mcp-maker add tool [OPTION]... [NAME]");

	console.log(chalk.bold("\nDESCRIPTION"));
	console.log("  Add a new tool to an existing MCP server");

	console.log(chalk.bold("\nARGUMENTS"));
	console.log(`  ${chalk.green("NAME")}                 Name of the tool (optional, will prompt if not provided)`);

	console.log(chalk.bold("\nOPTIONS"));
	console.log(`  ${chalk.green("-h, --help")}             display help information`);

	console.log(chalk.bold("\nEXAMPLES"));
	console.log(`  ${chalk.cyan("mcp-maker add tool my-tool")}`);
	console.log('    Add a new tool named "my-tool" to an existing MCP server\n');
}

/**
 * Display help for the add service command in GNU style
 */
export function displayAddServiceHelp(): void {
	console.log(chalk.bold("\nNAME"));
	console.log("  mcp-maker add service - Add a new service to an existing MCP server");

	console.log(chalk.bold("\nSYNOPSIS"));
	console.log("  mcp-maker add service [OPTION]... [NAME]");

	console.log(chalk.bold("\nDESCRIPTION"));
	console.log("  Add a new service to an existing MCP server");

	console.log(chalk.bold("\nARGUMENTS"));
	console.log(`  ${chalk.green("NAME")}                 Name of the service (optional, will prompt if not provided)`);

	console.log(chalk.bold("\nOPTIONS"));
	console.log(`  ${chalk.green("-h, --help")}             display help information`);

	console.log(chalk.bold("\nEXAMPLES"));
	console.log(`  ${chalk.cyan("mcp-maker add service my-service")}`);
	console.log('    Add a new service named "my-service" to an existing MCP server\n');
}

/**
 * Display help for a specific command
 * @param command - The command to display help for
 * @param subcommand - The subcommand to display help for
 */
export function displayHelp(command?: string, subcommand?: string): void {
	if (!command) {
		displayMainHelp();
		return;
	}

	switch (command) {
		case "create":
			if (subcommand === "server") {
				displayCreateServerHelp();
			} else {
				displayCreateHelp();
			}
			break;
		case "add":
			if (subcommand === "tool") {
				displayAddToolHelp();
			} else if (subcommand === "service") {
				displayAddServiceHelp();
			} else {
				displayAddHelp();
			}
			break;
		default:
			console.log(chalk.yellow(`Unknown command: ${command}`));
			displayMainHelp();
			break;
	}
}

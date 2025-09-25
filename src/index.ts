#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { displayHelp } from "./commands/help-commands.js";

// Import commands
import { createServer } from "./commands/create.js";
import { addTool } from "./commands/add-tool.js";
import { addService } from "./commands/add-service.js";
import { addAuth } from "./commands/add-auth.js";
import { addPrompt } from "./commands/add-prompt.js";

// Create the CLI program
const program = new Command();

// Set up program metadata
program
	.name("mcp-maker")
	.description("CLI utility to create and manage TypeScript MCP servers following the ServiceNow MCP structure")
	.version("0.1.4")
	.helpOption("-h, --help", "display help information");

// Override the default help command to use GNU-style formatting
program.addHelpCommand("help [command]", "Display help for a command");

// Custom help handler for both `mcp help <command>` and `mcp <command> --help` styles
program.on("option:help", function (this: { name(): string; _args?: { value: string }[] }) {
	// This will be called when --help is used
	// Note: parent is not used in this function
	const command = this.name();
	const subcommand = this._args && this._args.length > 0 ? this._args[0].value : undefined;

	displayHelp(command === "mcp-maker" ? undefined : command, subcommand);
	process.exit(0);
});

// Create command group
const createCommand = program.command("create");
createCommand.description("Create new components");

// Create server command
createCommand
	.command("server")
	.description("Create a new MCP server project")
	.argument("[name]", "project name")
	.option("--http", "use HTTP transport instead of default stdio")
	.option("--cors", "enable CORS with wildcard (*) access")
	.option("--port <number>", "specify HTTP port (only valid with --http)", val => parseInt(val, 10))
	.option("--no-install", "skip npm install and build steps")
	.action(createServer);

// Add command group
const addCommand = program.command("add");
addCommand.description("Add new components to an existing MCP server");

// Add tool command
addCommand.command("tool").description("Add a new tool to an existing MCP server").argument("[name]", "tool name").action(addTool);

// Add service command
addCommand.command("service").description("Add a new service to an existing MCP server").argument("[name]", "service name").action(addService);

// Add auth command
addCommand.command("auth").description("Add authentication to an existing MCP server").action(addAuth);

// Add prompt command
addCommand.command("prompt").description("Add a new prompt to an existing MCP server").argument("[name]", "prompt name").action(addPrompt);

// Add help command
const helpCommand = program.command("help");
helpCommand
	.description("Display help for a command")
	.argument("[command]", "command name")
	.argument("[subcommand]", "subcommand name")
	.action(displayHelp);

// Override the help option for all commands to use GNU-style formatting
const overrideHelpOption = (cmd: Command) => {
	// Override the help option
	cmd.helpOption("-h, --help", "display help information");

	// Handle the help option
	cmd.on("option:help", () => {
		const fullCommand: string[] = [];

		// Build the full command path
		let commandObj: Command | undefined = cmd;
		while (commandObj && commandObj.name() !== "mcp-maker") {
			fullCommand.unshift(commandObj.name());
			commandObj = commandObj.parent || undefined;
		}

		// Display help using GNU-style formatting
		if (fullCommand.length > 0) {
			displayHelp(fullCommand[0], fullCommand[1]);
		} else {
			displayHelp();
		}

		process.exit(0);
	});

	// Apply to subcommands recursively
	cmd.commands.forEach(overrideHelpOption);
};

// Apply the override to all commands
program.commands.forEach(overrideHelpOption);

// Display help if no arguments provided
if (process.argv.length === 2) {
	console.log(chalk.blue("Welcome to MCP CLI!"));
	console.log(chalk.gray("Run mcp-maker --help or mcp-maker help to see available commands\n"));
	displayHelp();
}

// Parse command line arguments
program.parse();

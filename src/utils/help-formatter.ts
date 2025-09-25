import chalk from "chalk";
import { Command } from "commander";

/**
 * Add GNU-style help to Commander.js commands
 * @param program - The Commander.js program instance
 */
export function addGNUStyleHelp(program: Command): void {
	// Create a custom help formatter for all commands
	const customHelp = (cmd: Command): string => {
		const name = cmd.name();
		const description = cmd.description();
		const parent = cmd.parent;
		const parentName = parent ? parent.name() : "";
		const fullName = parentName ? `${parentName} ${name}` : name;

		// Build GNU-style help text
		let helpText = "";

		// Add header with name and description
		helpText += chalk.bold("\nNAME\n");
		helpText += `  ${fullName} - ${description}\n\n`;

		// Add synopsis
		helpText += chalk.bold("SYNOPSIS\n");
		helpText += `  ${fullName} `;

		// Add arguments to synopsis if they exist
		const args = cmd.registeredArguments || [];
		if (args.length > 0) {
			args.forEach((arg: any) => {
				const argName = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
				helpText += `${argName} `;
			});
		}

		// Add options indicator to synopsis if there are options
		const options = cmd.options || [];
		if (options.length > 0) {
			helpText += `[OPTION]... `;
		}

		helpText += "\n\n";

		// Add description
		helpText += chalk.bold("DESCRIPTION\n");
		helpText += `  ${description}\n\n`;

		// Add arguments if they exist
		if (args.length > 0) {
			helpText += chalk.bold("ARGUMENTS\n");
			args.forEach((arg: any) => {
				const argName = arg.name || "";
				const argDescription = arg.description || "";
				helpText += `  ${chalk.green(argName.padEnd(20))}${argDescription}\n`;
			});
			helpText += "\n";
		}

		// Add options if they exist
		if (options.length > 0) {
			helpText += chalk.bold("OPTIONS\n");
			options.forEach((option: any) => {
				if (option.flags && option.description) {
					helpText += `  ${chalk.green(option.flags.padEnd(20))}${option.description}\n`;
				}
			});
			helpText += "\n";
		}

		// Add subcommands if they exist
		const commands = cmd.commands || [];
		if (commands.length > 0) {
			helpText += chalk.bold("COMMANDS\n");
			commands.forEach((subCmd: any) => {
				if (!subCmd.hidden) {
					helpText += `  ${chalk.green(subCmd.name().padEnd(20))}${subCmd.description()}\n`;
				}
			});
			helpText += "\n";
		}

		// Add examples based on command
		helpText += chalk.bold("EXAMPLES\n");

		// Main program examples
		if (fullName === "mcp-maker") {
			helpText += `  ${chalk.cyan(`${fullName} create server my-server`)}\n`;
			helpText += `    Create a new MCP server project named "my-server"\n\n`;
			helpText += `  ${chalk.cyan(`${fullName} add tool my-tool`)}\n`;
			helpText += `    Add a new tool named "my-tool" to an existing MCP server\n\n`;
			helpText += `  ${chalk.cyan(`${fullName} add service my-service`)}\n`;
			helpText += `    Add a new service named "my-service" to an existing MCP server\n\n`;
		}
		// Create command examples
		else if (fullName === "mcp-maker create") {
			helpText += `  ${chalk.cyan(`${fullName} server my-server`)}\n`;
			helpText += `    Create a new MCP server project named "my-server"\n\n`;
			helpText += `  ${chalk.cyan(`${fullName} server my-server --http --port 3000`)}\n`;
			helpText += `    Create a new MCP server with HTTP transport on port 3000\n\n`;
		}
		// Create server command examples
		else if (fullName === "mcp-maker create server") {
			helpText += `  ${chalk.cyan(`${fullName} my-server`)}\n`;
			helpText += `    Create a new MCP server with stdio transport\n\n`;
			helpText += `  ${chalk.cyan(`${fullName} my-server --http --port 3000`)}\n`;
			helpText += `    Create with HTTP transport on port 3000\n\n`;
			helpText += `  ${chalk.cyan(`${fullName} my-server --http --cors`)}\n`;
			helpText += `    Create with HTTP transport and CORS enabled\n\n`;
			helpText += `  ${chalk.cyan(`${fullName} my-server --no-install`)}\n`;
			helpText += `    Create without installing dependencies\n\n`;
		}
		// Add command examples
		else if (fullName === "mcp-maker add") {
			helpText += `  ${chalk.cyan(`${fullName} tool my-tool`)}\n`;
			helpText += `    Add a new tool named "my-tool" to an existing MCP server\n\n`;
			helpText += `  ${chalk.cyan(`${fullName} service my-service`)}\n`;
			helpText += `    Add a new service named "my-service" to an existing MCP server\n\n`;
		}
		// Add tool command examples
		else if (fullName === "mcp-maker add tool") {
			helpText += `  ${chalk.cyan(`${fullName} my-tool`)}\n`;
			helpText += `    Add a new tool named "my-tool" to an existing MCP server\n\n`;
		}
		// Add service command examples
		else if (fullName === "mcp-maker add service") {
			helpText += `  ${chalk.cyan(`${fullName} my-service`)}\n`;
			helpText += `    Add a new service named "my-service" to an existing MCP server\n\n`;
		}

		// Add reporting bugs section
		helpText += chalk.bold("REPORTING BUGS\n");
		helpText += `  Report bugs to: https://github.com/yadav-prakhar/mcp-maker/issues\n\n`;

		// Add copyright
		helpText += chalk.bold("COPYRIGHT\n");
		helpText += `  Copyright © ${new Date().getFullYear()} Prakhar Yadav.\n`;
		helpText += `  License Apache-2.0: Apache License 2.0 <https://www.apache.org/licenses/LICENSE-2.0>\n`;
		helpText += `  This is free software: you are free to change and redistribute it.\n`;
		helpText += `  There is NO WARRANTY, to the extent permitted by law.\n`;

		return helpText;
	};

	// Override the help formatter for the main program
	program.configureHelp({
		formatHelp: () => customHelp(program),
	});

	// Apply the custom help formatter to all commands recursively
	const applyCustomHelpToCommand = (cmd: Command) => {
		cmd.configureHelp({
			formatHelp: () => customHelp(cmd),
		});

		// Apply to subcommands recursively
		cmd.commands.forEach(applyCustomHelpToCommand);
	};

	// Apply to all commands
	program.commands.forEach(applyCustomHelpToCommand);
}

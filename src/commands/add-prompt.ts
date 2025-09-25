import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import chalk from "chalk";
import Handlebars from "handlebars";
import { validateMCPProject } from "../utils/validate-project.js";
import { toPascalCase, toCamelCase } from "../utils/string-utils.js";
import { fileURLToPath } from "url";

/**
 * Add a new prompt to an existing MCP server
 * @param name - The name of the prompt
 */
export async function addPrompt(name?: string): Promise<void> {
	try {
		// Validate that we're in an MCP server project
		await validateMCPProject();

		// Prompt for prompt name if not provided
		let promptName = name;
		if (!promptName) {
			const response = await prompts([
				{
					type: "text",
					name: "name",
					message: "What is the name of your prompt?",
					validate: (value: string) =>
						/^[a-z0-9-]+$/.test(value) ? true : "Prompt name can only contain lowercase letters, numbers, and hyphens",
				},
			]);

			if (!response.name) {
				console.log(chalk.yellow("Prompt creation cancelled"));
				process.exit(1);
			}

			promptName = response.name;
		}

		if (!promptName) {
			throw new Error("Prompt name is required");
		}

		// Prompt for prompt description
		const descResponse = await prompts([
			{
				type: "text",
				name: "description",
				message: "Enter a description for your prompt:",
				initial: `${toPascalCase(promptName)} prompt`,
			},
		]);

		if (!descResponse.description) {
			console.log(chalk.yellow("Prompt creation cancelled"));
			process.exit(1);
		}

		const promptDescription = descResponse.description;

		// Convert prompt name to different cases
		const pascalName = toPascalCase(promptName);
		const camelName = toCamelCase(promptName);
		const fileName = promptName.toLowerCase().replace(/[^a-z0-9]/g, "-");

		// Set up paths
		const cwd = process.cwd();
		const promptsDir = path.join(cwd, "src", "prompts");
		const promptDir = path.join(promptsDir, fileName);

		// Create prompts directory if it doesn't exist
		await fs.mkdir(promptsDir, { recursive: true });

		// Create prompt directory if it doesn't exist
		await fs.mkdir(promptDir, { recursive: true });

		// Get the template directory
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const templateDir = path.join(__dirname, "..", "templates", "prompt");

		// Read and compile templates
		const promptTemplate = await fs.readFile(path.join(templateDir, "prompt.ts.template"), "utf-8");
		const compiledPromptTemplate = Handlebars.compile(promptTemplate);

		const indexTemplate = await fs.readFile(path.join(templateDir, "index.ts.template"), "utf-8");
		const compiledIndexTemplate = Handlebars.compile(indexTemplate);

		const readmeTemplate = await fs.readFile(path.join(templateDir, "README.md.template"), "utf-8");
		const compiledReadmeTemplate = Handlebars.compile(readmeTemplate);

		// Prepare template data
		const templateData = {
			name: promptName,
			pascalName,
			camelName,
			fileName,
			description: promptDescription,
		};

		// Write prompt files
		console.log(chalk.blue(`Creating prompt ${promptName}...`));

		await fs.writeFile(path.join(promptDir, `${fileName}Prompt.ts`), compiledPromptTemplate(templateData));
		await fs.writeFile(path.join(promptDir, "index.ts"), compiledIndexTemplate(templateData));
		await fs.writeFile(path.join(promptDir, "README.md"), compiledReadmeTemplate(templateData));

		// Update the main prompts/index.ts file to include the new prompt
		const mainPromptsIndexPath = path.join(promptsDir, "index.ts");

		if (await fs.pathExists(mainPromptsIndexPath)) {
			let mainPromptsIndex = await fs.readFile(mainPromptsIndexPath, "utf-8");

			// Add import statement if not already present
			const importStatement = `import { ${camelName}PromptMcp } from './${fileName}/index.js';`;
			if (!mainPromptsIndex.includes(importStatement)) {
				// Find the last import statement
				const importRegex = /import.*from.*;\n/g;
				const matches = [...mainPromptsIndex.matchAll(importRegex)];

				if (matches.length > 0) {
					const lastImport = matches[matches.length - 1];
					const position = lastImport.index! + lastImport[0].length;

					// Insert the new import after the last import
					mainPromptsIndex = mainPromptsIndex.substring(0, position) + importStatement + "\n" + mainPromptsIndex.substring(position);
				} else {
					// No imports found, add at the beginning
					mainPromptsIndex = importStatement + "\n" + mainPromptsIndex;
				}
			}

			// Add the prompt to the serviceNowPrompts array if not already present
			const promptsArrayItem = `\t${camelName}PromptMcp,`;
			if (!mainPromptsIndex.includes(promptsArrayItem)) {
				// Find the serviceNowPrompts array
				const promptsArrayRegex = /export const serviceNowPrompts = \[/;
				const promptsArrayMatch = mainPromptsIndex.match(promptsArrayRegex);

				if (promptsArrayMatch) {
					const position = promptsArrayMatch.index! + promptsArrayMatch[0].length;

					// Check if there are already items in the array
					const nextLineMatch = mainPromptsIndex.substring(position).match(/\n\t/);

					if (nextLineMatch) {
						// Insert after the opening bracket and any existing items
						const insertPosition = position + nextLineMatch.index! + 2; // +2 for \n\t
						mainPromptsIndex =
							mainPromptsIndex.substring(0, insertPosition) + promptsArrayItem + "\n" + mainPromptsIndex.substring(insertPosition);
					} else {
						// Insert right after the opening bracket
						mainPromptsIndex = mainPromptsIndex.substring(0, position) + "\n" + promptsArrayItem + mainPromptsIndex.substring(position);
					}
				} else {
					// Create the serviceNowPrompts array if it doesn't exist
					mainPromptsIndex += `\n\n// Export the array of all available MCP-compatible prompts
export const serviceNowPrompts = [
\t${camelName}PromptMcp,
\t// Add additional MCP prompts here as they are created
];\n`;
				}
			}

			// Write the updated index file
			await fs.writeFile(mainPromptsIndexPath, mainPromptsIndex);
		} else {
			// Create the main prompts/index.ts file if it doesn't exist
			const mainPromptsIndex = `/**
 * MCP Prompts Index
 *
 * This file collects and exports all MCP-compatible prompts for use with the Model Context Protocol.
 */

import { ${camelName}PromptMcp } from './${fileName}/index.js';

// Export the array of all available MCP-compatible prompts
export const serviceNowPrompts = [
\t${camelName}PromptMcp,
\t// Add additional MCP prompts here as they are created
];

/**
 * Get all available MCP prompts
 * @returns An array of all MCP-compatible prompts
 */
export function getAllMcpPrompts() {
\treturn serviceNowPrompts;
}

/**
 * Get a specific MCP prompt by name
 * @param name The name of the prompt (e.g., '${promptName}')
 * @returns The requested MCP prompt or undefined if not found
 */
export function getMcpPrompt(name: string) {
\treturn serviceNowPrompts.find((prompt) => prompt.name === name);
}
`;

			await fs.writeFile(mainPromptsIndexPath, mainPromptsIndex);
		}

		// Create a README.md file in the prompts directory if it doesn't exist
		const readmePath = path.join(promptsDir, "README.md");
		if (!(await fs.pathExists(readmePath))) {
			const readme = `# Prompts

> Create reusable prompt templates and workflows

Prompts enable servers to define reusable prompt templates and workflows that clients can easily surface to users and LLMs. They provide a powerful way to standardize and share common LLM interactions.

<Note>
  Prompts are designed to be **user-controlled**, meaning they are exposed from servers to clients with the intention of the user being able to explicitly select them for use.
</Note>

## Available Prompts

The MCP server currently provides the following prompts:

### ${pascalName}

${promptDescription}

## UI integration

Prompts can be surfaced in client UIs as:

* Slash commands
* \`@\` commands
* Connectors, etc.
`;

			await fs.writeFile(readmePath, readme);
		}

		console.log(chalk.green(`Prompt ${promptName} created successfully!`));
		console.log(chalk.blue(`Files created:`));
		console.log(chalk.blue(`- src/prompts/${fileName}/${fileName}Prompt.ts`));
		console.log(chalk.blue(`- src/prompts/${fileName}/index.ts`));
		console.log(chalk.blue(`- src/prompts/${fileName}/README.md`));
		console.log(chalk.blue(`Main prompts index updated to include the new prompt.`));
	} catch (error) {
		console.error(chalk.red("Error adding prompt:"), error);
		process.exit(1);
	}
}

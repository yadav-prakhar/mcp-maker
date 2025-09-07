import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import Handlebars from 'handlebars';
import { validateMCPProject } from '../utils/validate-project.js';
import { toPascalCase, toCamelCase } from '../utils/string-utils.js';

/**
 * Add a new tool to an existing MCP server
 * @param name - The name of the tool
 */
export async function addTool(name?: string): Promise<void> {
  try {
    // Validate that we're in an MCP server project
    await validateMCPProject();

    // Prompt for tool name if not provided
    let toolName = name;
    if (!toolName) {
      const response = await prompts([
        {
          type: 'text',
          name: 'name',
          message: 'What is the name of your tool?',
          validate: (value: string) =>
            /^[a-z0-9-]+$/.test(value)
              ? true
              : 'Tool name can only contain lowercase letters, numbers, and hyphens',
        },
      ]);

      if (!response.name) {
        console.log(chalk.yellow('Tool creation cancelled'));
        process.exit(1);
      }

      toolName = response.name;
    }

    if (!toolName) {
      throw new Error('Tool name is required');
    }

    // Prompt for tool description
    const descResponse = await prompts([
      {
        type: 'text',
        name: 'description',
        message: 'Enter a description for your tool:',
        initial: `${toPascalCase(toolName)} tool`,
      },
    ]);

    if (!descResponse.description) {
      console.log(chalk.yellow('Tool creation cancelled'));
      process.exit(1);
    }

    const toolDescription = descResponse.description;

    // Convert tool name to different cases
    const pascalName = toPascalCase(toolName);
    const camelName = toCamelCase(toolName);
    const fileName = toolName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Set up paths
    const cwd = process.cwd();
    const toolsDir = path.join(cwd, 'src', 'tools');
    const toolDir = path.join(toolsDir, fileName);

    // Create tool directory if it doesn't exist
    await fs.mkdir(toolDir, { recursive: true });

    // Get the template directory
    const templateDir = path.join(__dirname, '..', 'templates', 'tool');

    // Read and compile templates
    const toolTemplate = await fs.readFile(path.join(templateDir, 'tool.ts.template'), 'utf-8');
    const compiledToolTemplate = Handlebars.compile(toolTemplate);

    const indexTemplate = await fs.readFile(path.join(templateDir, 'index.ts.template'), 'utf-8');
    const compiledIndexTemplate = Handlebars.compile(indexTemplate);

    // Prepare template data
    const templateData = {
      name: toolName,
      pascalName,
      camelName,
      fileName,
      description: toolDescription,
    };

    // Write tool files
    console.log(chalk.blue(`Creating tool ${toolName}...`));

    await fs.writeFile(path.join(toolDir, `${fileName}.ts`), compiledToolTemplate(templateData));

    await fs.writeFile(path.join(toolDir, 'index.ts'), compiledIndexTemplate(templateData));

    // Update the main tools/index.ts file to include the new tool
    const mainToolsIndexPath = path.join(toolsDir, 'index.ts');

    if (await fs.pathExists(mainToolsIndexPath)) {
      let mainToolsIndex = await fs.readFile(mainToolsIndexPath, 'utf-8');

      // Add import statement if not already present
      const importStatement = `import { ${camelName}Tools } from './${fileName}/index.js';`;
      if (!mainToolsIndex.includes(importStatement)) {
        // Find the last import statement
        const importRegex = /import.*from.*;\n/g;
        const matches = [...mainToolsIndex.matchAll(importRegex)];

        if (matches.length > 0) {
          const lastImport = matches[matches.length - 1];
          const position = lastImport.index! + lastImport[0].length;

          // Insert the new import after the last import
          mainToolsIndex =
            mainToolsIndex.substring(0, position) +
            importStatement +
            '\n' +
            mainToolsIndex.substring(position);
        } else {
          // No imports found, add at the beginning
          mainToolsIndex = importStatement + '\n' + mainToolsIndex;
        }
      }

      // Add export statement if not already present
      const exportStatement = `export * from './${fileName}/index.js';`;
      if (!mainToolsIndex.includes(exportStatement)) {
        // Find the export section
        const exportRegex = /export \* from/;
        const exportMatch = mainToolsIndex.match(exportRegex);

        if (exportMatch) {
          const exportLines = mainToolsIndex.split('\n');
          let lastExportLine = 0;

          for (let i = 0; i < exportLines.length; i++) {
            if (exportLines[i].includes('export * from')) {
              lastExportLine = i;
            }
          }

          // Insert the new export after the last export
          exportLines.splice(lastExportLine + 1, 0, exportStatement);
          mainToolsIndex = exportLines.join('\n');
        } else {
          // No exports found, add before the serverTools array
          const toolsArrayRegex = /export const serverTools/;
          const toolsArrayMatch = mainToolsIndex.match(toolsArrayRegex);

          if (toolsArrayMatch) {
            const position = toolsArrayMatch.index!;
            mainToolsIndex =
              mainToolsIndex.substring(0, position) +
              exportStatement +
              '\n\n' +
              mainToolsIndex.substring(position);
          } else {
            // No serverTools array found, add at the end
            mainToolsIndex += '\n' + exportStatement;
          }
        }
      }

      // Add the tool to the serverTools array if not already present
      const toolsArrayItem = `...${camelName}Tools,`;
      if (!mainToolsIndex.includes(toolsArrayItem)) {
        const toolsArrayRegex = /export const serverTools.*?\[/s;
        const toolsArrayMatch = mainToolsIndex.match(toolsArrayRegex);

        if (toolsArrayMatch) {
          const position = toolsArrayMatch.index! + toolsArrayMatch[0].length;
          mainToolsIndex =
            mainToolsIndex.substring(0, position) +
            '\n  ' +
            toolsArrayItem +
            mainToolsIndex.substring(position);
        } else {
          // Create the serverTools array if it doesn't exist
          mainToolsIndex += `\n\n// Export all tools combined\nexport const serverTools = [\n  ${toolsArrayItem}\n];\n`;
        }
      }

      // Write the updated index file
      await fs.writeFile(mainToolsIndexPath, mainToolsIndex);
    } else {
      // Create the main tools/index.ts file if it doesn't exist
      const mainToolsIndex = `/**
 * Tools exports and definitions
 * This file re-exports all tools and handlers from the modular structure
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Import from modular structure
import { ${camelName}Tools } from './${fileName}/index.js';

// Re-export everything
export * from './utils.js';
export * from './${fileName}/index.js';

// Export all tools combined
export const serverTools: Tool[] = [
  ...${camelName}Tools,
];`;

      await fs.writeFile(mainToolsIndexPath, mainToolsIndex);
    }

    // Update the server/toolHandler.ts file to include the new tool handler
    const toolHandlerPath = path.join(cwd, 'src', 'server', 'toolHandler.ts');

    if (await fs.pathExists(toolHandlerPath)) {
      let toolHandler = await fs.readFile(toolHandlerPath, 'utf-8');

      // Add import statement if not already present
      const importStatement = `import { handle${pascalName} } from '../tools/${fileName}/index.js';`;
      if (!toolHandler.includes(importStatement)) {
        // Find the import section
        const importRegex = /import.*from.*;\n/g;
        const matches = [...toolHandler.matchAll(importRegex)];

        if (matches.length > 0) {
          const lastImport = matches[matches.length - 1];
          const position = lastImport.index! + lastImport[0].length;

          // Insert the new import after the last import
          toolHandler =
            toolHandler.substring(0, position) +
            importStatement +
            '\n' +
            toolHandler.substring(position);
        } else {
          // No imports found, add at the beginning
          toolHandler = importStatement + '\n' + toolHandler;
        }
      }

      // Add the case statement to the switch if not already present
      const caseStatement = `case "${toolName}":`;
      if (!toolHandler.includes(caseStatement)) {
        // Find the switch statement
        const switchRegex = /switch\s*\(\s*name\s*\)\s*{/;
        const switchMatch = toolHandler.match(switchRegex);

        if (switchMatch) {
          // Find the default case
          const defaultRegex = /default:/;
          const defaultMatch = toolHandler.match(defaultRegex);

          if (defaultMatch) {
            const position = defaultMatch.index!;

            // Insert the new case before the default case
            const caseBlock = `        ${caseStatement}
          return await handle${pascalName}(args as { message: string });

        `;

            toolHandler =
              toolHandler.substring(0, position) + caseBlock + toolHandler.substring(position);
          }
        }
      }

      // Write the updated toolHandler file
      await fs.writeFile(toolHandlerPath, toolHandler);
    }

    console.log(chalk.green(`Tool ${toolName} created successfully!`));
    console.log(chalk.blue(`Files created:`));
    console.log(chalk.blue(`- src/tools/${fileName}/${fileName}.ts`));
    console.log(chalk.blue(`- src/tools/${fileName}/index.ts`));
    console.log(chalk.blue(`Main tools index and toolHandler updated to include the new tool.`));
  } catch (error) {
    console.error(chalk.red('Error adding tool:'), error);
    process.exit(1);
  }
}

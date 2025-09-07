import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import Handlebars from 'handlebars';
import { validateMCPProject } from '../utils/validate-project.js';
import { toPascalCase, toCamelCase } from '../utils/string-utils.js';

/**
 * Add a new service to an existing MCP server
 * @param name - The name of the service
 */
export async function addService(name?: string): Promise<void> {
  try {
    // Validate that we're in an MCP server project
    await validateMCPProject();

    // Prompt for service name if not provided
    let serviceName = name;
    if (!serviceName) {
      const response = await prompts([
        {
          type: 'text',
          name: 'name',
          message: 'What is the name of your service?',
          validate: (value: string) =>
            /^[a-z0-9-]+$/.test(value)
              ? true
              : 'Service name can only contain lowercase letters, numbers, and hyphens',
        },
      ]);

      if (!response.name) {
        console.log(chalk.yellow('Service creation cancelled'));
        process.exit(1);
      }

      serviceName = response.name;
    }

    if (!serviceName) {
      throw new Error('Service name is required');
    }

    // Prompt for service description
    const descResponse = await prompts([
      {
        type: 'text',
        name: 'description',
        message: 'Enter a description for your service:',
        initial: `${toPascalCase(serviceName)} service`,
      },
    ]);

    if (!descResponse.description) {
      console.log(chalk.yellow('Service creation cancelled'));
      process.exit(1);
    }

    const serviceDescription = descResponse.description;

    // Convert service name to different cases
    const pascalName = toPascalCase(serviceName);
    const camelName = toCamelCase(serviceName);
    const fileName = serviceName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Set up paths
    const cwd = process.cwd();
    const servicesDir = path.join(cwd, 'src', 'services');
    const serviceDir = path.join(servicesDir, fileName);
    
    // Create service directory if it doesn't exist
    await fs.mkdir(serviceDir, { recursive: true });

    // Get the template directory
    const templateDir = path.join(__dirname, '..', 'templates', 'service');
    
    // Read and compile templates
    const serviceTemplate = await fs.readFile(path.join(templateDir, 'service.ts.template'), 'utf-8');
    const compiledServiceTemplate = Handlebars.compile(serviceTemplate);
    
    const indexTemplate = await fs.readFile(path.join(templateDir, 'index.ts.template'), 'utf-8');
    const compiledIndexTemplate = Handlebars.compile(indexTemplate);

    // Prepare template data
    const templateData = {
      name: serviceName,
      pascalName,
      camelName,
      fileName,
      description: serviceDescription,
    };

    // Write service files
    console.log(chalk.blue(`Creating service ${serviceName}...`));
    
    await fs.writeFile(
      path.join(serviceDir, `${fileName}.ts`),
      compiledServiceTemplate(templateData)
    );
    
    await fs.writeFile(
      path.join(serviceDir, 'index.ts'),
      compiledIndexTemplate(templateData)
    );

    // Update the main services/index.ts file to include the new service
    const mainServicesIndexPath = path.join(servicesDir, 'index.ts');
    
    if (await fs.pathExists(mainServicesIndexPath)) {
      let mainServicesIndex = await fs.readFile(mainServicesIndexPath, 'utf-8');
      
      // Add export statement if not already present
      const exportStatement = `export * from './${fileName}/index.js';`;
      if (!mainServicesIndex.includes(exportStatement)) {
        // Find the export section
        const exportRegex = /export \* from/;
        const exportMatch = mainServicesIndex.match(exportRegex);
        
        if (exportMatch) {
          const exportLines = mainServicesIndex.split('\n');
          let lastExportLine = 0;
          
          for (let i = 0; i < exportLines.length; i++) {
            if (exportLines[i].includes('export * from')) {
              lastExportLine = i;
            }
          }
          
          // Insert the new export after the last export
          exportLines.splice(lastExportLine + 1, 0, exportStatement);
          mainServicesIndex = exportLines.join('\n');
        } else {
          // No exports found, add at the end
          mainServicesIndex += '\n' + exportStatement;
        }
      }
      
      // Write the updated index file
      await fs.writeFile(mainServicesIndexPath, mainServicesIndex);
    } else {
      // Create the main services/index.ts file if it doesn't exist
      const mainServicesIndex = `/**
 * Services exports
 * This file re-exports all services from the modular structure
 */

// Re-export from modular structure
export * from './${fileName}/index.js';`;
      
      await fs.writeFile(mainServicesIndexPath, mainServicesIndex);
    }

    console.log(chalk.green(`Service ${serviceName} created successfully!`));
    console.log(chalk.blue(`Files created:`));
    console.log(chalk.blue(`- src/services/${fileName}/${fileName}.ts`));
    console.log(chalk.blue(`- src/services/${fileName}/index.ts`));
    console.log(chalk.blue(`Main services index updated to include the new service.`));
    
  } catch (error) {
    console.error(chalk.red('Error adding service:'), error);
    process.exit(1);
  }
}
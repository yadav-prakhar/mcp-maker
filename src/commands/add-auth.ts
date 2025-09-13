import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import chalk from "chalk";
import Handlebars from "handlebars";
import { validateMCPProject } from "../utils/validate-project.js";

/**
 * Add authentication support to an existing MCP server
 * @param type - The type of authentication to add (basic, token, oauth, or --all for all types)
 */
export async function addAuth(type?: string): Promise<void> {
	try {
		// Validate that we're in an MCP server project
		await validateMCPProject();

		// Define auth types
		const authTypes = ["basic", "token", "oauth"];
		
		// Determine which auth types to add
		let authTypesToAdd: string[] = [];
		
		if (type === "--all") {
			// Add all auth types
			authTypesToAdd = [...authTypes];
			console.log(chalk.blue("Adding all authentication types..."));
		} else if (type) {
			// Validate provided type
			if (!authTypes.includes(type)) {
				console.log(chalk.red(`Invalid auth type: ${type}`));
				console.log(chalk.yellow(`Valid types are: ${authTypes.join(", ")} or --all for all types`));
				process.exit(1);
			}
			authTypesToAdd = [type];
		} else {
			// Prompt for auth type if not provided
			const response = await prompts([
				{
					type: "select",
					name: "authType",
					message: "Select the type of authentication to add:",
					choices: [
						{ title: "Basic Auth", value: "basic" },
						{ title: "Token Auth", value: "token" },
						{ title: "OAuth 2.0", value: "oauth" },
						{ title: "All Types", value: "all" },
					],
				},
			]);

			if (!response.authType) {
				console.log(chalk.yellow("Auth creation cancelled"));
				process.exit(1);
			}

			if (response.authType === "all") {
				authTypesToAdd = [...authTypes];
			} else {
				authTypesToAdd = [response.authType];
			}
		}

		// Set up paths
		const cwd = process.cwd();
		const authDir = path.join(cwd, "src", "auth");
		const interfacesDir = path.join(authDir, "interfaces");
		const methodsDir = path.join(authDir, "methods");

		// Create auth directories if they don't exist
		await fs.mkdir(authDir, { recursive: true });
		await fs.mkdir(interfacesDir, { recursive: true });
		await fs.mkdir(methodsDir, { recursive: true });

		// Get the template directory
		const templateDir = path.join(__dirname, "..", "templates", "auth");
		const interfacesTemplateDir = path.join(templateDir, "interfaces");
		const methodsTemplateDir = path.join(templateDir, "methods");

		// Copy base interface files
		console.log(chalk.blue("Setting up base authentication interfaces..."));
		
		// Copy IAuthProvider interface
		await fs.copyFile(path.join(interfacesTemplateDir, "IAuthProvider.ts.template"), path.join(interfacesDir, "IAuthProvider.ts"));

		// Create interfaces index.ts
		let interfacesIndexContent = 'export * from "./IAuthProvider.js";\n';
		
		// Copy auth type specific files
		for (const authType of authTypesToAdd) {
			console.log(chalk.blue(`Setting up ${authType} authentication...`));
			
			// Copy interface file
			const interfaceFileName = `I${authType.charAt(0).toUpperCase() + authType.slice(1)}AuthProvider.ts`;
			await fs.copyFile(path.join(interfacesTemplateDir, interfaceFileName + ".template"), path.join(interfacesDir, interfaceFileName));
			
			// Add to interfaces index
			interfacesIndexContent += `export * from "./${interfaceFileName.replace(".ts", ".js")}";\n`;
			
			// Copy provider implementation
			const providerFileName = `${authType.charAt(0).toUpperCase() + authType.slice(1)}AuthProvider.ts`;
			await fs.copyFile(path.join(methodsTemplateDir, providerFileName + ".template"), path.join(methodsDir, providerFileName));
		}
		
		// Write interfaces index.ts
		await fs.writeFile(path.join(interfacesDir, "index.ts"), interfacesIndexContent);
		
		// Create methods index.ts
		let methodsIndexContent = "";
		for (const authType of authTypesToAdd) {
			const providerFileName = `${authType.charAt(0).toUpperCase() + authType.slice(1)}AuthProvider.js`;
			methodsIndexContent += `export * from "./${providerFileName}";\n`;
		}
		await fs.writeFile(path.join(methodsDir, "index.ts"), methodsIndexContent);
		
		// Copy AuthFactory and AuthService
		console.log(chalk.blue("Setting up AuthFactory and AuthService..."));
		
		// Read and compile AuthFactory template to include only selected auth types
		const authFactoryTemplate = await fs.readFile(path.join(templateDir, "AuthFactory.ts.template"), "utf-8");
		const compiledAuthFactoryTemplate = Handlebars.compile(authFactoryTemplate);
		
		// Prepare data for AuthFactory template
		const authFactoryData = {
			includeBasic: authTypesToAdd.includes("basic"),
			includeToken: authTypesToAdd.includes("token"),
			includeOAuth: authTypesToAdd.includes("oauth"),
		};
		
		// Write modified AuthFactory.ts
		await fs.writeFile(path.join(authDir, "AuthFactory.ts"), compiledAuthFactoryTemplate(authFactoryData));
		
		// Copy AuthService.ts
		await fs.copyFile(path.join(templateDir, "AuthService.ts.template"), path.join(authDir, "AuthService.ts"));
		
		// Create main auth index.ts
		let mainAuthIndexContent = 'export * from "./interfaces/index.js";\n';
		mainAuthIndexContent += 'export * from "./methods/index.js";\n';
		mainAuthIndexContent += 'export * from "./AuthFactory.js";\n';
		mainAuthIndexContent += 'export * from "./AuthService.js";\n\n';
		
		mainAuthIndexContent += "// Re-export commonly used types and classes for convenience\n";
		mainAuthIndexContent += 'import { IAuthProvider } from "./interfaces/IAuthProvider.js";\n';
		mainAuthIndexContent += 'import { AuthFactory, AuthType, AuthConfig } from "./AuthFactory.js";\n\n';
		
		mainAuthIndexContent += "/**\n";
		mainAuthIndexContent += " * Get an authentication provider instance based on the configuration\n";
		mainAuthIndexContent += " * @param config - The authentication configuration\n";
		mainAuthIndexContent += " * @returns An instance of the appropriate authentication provider\n";
		mainAuthIndexContent += " */\n";
		mainAuthIndexContent += "export function getAuthProvider(config: AuthConfig): IAuthProvider {\n";
		mainAuthIndexContent += "\treturn AuthFactory.createAuthProvider(config);\n";
		mainAuthIndexContent += "}\n";
		
		await fs.writeFile(path.join(authDir, "index.ts"), mainAuthIndexContent);
		
		// Success message
		console.log(chalk.green("Authentication setup completed successfully!"));
		console.log(chalk.blue("Files created:"));
		console.log(chalk.blue(`- src/auth/interfaces/IAuthProvider.ts`));
		
		for (const authType of authTypesToAdd) {
			const capitalizedType = authType.charAt(0).toUpperCase() + authType.slice(1);
			console.log(chalk.blue(`- src/auth/interfaces/I${capitalizedType}AuthProvider.ts`));
			console.log(chalk.blue(`- src/auth/methods/${capitalizedType}AuthProvider.ts`));
		}
		
		console.log(chalk.blue(`- src/auth/interfaces/index.ts`));
		console.log(chalk.blue(`- src/auth/methods/index.ts`));
		console.log(chalk.blue(`- src/auth/AuthFactory.ts`));
		console.log(chalk.blue(`- src/auth/AuthService.ts`));
		console.log(chalk.blue(`- src/auth/index.ts`));
		
		console.log(chalk.yellow("\nNext steps:"));
		console.log(chalk.yellow("1. Configure your authentication in your application"));
		console.log(chalk.yellow("2. Use the auth providers in your services or tools"));
		
	} catch (error) {
		console.error(chalk.red("Error adding authentication:"), error);
		process.exit(1);
	}
}
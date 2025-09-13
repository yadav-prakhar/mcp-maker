import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { validateMCPProject } from "../utils/validate-project.js";
import { fileURLToPath } from "url";

/**
 * Add authentication support to an existing MCP server
 * Adds all authentication types (basic, token, oauth)
 */
export async function addAuth(): Promise<void> {
	try {
		// Validate that we're in an MCP server project
		await validateMCPProject();

		// Define auth types
		const authTypes = ["basic", "token", "oauth"];

		// Add all auth types
		const authTypesToAdd = [...authTypes];
		console.log(chalk.blue("Adding all authentication types..."));

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
		const templateDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "templates", "auth");
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
			let interfaceFileName;
			if (authType === "oauth") {
				interfaceFileName = "IOAuthProvider.ts";
			} else {
				interfaceFileName = `I${authType.charAt(0).toUpperCase() + authType.slice(1)}AuthProvider.ts`;
			}
			await fs.copyFile(path.join(interfacesTemplateDir, interfaceFileName + ".template"), path.join(interfacesDir, interfaceFileName));

			// Add to interfaces index
			interfacesIndexContent += `export * from "./${interfaceFileName.replace(".ts", ".js")}";\n`;

			// Copy provider implementation
			let providerFileName;
			if (authType === "oauth") {
				providerFileName = "OAuthProvider.ts";
			} else {
				providerFileName = `${authType.charAt(0).toUpperCase() + authType.slice(1)}AuthProvider.ts`;
			}
			await fs.copyFile(path.join(methodsTemplateDir, providerFileName + ".template"), path.join(methodsDir, providerFileName));
		}

		// Write interfaces index.ts
		await fs.writeFile(path.join(interfacesDir, "index.ts"), interfacesIndexContent);

		// Create methods index.ts
		let methodsIndexContent = "";
		for (const authType of authTypesToAdd) {
			let providerFileName;
			if (authType === "oauth") {
				providerFileName = "OAuthProvider";
			} else {
				providerFileName = `${authType.charAt(0).toUpperCase() + authType.slice(1)}AuthProvider`;
			}
			methodsIndexContent += `export * from "./${providerFileName}.js";\n`;
		}
		await fs.writeFile(path.join(methodsDir, "index.ts"), methodsIndexContent);

		// Copy AuthFactory and AuthService
		console.log(chalk.blue("Setting up AuthFactory and AuthService..."));

		// Copy AuthFactory.ts
		await fs.copyFile(path.join(templateDir, "AuthFactory.ts.template"), path.join(authDir, "AuthFactory.ts"));

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

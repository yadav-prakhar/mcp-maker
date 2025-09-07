# Development Guide for mcp-maker

This document provides information for developers working on the **mcp-maker** project itself.

## Prerequisites

- **Node.js** version >= 18.19.0
- **npm** version >= 7.0.0
- **Git**

## Setting Up the Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mcp-maker.git
   cd mcp-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```
   This compiles the TypeScript source into JavaScript in the `dist/` folder.

4. **Run tests**
   ```bash
   npm test
   ```
   Ensure all tests pass before committing.

5. **Link the CLI locally (optional)**
   ```bash
   npm link
   ```
   This makes the `mcp` command available globally for testing.

## Development Workflow

- Follow the **branch naming conventions** described in `CONTRIBUTING.md`.
- Keep commits small and focused.
- Run `npm run lint` and `npm run format` before pushing.
- Update documentation in `README.md` if you add new features or change usage.

## Project Structure Overview

```
├─ src/                # Source code (TypeScript)
│   ├─ tools/         # Tool implementations
│   ├─ services/      # Service implementations
│   ├─ utils/         # Utility functions
│   ├─ config.ts      # Configuration file
│   └─ index.ts       # CLI entry point
├─ tests/              # Test suites
├─ package.json        # NPM package definition
├─ tsconfig.json       # TypeScript configuration
└─ README.md           # Project documentation
```

## Publishing a New Version

When ready to release a new version:

1. Update the version in `package.json` following semantic versioning.
2. Run `npm run build`.
3. Publish to npm:
   ```bash
   npm publish --access public
   ```

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [MCP Specification](https://github.com/ServiceNow/mcp)

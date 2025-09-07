# mcp-maker

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.19.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.3.3-blue.svg)](https://www.typescriptlang.org/)

A CLI utility to quickly create and manage TypeScript MCP (Model Context Protocol) servers following the ServiceNow MCP structure.

## 📋 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Create a New MCP Server](#create-a-new-mcp-server)
  - [Add a Tool](#add-a-tool)
  - [Add a Service](#add-a-service)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Introduction

`mcp-maker` is a command-line utility designed to streamline the process of creating and managing TypeScript MCP servers. It follows the structure and patterns used in the ServiceNow MCP server, providing a consistent and efficient way to scaffold new projects and add components.

Whether you're creating a new MCP server from scratch or adding tools and services to an existing one, `mcp` simplifies the process and ensures adherence to best practices.

## ✨ Features

- **Quick Project Scaffolding**: Create a fully structured MCP server project with a single command
- **Automated Tool Creation**: Add new tools with proper structure and automatic registration in the toolHandler
- **Service Management**: Add new services with proper structure and automatic registration
- **Consistent Structure**: Ensures all projects follow the same structure and patterns
- **Customization Options**: Configure transport options, CORS settings, and more
- **Automatic File Updates**: When adding tools or services, relevant index files and handlers are automatically updated

## 📥 Installation

### Prerequisites

- Node.js (>= 18.19.0)
- npm (>= 7.0.0)

### Global Installation

```bash
npm install -g mcp-maker
```

### Local Installation

```bash
npm install mcp-maker
```

## 🔧 Usage

### Create a New MCP Server

```bash
mcp create server [name] [options]
```

#### Options

- `--http`: Use HTTP transport instead of default stdio
- `--cors`: Enable CORS with wildcard (*) access
- `--port <number>`: Specify HTTP port (only valid with --http)
- `--no-install`: Skip npm install and build steps

#### Example

```bash
mcp create server my-mcp-server --http --port 3000 --cors
```

This will create a new MCP server project named `my-mcp-server` with HTTP transport on port 3000 and CORS enabled.

### Add a Tool

```bash
mcp add tool [name]
```

#### Example

```bash
cd my-mcp-server
mcp add tool get-user-data
```

This will:
1. Create a new tool directory in `src/tools/get-user-data`
2. Create the tool implementation and index files
3. Update the main tools index to include the new tool
4. Update the toolHandler to handle the new tool

### Add a Service

```bash
mcp add service [name]
```

#### Example

```bash
cd my-mcp-server
mcp add service user-management
```

This will:
1. Create a new service directory in `src/services/user-management`
2. Create the service implementation and index files
3. Update the main services index to include the new service

## 📁 Project Structure

The generated MCP server follows this structure:

```
my-mcp-server/
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
│   ├── utils/
│   │   └── logger.ts
│   ├── prompts/
│   │   └── index.ts
│   ├── resources/
│   │   └── index.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

When you add a tool or service, it creates a dedicated directory with the appropriate files:

```
# For a tool named "get-user-data":
src/tools/get-user-data/
├── get-user-data.ts
└── index.ts

# For a service named "user-management":
src/services/user-management/
├── user-management.ts
└── index.ts
```

## 👥 Contributing

Contributions are welcome! Here's how you can contribute:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

Please make sure your code follows the existing style and includes appropriate tests.

### Development Setup

```bash
git clone https://github.com/yourusername/mcp-cli.git
cd mcp-cli
npm install
npm run build
```

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

Copyright 2025 Prakhar Yadav
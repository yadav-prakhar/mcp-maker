<div align="center">

# MCP Maker

<strong>Supercharge your MCP server development with MCP Maker</strong>

<!-- Project Status Badges -->
[![npm version](https://img.shields.io/npm/v/mcp-maker?label=Version&color=3674B5
)](https://www.npmjs.com/package/mcp-maker)
[![Downloads](https://img.shields.io/npm/d18m/mcp-maker?logo=npm&label=Downloads&color=FFDE63
)](https://www.npmjs.com/package/mcp-maker)
[![License](https://img.shields.io/badge/License-Apache%202.0-F38181.svg?logo=apache)](LICENSE)
[![NodeJS](https://img.shields.io/badge/NodeJS-%3E%3D18.19.0-5dae47.svg?logo=nodedotjs&logoColor=white)](https://nodejs.org/)

[🚀 Introduction](#-introduction) • [✨ Features](#-features) • [📥 Installation](#-installation) • [🔧 Usage](#-usage) • [🏗️ Generated MCP Structure](#-generated-mcp-server-project-structure)


<img src="https://repository-images.githubusercontent.com/1051822089/b0a82bcf-1cbc-4709-bb15-20648765b7cc" alt="MCP Maker" width="700">


</div>

<br>

A CLI utility to quickly create and manage TypeScript MCP (Model Context Protocol) servers following a modular structure.


## 📋 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
  - [Create a New MCP Server](#create-a-new-mcp-server)
  - [Add a Tool](#add-a-tool)
  - [Add a Service](#add-a-service)
- [Generated MCP Server Project Structure](#-generated-mcp-server-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Introduction

`mcp-maker` is a command-line utility designed to streamline the process of creating and managing TypeScript MCP servers. It follows the structure and patterns used for making modular MCP servers, providing a consistent and efficient way to scaffold new projects and add components.

Whether you're creating a new MCP server from scratch or adding tools and services to an existing one, `mcp-maker` simplifies the process and ensures adherence to best practices.

## ✨ Features

- **Quick Project Scaffolding**: Create a fully structured MCP server project with a single command
- **Automated Tool Creation**: Add new tools with proper structure and automatic registration in the toolHandler
- **Service Management**: Add new services with proper structure and automatic registration
- **Consistent Structure**: Ensures all projects follow the same structure and patterns
- **TypeScript Support**: Full TypeScript support with proper type definitions
- **Interactive CLI**: User-friendly command-line interface with helpful prompts
- **Template-based Generation**: Uses Handlebars templates for consistent code generation
- **Automatic Dependency Management**: Handles npm dependencies and TypeScript configuration

## 📥 Installation

### Prerequisites

- Node.js (>= 18.19.0)
- npm (>= 7.0.0)

### Global Installation (Recommended)

```bash
npm install -g mcp-maker
```

### Local Installation

```bash
npm install --save-dev mcp-maker
```

## 🔧 Usage

### Create a New MCP Server

```bash
mcp-maker create server <name> [options]
```

#### Options

- `--http`: Use HTTP transport instead of default stdio
- `--cors`: Enable CORS with wildcard (*) access
- `--port <number>`: Specify HTTP port (only valid with --http)
- `--no-install`: Skip npm install and build steps
- `-h, --help`: Display help for the command

#### Example

```bash
mcp-maker create server my-mcp-server --http --port 3000 --cors
```

This will create a new MCP server project named `my-mcp-server` with HTTP transport on port 3000 and CORS enabled.

### Add a Tool

```bash
mcp-maker add tool <name> [options]
```

#### Options
- `-h, --help`: Display help for the command

#### Example

```bash
cd my-mcp-server
mcp-maker add tool get-user-data
```

This will:
1. Create a new tool directory in `src/tools/get-user-data`
2. Create the tool implementation and index files
3. Update the main tools index to include the new tool
4. Update the toolHandler to handle the new tool

### Add a Service

```bash
mcp-maker add service <name> [options]
```

#### Options
- `-h, --help`: Display help for the command

#### Example

```bash
cd my-mcp-server
mcp-maker add service user-service
```

This will:
1. Create a new service directory in `src/services/user-service`
2. Create the service implementation and index files
3. Update the main services index to include the new service
4. Set up proper TypeScript types and interfaces

## 🏗️ Generated MCP Server Project Structure

The `mcp-maker` CLI scaffolds a new MCP server project with the following structure:

```
my-mcp-server/
├── src/
│   ├── tools/             # Individual tools
│   │   └── <tool-name>/   # Each tool in its own directory
│   │       ├── index.ts   # Tool implementation
│   │       └── types.ts   # Type definitions for the tool
│   │
│   ├── services/          # Service implementations
│   │   └── <service-name>/ # Each service in its own directory
│   │       ├── index.ts   # Service implementation
│   │       └── types.ts   # Type definitions for the service
│   │
│   ├── types/             # Global TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── config.ts          # Configuration
│   └── index.ts           # Main entry point
├── tests/                 # Test files
├── .gitignore
├── package.json           # Project configuration and dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md
```

This structure ensures consistency across all MCP server projects created with `mcp-maker`.

## 🗂️ Repository Structure

This repository contains the following files and directories:

* `src/`: The source code for the `mcp-maker` CLI utility.
* `tests/`: Test files for the `mcp-maker` CLI utility.
* `README.md`: This file, which provides an overview of the `mcp-maker` CLI utility.
* `LICENSE`: The license under which this project is released.
* `CONTRIBUTING.md`: Guidelines for contributing to this project.
* [`DEVELOPMENT.md`](DEVELOPMENT.md): Guidelines for developing and testing this project.
* [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md): The code of conduct for this project.

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines, including branch naming conventions and pull‑request requirements.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 Prakhar Yadav
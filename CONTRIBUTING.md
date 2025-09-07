# Contributing to mcp-maker

Thank you for considering contributing to **mcp-maker**! We welcome contributions of all kinds, from bug reports and feature requests to pull requests.

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/<short-description>
   ```
   - For bug fixes, use `bugfix/<short-description>`
   - For documentation changes, use `docs/<short-description>`
3. **Make your changes** and ensure the code builds and tests pass.
4. **Commit your changes** with a clear commit message.
5. **Push to your fork** and open a Pull Request against the `main` branch.

## Pull Request Guidelines

- Follow the existing code style and linting rules.
- Include a clear description of what the PR does.
- Reference any related issues using `Closes #<issue-number>`.
- Ensure all tests pass (`npm test`).
- Keep PRs small and focused.

## Code Style

- Use **TypeScript** with strict typing.
- Run `npm run lint` before submitting.
- Follow the existing project formatting (Prettier).

## Branch Naming Conventions

| Type | Prefix | Example |
|------|--------|---------|
| Feature | `feature/` | `feature/add-cli-commands` |
| Bug Fix | `bugfix/` | `bugfix/fix-tool-generation` |
| Documentation | `docs/` | `docs/update-readme` |
| Refactor | `refactor/` | `refactor/cleanup-utils` |

## Reporting Issues

If you encounter a bug or have a feature request, please open an issue using the templates provided in `.github/ISSUE_TEMPLATE/`.

---

By contributing, you agree to license your contributions under the same Apache 2.0 license as the project.

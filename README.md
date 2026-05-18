# AI sandbox MCP

Auto registers it's tools to Cumulocity's AI agent manager. It offers a tool to allow executing shell commands in a sandboxed environment (Cumulocity's microservice hosting).

The [go-c8y-cli](https://goc8ycli.netlify.app/) as well as python and nodejs are preinstalled and can be used.
The go-c8y-cli will utilize the microservice's service user by default, which comes with limited permissions.
In case your usecase requires more permissions you can adjust the microservice manifest.

## Requirements

- Node.js 24
- Yarn (via corepack)

## Development Workflow

### Pull Requests

Every PR automatically builds the microservice to verify it compiles successfully. Draft PRs are skipped unless labeled with `run-ci-on-draft`.

## Local Development

```bash
yarn start:dev
```

## Build as Microservice

```bash
yarn docker:build
```

## Release Process

This project uses semantic versioning with manual release triggers. See [BUILD_AND_RELEASE.md](docs/BUILD_AND_RELEASE.md) for details.

**Quick start:**
1. Push commits to `main` following [Conventional Commits](https://www.conventionalcommits.org/) format
2. Manually trigger the "Semantic-Release" workflow in GitHub Actions
3. The workflow analyzes commits, creates a version tag, and triggers the build
4. Use `feat:` for features, `fix:` for bug fixes, `BREAKING CHANGE:` for breaking changes
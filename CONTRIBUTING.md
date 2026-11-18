# Contributing to Stateful Elements

We welcome contributions to the Stateful Elements library!

## Setup and checks

```bash
npm install
npm test
```

`npm test` runs `jest`. As of this writing it does not work: `jest` is not listed in `devDependencies`,
so the script fails with `jest: command not found`, and with Jest installed the suite stops on
`HTMLDivElement is not defined` because no browser-like test environment is configured. Fixing that
is a welcome contribution. Until it is fixed, check a change by loading `src/StatefulElement.js` in a
browser that supports customized built-in elements (Safari does not), as the README describes.

The repository has no CI workflow.

## Conventions

- Source is plain ES modules in `src/`, with no build step.
- Commit messages are short and descriptive. Pull request titles may use a `docs:` prefix for documentation changes, as in the history.
- Keep the README and `docs/` in line with what the code does. The README states which behaviors are not implemented.
- Record notable changes under `## Unreleased` in [`CHANGELOG.md`](CHANGELOG.md).

## Pull requests

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request that fills in the pull request template: what and why, how it was verified, and notes.

## Conduct, support and security

See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), [`SUPPORT.md`](SUPPORT.md) and [`SECURITY.md`](SECURITY.md).

Thank you for contributing!

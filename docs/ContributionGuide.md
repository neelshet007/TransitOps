# Contribution Guide

Welcome to TransitOps! Follow these steps to ensure clean contributions.

## 🛠 Setting up local environment
1. Ensure Node.js v20+ and npm v10+ are installed.
2. Initialize repository and install dependencies:
   ```bash
   npm install
   ```
3. Set up the local database and verify connection by running migrations.

## 📝 Commit Standard
We enforce **Conventional Commits**:
- `feat`: A new feature or endpoint.
- `fix`: A bug fix.
- `docs`: Documentation updates.
- `style`: Changes that do not affect code logic (formatting, spacing).
- `refactor`: Structural rewrite that neither fixes a bug nor adds a feature.
- `test`: Adding or correcting tests.
- `chore`: Build steps, dependency upgrades, configurations.

Example:
`feat(auth): implement refresh token rotation`

## 🔎 Linting and Formatting
- Format code before pushing:
  ```bash
  npm run format
  ```
- Run linters to verify syntax:
  ```bash
  npm run lint
  ```
- Husky and `lint-staged` run these checks automatically on commit.

# Contributing to SoundBoard

Thanks for your interest in contributing.

## Development setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/your-username/soundboard.git
   cd soundboard
   npm install
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

3. Run lint:

   ```bash
   npm run lint
   ```

4. Ensure the production build succeeds:

   ```bash
   npm run build
   ```

## Submitting changes

- Open an issue first to discuss larger changes.
- Fork the repo, create a branch, make your changes, and run `npm run lint` and `npm run build`.
- Open a pull request with a clear description of what changed and why.

## Code style

- TypeScript and ESLint config in the repo define the style; please keep new code consistent.
- Prefer existing patterns (e.g. hooks, config modules) when adding features.

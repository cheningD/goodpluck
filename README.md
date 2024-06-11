# GoodpluckV2

Goodpluck, our ecommerce webapp, uses the [Astro](https://astro.build/) Framework for frontend and backend development. [SolidJS](https://www.solidjs.com/) is used for reactive components. [Vercel](https://vercel.com/) is used for hosting and deployment.

## Development Philosophy: Simplicity

Simple programs are more reliable and easier to maintain. Here are some tips to write simple PRs:

- Break issues into smaller issues and post multiple PRs that each tackle a small part of the problem
- Simple does not mean easy, often the simplest solutions requires a more thorough understanding of the problem
- Watch Rich Hickey's talk: [Simple Made Easy](https://www.infoq.com/presentations/Simple-Made-Easy/)

## Setup

- Install [pnpm](https://pnpm.io/installation)
- Install dependencies `pnpm install`
- Create a .env file. Dev variables can be viewed in vercel. `touch .env`
- Install [Vercel cli](https://vercel.com/docs/cli) and run `vercel login` to login, then `vercel dev` to try out the dev server

## Contribution Workflow

1. **Get an Issue**: Assign yourself an issue from the project board.
2. **Branch**: Create a new branch from `main` with a descriptive name, e.g., `feature/issue-123-short-description`.
3. **Code**: Work on the task in your branch, committing frequently.
4. **Test**: Write unit and end-to-end tests, and run `pnpm run test` and `pnpm run test:e2e` locally.
5. **Pull Request (PR)**: Keep PRs small and focused. Vercel will build a preview deployment.
6. **Review**: Request a review from teammates and address all suggestions.
7. **Merge**: Rebase (preferred) or squash and merge your commits into `main`.

By following these guidelines, we maintain a clear and efficient process for task management and code integration.

## Testing Overview

**Goal:** Ensure critical user flows are covered by end-to-end (E2E) tests. Critical flows are those which, if broken, would prevent users from using the app. Supplement E2E tests with unit tests to verify key logic.

### Unit Tests (Vitest)

Write unit tests to test solidjs components

- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) Allows us tp jest matchers

### End-to-end Tests ([Playwright](https://playwright.dev/docs/running-tests))

- Use to test flows that require interacting with the backend or exernal services
- To run a specific test file in interactive mode:
  `pnpm run test:e2e tests/e2e/cart.spec.ts --ui`

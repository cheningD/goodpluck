# GoodpluckV2 Frontend & Backend Repo

## Development Philosophy

Our approach emphasizes writing simple, straightforward code to enhance long-term maintainability and reduce the likelihood of bugs. For an understanding of what we consider 'simple,' refer to Rich Hickey's talk, [Simple Made Easy](https://www.infoq.com/presentations/Simple-Made-Easy/). Adhere to the following guidelines for successful PRs:

- **Minimize Dependencies:** Scrutinize each new node-module addition. Essentiality is key. If a feature isn't crucial, reconsider its inclusion.
- **Opt for Simplicity:** Choose simpler solutions, even if it means removing non-essential features.
- **End-to-end Test Critical User Flows:** Write end-to-end tests for critical features that rely on external services (e.g. auth)
- **PR Readiness:** Before submitting a PR, confirm that your code functions as intended and all tests pass.

## Workflow for Handling Tasks in This Repository:

When you are ready to start working on a task, please adhere to the following steps to ensure consistency and traceability within the project workflow:

1. **Development Workflow:**

   - Create a new branch from `main` for your task using a reasonable name e.g. `feature/issue-number-short-description`
   - Work on your task in this branch, committing code as you make progress.
   - Write unit tests (or end-to-end tests if appropriate)
   - Test your changes locally with `pnpm run test` and `pnpm run test:e2e`

2. **Pull Requests (PR):**

   - Keep your PRs small and focused on the task you are solving.
   - After tests pass, create a Pull Request against the `main` branch.
   - Follow the PR template that is generated automatically
   - Vercel will build a preview url for your changes
   - Github actions will automatically run tests against your development deployment

3. **Code Review:**

   - Request review from teammates and address all suggestions.
   - Once approved, merge your PR into the `main` branch.
   - We don't merge code that doesn't build, or fails tests

4. **After Merging:**
   - Update the project board by moving the issue to the "Done" column.
   - Delete the feature branch after merging to keep the repository clean.

By following these guidelines, we maintain a clear and efficient process for task management and code integration.

## Testing Overview

- Write unit tests o test component behavior and to test functions. We use vitest see [vitest.config.ts](/vitest.config.ts) along with [soli-testing-library](https://github.com/solidjs/solid-testing-library) and [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) for custom jest matchers

- Use [Playwright](https://playwright.dev/docs/running-tests) to write end-to-end (e2e) tests for critical user paths, like authentication.
- E2e tests, despite being slower and less stable than unit tests, are crucial for ensuring the reliability of critical user journeys.
- See example e2e tests in ./test-examples

- Todo: Use Vitest to unit test complex functions, like date manipulation

## Contribution Guidelines

For all changes, please submit a pull request (PR) for review.

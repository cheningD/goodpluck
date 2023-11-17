# GoodpluckV2 Frontend & Backend Repo

## Technical Overview

This project employs Astro, SolidJS, and Tailwind. Aim for code simplicity and easy maintainability. For an understanding of what "simple" means, watch Rich Hickey's talk on [Simple Made Easy](https://www.infoq.com/presentations/Simple-Made-Easy/). Familiarize yourself with these technologies before diving in. We rely on a headless e-commerce solution, Swell. Store data in Swell when feasible to minimize codebase complexity.

## Commands

Run these commands from the project root: You wull need to install _pnpm_ which we use instead of yarn or npm.

| Command                    | Action                                      |
| -------------------------- | ------------------------------------------- |
| `pnpm install`             | Installs dependencies                       |
| `pnpm run dev`             | Starts local dev server at `localhost:4321` |
| `pnpm run build`           | Builds production site to `./dist/`         |
| `pnpm run test:e2e`        | Run end to end tests using playwright       |
| `pnpm run preview`         | Previews build locally using cloudflare     |
| `pnpm run astro ...`       | Executes Astro CLI commands                 |
| `pnpm run astro -- --help` | Astro CLI help                              |

## Local Deployment

Cloudflare automatically deploys each commit on every push
**To deploy locally in a production-like environment**

- Create a `.dev.vars` file that matches your `.env` in the project root, to give cloudflare access to your env vars.
- `pnpm run build` to create a production build of the app
- `pnpm run preview`

## Workflow for Handling Tasks in This Repository:

When you are ready to start working on a task, please adhere to the following steps to ensure consistency and traceability within the project workflow:

1. **Task Assignment:**

   - Find a task you are interested in tackling from the issues list.
   - Assign the task to yourself to indicate that you are working on it.
   - Move the task to the "In Progress" column on the project board.
   - Update the task with a start date, marking when you began working on it.

2. **Development Workflow:**

   - Create a new branch from `main` for your task using a reasonable name e.g. `feature/issue-number-short-description` or `wip/migrate-payment-info-tests`
   - Work on your task in this branch, committing code as you make progress.

3. **Development Philosophy**
   Our approach emphasizes writing simple, straightforward code to enhance long-term maintainability and reduce the likelihood of bugs. For an understanding of what we consider 'simple,' refer to Rich Hickey's talk, [Simple Made Easy](https://www.infoq.com/presentations/Simple-Made-Easy/). Adhere to the following guidelines for successful PRs:

   - **Prefer Astro Over JavaScript:** Use .astro files for pages and components that do not require interactivity.
   - **Use SolidJS for Interactive Features:** Employ SolidJS only when interactivity is necessary.
   - **Minimize Dependencies:** Scrutinize each new node-module addition. Essentiality is key. If a feature isn't crucial, reconsider its inclusion.
   - **Opt for Simplicity:** Choose simpler solutions, even if it means removing non-essential features.
   - **Test Critical User Flows:** Ensure to write tests for user flows that are vital. A broken critical flow means a blocked user. Refer to the Testing section for guidelines.
   - **PR Readiness:** Before submitting a PR, confirm that your code functions as intended and all tests pass.

4. **Pull Requests (PR):**

   - Keep your PRs small and focused on the task you are solving. Unrrelated work shoukld be placed in a seperate PR.
   - Once your feature is complete and you have tested your changes, push your branch to the repository.
   - Create a Pull Request against the `main` branch.
   - Ensure your PR title clearly describes the feature or fix.
   - In the PR description, use the `Fixes #X` keyword followed by the issue number to [link your PR to the related issue](https://github.blog/2013-01-22-closing-issues-via-commit-messages/). This helps to automatically close the issue when the PR is merged.
   - Add a detailed description of what your PR accomplishes. Document any new functionalities or bug fixes.
   - For complex UI changes, screenshots or a screen video capture is appreciated.
   - New environment variables will also need to be added to cloudflare. Ask @cheningd to add your variables cloudflare in the PR request.
     - Add a comment to let other developers know how to get the new env variable. Do not post secrets or keys to github.
   - Request a review from a team member, tagging them in the PR.

5. **Code Review:**

   - Address any feedback given by reviewers in a timely manner.
   - Once approved, merge your PR into the `main` branch.
   - We don't merge code that doesn't build, or fails tests to main (main is our production branch)

6. **After Merging:**
   - Update the project board by moving the issue to the "Done" column.
   - Delete the feature branch after merging to keep the repository clean.

By following these guidelines, we maintain a clear and efficient process for task management and code integration.

## Testing

- Use [Playwright](https://playwright.dev/docs/running-tests) to write end-to-end (e2e) tests for critical user paths, like authentication.
- E2e tests, despite being slower and less stable than unit tests, are crucial for ensuring the reliability of critical user journeys.
- See example e2e tests in ./test-examples

- Todo: Use Vitest to unit test complex functions, like date manipulation

## Contribution Guidelines

For all changes, please submit a pull request (PR) for review.

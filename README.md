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
| `pnpm run preview`         | Previews build locally before deployment    |
| `pnpm run astro ...`       | Executes Astro CLI commands                 |
| `pnpm run astro -- --help` | Astro CLI help                              |

## Deployment

Cloudflare automatically deploys each commit.

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

3. **Pull Requests (PR):**

   - Once your feature is complete and you have tested your changes, push your branch to the repository.
   - Create a Pull Request against the `main` branch.
   - Ensure your PR title clearly describes the feature or fix.
   - In the PR description, use the `Fixes #X` keyword followed by the issue number to [link your PR to the related issue](https://github.blog/2013-01-22-closing-issues-via-commit-messages/). This helps to automatically close the issue when the PR is merged.
   - Add a detailed description of what your PR accomplishes. Document any new functionalities or bug fixes.
   - For complex UI changes, screenshots or a screen video capture is appreciated.
   - Request a review from a team member, tagging them in the PR.

4. **Code Review:**

   - Address any feedback given by reviewers in a timely manner.
   - Once approved, merge your PR into the `main` branch.

5. **After Merging:**
   - Update the project board by moving the issue to the "Done" column.
   - Delete the feature branch after merging to keep the repository clean.

By following these guidelines, we maintain a clear and efficient process for task management and code integration.

## Testing

_[Todo]_ We will use Playwright for high-level automated tests.

## Contribution Guidelines

For all changes, please submit a pull request (PR) for review.

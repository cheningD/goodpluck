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

_[Todo]_ Deployment is managed through Cloudflare Pages, with backend functions running on workers. Set up a GitHub action for automatic preview deployments on push.

## Testing

_[Todo]_ We use Playwright for high-level automated tests. Focus on unit testing only for modules with complex or critical logic.

---

### Todo Sections:

- **Contribution Guidelines**: Outline the process for making contributions to the repo.
- **Architecture Overview**: Briefly describe how the different parts of your project interact.
- **Local Environment Setup**: Detailed steps on how to set up the project locally.
- **Code Review Process**: Guidelines for code reviews to maintain code quality.
- **Error Handling**: Best practices for error handling within the project.

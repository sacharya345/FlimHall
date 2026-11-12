# Git and GitHub workflow

Status: Proposal — the repository is connected to GitHub and currently on
`main`; the team has decided to create their individual branches.

## Branches

- Keep `main` as the stable, demoable branch.
- Create short-lived branches from the latest `main`:
  - `feature/<short-description>` for product work
  - `fix/<short-description>` for defects
  - `docs/<short-description>` for documentation-only changes
- Use lowercase kebab-case descriptions, for example
  `feature/movie-listing`.
- Avoid direct commits to `main` except for an agreed urgent correction.

## Pull requests

1. Sync the local `main` branch before starting work.
2. Make a focused change on a branch and commit with a clear message.
3. Push the branch and open a pull request against `main`.
4. Describe the change, link its backlog item, and include relevant test/build
   results.
5. Request a teammate review; resolve feedback and ensure required checks pass.
6. Merge using the method agreed by the team, then remove the completed branch.

## Commit and repository hygiene

- Use concise, action-oriented commit messages.
- Never commit credentials, private data, generated dependencies, or local
  `.env` files.
- Keep `.env.example` updated with variable names and non-secret example values.
- Do not merge code that breaks the documented local setup or applicable
  quality checks.

## Team decisions still needed

- Confirm branch naming, review requirements, and merge method.
- Decide whether GitHub branch protection and required status checks can be
  enabled for this repository.
- Agree on commit-message format and how urgent fixes are handled.

---
name: "Git Commit Formatter"
description: "Automatically format Git commit messages using the Conventional Commits specification."
---

# Git Commit Formatter

This skill automates the creation of robust, standard Git commit messages by analyzing the staging area or current changes and preparing a Conventional Commit string.

## How to use this skill

1. **Analyze Changes**: Check what has been modified.
   - Run `git status` to see what changes are staged or unstaged.
   - Run `git diff --cached` if changes are staged, or `git diff` if they are not, to fully understand the details of the modifications.
2. **Determine Commit Type**: Map the changes accurately to one of the traditional Conventional Commit types:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation only changes
   - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
   - `refactor`: A code change that neither fixes a bug nor adds a feature
   - `perf`: A code change that improves performance
   - `test`: Adding missing tests or correcting existing tests
   - `build`: Changes that affect the build system or external dependencies
   - `ci`: Changes to CI configuration files and scripts
   - `chore`: Other changes that don't modify `src` or `test` files
   - `revert`: Reverts a previous commit
3. **Determine Scope (Optional but Recommended)**: Where applicable, specify the area of the codebase the change affects (e.g., `feat(auth)`, `fix(ui)`).
4. **Write the Title**: Provide a succinct description of the change written in the imperative mood (e.g., "add login endpoint" rather than "added login endpoint" or "adds login endpoint").
   - Format: `<type>(<scope>): <title>`
5. **Write the Body**: If the change warrants a longer description, provide a body that explains *why* the change was made and *how* it addresses the problem, rather than over-explaining *what* was changed (the code diff tells us that).
6. **Execution**: Provide the commit message to the user, or if explicitly asked to execute, use the `run_command` tool to run `git commit -m "..." -m "..."`. 

## Examples

**Example 1: A Feature**
```
feat(api): add user registration endpoint

Added a new robust API endpoint to handle user registration, verifying email uniqueness and hashing passwords before saving to the DB.
```

**Example 2: A Bug Fix**
```
fix(ui): resolve clipping issue on mobile nav bar

The navigation bar was clipping into the main content below 768px viewports due to fixed height limitations. Switched to flex layout.
```

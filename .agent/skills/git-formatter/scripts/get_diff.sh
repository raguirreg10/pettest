#!/bin/bash

# A simple helper script to get the relevant diff for the agent to analyze

# First, check if there are any staged changes
if git diff --cached --quiet; then
  # No staged changes, get unstaged changes
  echo "--- UNSTAGED CHANGES (git diff) ---"
  git diff
else
  # There are staged changes, get them
  echo "--- STAGED CHANGES (git diff --cached) ---"
  git diff --cached
fi

echo ""
echo "--- UNTRACKED FILES ---"
git ls-files --others --exclude-standard

#!/bin/bash
# Usage: ./scripts/commit-task.sh "<type>: <message>" <file> [<file>...]
# Stages ONLY the files you name, so unrelated/untracked work is never swept in.
set -e

MESSAGE=$1
shift
if [ -z "$MESSAGE" ] || [ $# -eq 0 ]; then
  echo "Usage: $0 \"<type>: <message>\" <file> [<file>...]"
  exit 1
fi

git add -- "$@"
if git diff --cached --quiet; then
  echo "No staged changes for the named files."
  exit 0
fi

git commit -m "$MESSAGE

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"

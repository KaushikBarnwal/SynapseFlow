---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 360
---

# 🐙 Git & GitHub Architecture, Command Mastery & Interview Guide

## 1. Core Architecture & Mental Model (Interview Crucial)
### The 3 Trees / Stages of Git
- **Working Directory**: Local files on physical disk (Untracked, Unmodified, or Modified state)
- **Staging Area (Index)**: Binary cache in `.git/index` preparing exact snapshot for next commit
- **Git Directory (Repository / HEAD)**: Immutable object database stored inside `.git/objects`
### Git Object Model (Content-Addressable Storage)
- **Blob**: Stores raw file contents (pure data; does NOT store filename, path, or permissions)
- **Tree**: Represents a directory; maps filenames, permissions, and sub-directories to Blob SHA hashes
- **Commit**: Links top-level Tree hash, parent commit hash(es), author/committer timestamp, and message
- **Annotated Tag**: Object pointing directly to a specific commit with a message, GPG signature, and tagger info
- **SHA-1 / SHA-256 Hash**: 40-character hexadecimal checksum uniquely identifying object integrity
### HEAD & References
- **HEAD**: Symbolic reference pointer pointing to the currently checked-out branch tip
- **Branch Pointer**: Movable lightweight pointer (41 bytes) to a specific commit SHA
- **Detached HEAD State**:
  - Occurs when checking out a specific commit hash or remote tag directly (`git checkout <hash>`)
  - Any new commits made in detached HEAD are orphaned once switching away
  - **Recovery / Fix**: Create a new branch immediately before switching: `git switch -c <recovery-branch>`

## 2. Repository Setup & Configuration
### Repository Initialization & Cloning
- `git init`: Initializes an empty local repository (generates `.git` folder structure)
- `git clone <url>`: Clones full remote repository history and configures default remote named `origin`
- `git status`: Inspects working directory and staging area (shows modified, staged, and untracked files)
### Author Identity Configuration
- `git config --global user.name "Name"`: Sets author name attached to all commits across user profile
- `git config --global user.email "email"`: Sets committer email (must match GitHub profile for verified badge)
- `git config --list --show-origin`: Displays all active configurations and the config files defining them
- **Configuration Hierarchy (Interview Trap)**:
  - `Local` (`.git/config`) $\rightarrow$ Overrides `Global`
  - `Global` (`~/.gitconfig`) $\rightarrow$ Overrides `System`
  - `System` (`/etc/gitconfig`) $\rightarrow$ Fallback machine-wide defaults

## 3. Basic Workflow & Commit Lifecycle
### Staging Operations
- `git add <file>`: Stages a specific file snapshot to the Index
- `git add .`: Stages all modified, added, and deleted files in current directory and subdirectories
- `git add -p` (Interactive Patch): Interactively review and stage individual code hunks (Senior SWE practice)
### Commit Operations
- `git commit -m "message"`: Records staged snapshot into immutable repository commit object
- `git commit -am "message"`: Automatically stages tracked modified files and commits (bypasses untracked files)
- `git commit --amend -m "new msg"`: Modifies last commit message or includes newly staged files (rewrites SHA!)
### Synchronization
- `git push`: Sends local branch commits to upstream remote tracking branch
- `git pull`: Downloads remote commits and integrates them into current local branch (`git fetch` + `git merge`)

## 4. Branching, Merging & Rebase Dynamics
### Branch Management
- `git branch`: Lists all local branches (`*` highlights active HEAD branch)
- `git branch -a`: Lists both local and remote tracking branches (`remotes/origin/...`)
- `git branch <name>`: Creates a new branch pointer at current HEAD (does not switch to it)
- `git checkout <name>` (or `git switch <name>`): Switches HEAD to point to specified branch
- `git checkout -b <name>` (or `git switch -c <name>`): Atomically creates branch and switches HEAD
- `git branch -d <name>`: Safely deletes branch only if changes are fully merged upstream
- `git branch -D <name>`: Force deletes branch regardless of merge status (discards unmerged commits)
### Fast-Forward vs 3-Way Merge
- `git merge <branch>`: Combines history of specified branch into current active branch
- **Fast-Forward Merge**:
  - Occurs when target branch directly stems from current branch without divergent commits
  - No new commit created; branch pointer simply fast-forwards to latest commit
- **3-Way Merge (True Merge)**:
  - Occurs when both branches have diverged with independent commits
  - Uses common ancestor + both branch tips to generate a new dedicated **Merge Commit** with two parents
### Git Merge vs Git Rebase (Key Interview Distinction)
- **`git merge`**:
  - Preserves exact historical timeline, branch provenance, and immutable commit SHAs
  - Can lead to cluttered history ("railroad tracks") in high-velocity teams
- **`git rebase <base-branch>`**:
  - Unwinds commits on current branch, fast-forwards base, and replays commits on top
  - Produces a clean, perfectly linear project history
- **The Golden Rule of Rebasing**:
  - *NEVER rebase commits that have been pushed to a public/shared branch!*
  - Rebasing rewrites commit hashes; public rebasing forces messy force-pushes and breaks teammates' work

## 5. Undo, Restore & Time-Travel Recovery
### Working Tree & Staging Cleanup
- `git restore <file>`: Discards uncommitted modifications in working directory (matches staging index)
- `git restore .`: Discards all uncommitted changes across the entire working tree
- `git restore --staged <file>`: Removes file from staging index back to working directory (unstaging)
- `git clean -fd`: Forcibly removes untracked files (`-f`) and untracked directories (`-d`)
### Reset Modes: Soft vs Mixed vs Hard (Top Interview Question)
- `git reset --soft HEAD~1`:
  - Moves HEAD back 1 commit
  - Leaves all file changes preserved in **Staging Area (Index)**
  - Use case: Redo commit message or squash last commit with new changes
- `git reset --mixed HEAD~1` (Default mode):
  - Moves HEAD back 1 commit
  - Clears Staging Area; leaves all changes in **Working Directory** (unstaged)
  - Use case: Uncommit and organize changes into smaller, logical commits
- `git reset --hard HEAD~1`:
  - Moves HEAD back 1 commit
  - **Discards Staging Area AND Working Directory changes**
  - High risk: Any uncommitted changes are permanently lost!
### Revert vs Reset
- `git reset`: Rewrites commit history (moves pointer backwards; unsafe for public branches)
- `git revert <commit>`:
  - Generates a **brand new commit** that applies exact inverse diff of target commit
  - Safe for public/production branches because history only moves forward
### Disaster Recovery with `git reflog`
- `git reflog`: Local ledger recording every single HEAD movement (checkouts, commits, rebases, hard resets)
- **Recovering "Accidentally Deleted" Commits**:
  - Even after `git reset --hard`, old commit object remains in reflog for ~30-90 days before garbage collection (`git gc`)
  - Locate lost commit SHA in reflog $\rightarrow$ `git reset --hard <sha>` or `git branch recovery <sha>`

## 6. Stashing, Forensics & Power Tools
### Context Switching with Stash
- `git stash` (or `git stash push -m "wip"`): Shelves dirty working directory and index onto temporary stack
- `git stash list`: Displays all stashed snapshots (`stash@{0}`, `stash@{1}`)
- `git stash apply`: Re-applies changes from stash while preserving stash entry in stack
- `git stash pop`: Re-applies top stashed changes and immediately removes it from stash stack
- `git stash drop`: Permanently discards a specific stash entry (`stash@{n}`)
### Commit Inspection & Forensics
- `git log --oneline`: Compact single-line summary of commit hashes and messages
- `git log --graph --oneline --all`: ASCII visualization of branch branching and merge convergence
- `git diff`: Compares working directory against staging area
- `git diff --staged`: Compares staging area against last repository commit (HEAD)
- `git show <commit>`: Inspects commit metadata, author details, and unified diff
- `git blame <file>`: Annotates every line of a file with author, commit SHA, and date of last modification
### Advanced Bug Hunting & Cherry-Picking
- `git bisect`:
  - Binary search algorithm through commit history to isolate exact commit that introduced regression
  - `git bisect start` $\rightarrow$ `git bisect bad` $\rightarrow$ `git bisect good <commit>` $\rightarrow$ test $\rightarrow$ `git bisect reset`
- `git cherry-pick <commit>`: Copies and replays a specific commit from an external branch onto current HEAD

## 7. Remote Repositories, GitHub & Team Workflows
### Remote Repository Connections
- `git remote -v`: Lists remote aliases (`origin`) with read/write URLs
- `git remote add origin <url>`: Binds local repository to a remote GitHub repository
- `git push -u origin <branch>`: Pushes local branch and establishes upstream tracking link (`-u` / `--set-upstream`)
- `git fetch`: Downloads all remote branches, tags, and commits without touching local working tree
- `git pull origin <branch>`: Fetches and integrates remote branch (`git fetch` + `git merge origin/<branch>`)
- `git push origin --delete <branch>`: Deletes a remote branch on GitHub server
### GitHub Collaboration & Enterprise Workflows
- **Fork vs Clone**:
  - `Fork`: Creates remote copy of repository under your personal GitHub account (open source contribution model)
  - `Clone`: Downloads local copy of any accessible repository to your physical workstation
- **Pull Request (PR) Lifecycle**:
  - Feature branch created $\rightarrow$ commits pushed $\rightarrow$ PR opened with description & issue link
  - Automated CI checks trigger (unit tests, linters, security scans)
  - Peer code review $\rightarrow$ approvals $\rightarrow$ merge into main branch
- **GitHub Merge Strategies**:
  - **Create a merge commit**: Retains full branch history and individual commit hashes
  - **Squash and merge**: Condenses all feature branch commits into a single clean commit on base branch
  - **Rebase and merge**: Replays individual commits onto base branch linearly without merge commit
- **Branch Protection Rules (Production Guardrails)**:
  - Prevent direct push to `main` / `master` (enforce PRs)
  - Require minimum approved peer reviews before merging
  - Require passing status checks (GitHub Actions / Jenkins CI)
  - Enforce linear history / require signed commits (GPG keys)

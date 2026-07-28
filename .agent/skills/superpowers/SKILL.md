---
name: superpowers
description: Advanced engineering workflows, systematic planning, root-cause debugging, automated verification, code architecture refactoring, and Git repository management discipline.
---

# Agentic Superpowers & Advanced Engineering Skill

This skill provides powerful workflows and engineering capabilities for complex software development tasks.

## 1. Systematic Planning & Task Management
- **Plan-First Approach**: Conduct thorough investigation of existing code architecture before modifying implementation files.
- **Task Tracking**: Break down complex features into modular items (`task.md`) and track progress iteratively (`[ ]`, `[/]`, `[x]`).
- **User Alignment**: Document architectural decisions, breaking changes, and design options clearly in implementation plans.

## 2. Root-Cause Debugging & Log Diagnostics
- **Empirical Diagnostics**: Inspect full runtime tracebacks, terminal output, and log Uri files before forming diagnostic hypotheses.
- **No Superficial Symptom Patching**: Fix underlying contracts and data providers instead of wrapping calls in silent try/catch or dummy fallbacks.
- **Perseverance on Log Extraction**: Use alternative diagnostic tools if a log extraction command fails.

## 3. Automated Verification & Continuous Quality
- **Empirical Verification**: Run build checks (`npm run build`, `tsc`), linting, and dev server diagnostics after every feature implementation or edit.
- **Zero-Regression Guarantee**: Ensure existing routing, components, and state management remain 100% functional after refactoring.
- **Argument & Type Integrity**: Strictly verify function signatures, interface types, and component prop structures.

## 4. Git Discipline & Repository Security
- **Clean Environment**: Maintain strict `.gitignore` lists to prevent `node_modules/`, `.next/`, `.env*`, and temporary OS files from being committed.
- **Atomic Commits**: Write descriptive commit messages summarizing the architectural rationale and key changes.
- **Remote Integration**: Automate GitHub repository creation, SSH/HTTPS remote binding, and branch tracking (`main`).

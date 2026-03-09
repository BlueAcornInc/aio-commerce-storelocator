# Skill: Checklist-Driven Remediation Workflow

## When To Use

When working through a list of issues (submission feedback, code review comments, audit findings) that need individual fixes committed atomically with full traceability.

## Setup

1. **Two tracking files** in a `.spec/` directory:
   - `submission-checklist.md` — live tracker with tables containing Status + Who Resolved columns
   - `submission-refactoring.md` — reference doc with full context (reviewer quotes, file paths, fix details)
2. **One feature branch** (e.g., `fix/submission-remediation`) — not per-item branches
3. **One commit per checklist item** — atomic, revertable, reviewable

## Commit Convention

Each commit must:

- Use the checklist ID as a prefix: `fix(SEC-2):`, `fix(BLK-1):`, `docs(DOC-1):`
- Have a **detailed first line** (≤72 chars) summarizing the fix
- Have a **body** explaining: what was wrong, why it matters, what changed
- Update `submission-checklist.md` status in the same commit

### Commit Message Template

```
fix(ITEM-ID): concise summary of the fix

Problem: <what was wrong and why it matters>
- <specific detail, e.g., line numbers, security impact>

Fix: <what was changed>
- <file: change description>

Checklist: mark ITEM-ID as done in .spec/submission-checklist.md
```

### Example

```
fix(SEC-2): remove console.log that leaked IMS bearer token

Problem: App.jsx L25 logged {imsOrg, imsToken} on every configuration
change event, exposing the bearer token in browser devtools. index.js
L63 logged the full imsProfile object which may contain PII. Both
violate the submission guideline: "No logging of sensitive credentials."

Fix:
- App.jsx: remove console.log from configuration and history handlers
- index.js: remove console.log of imsProfile from ready handler

Checklist: mark SEC-2 as done in .spec/submission-checklist.md
```

## Execution Order

1. **Code fixes first** — no cross-dependencies, safe to parallelize mentally
2. **Config/project structure** — env.dist, deploy.yaml, gitignore changes
3. **Documentation** — references may depend on code changes being done
4. **Dependencies** — changes package-lock.json, do near end to minimize merge noise

## Verification

After all items:

- `npm run lint:check` passes
- `npm audit` shows no critical/high
- `aio app build` succeeds (if available)
- All checklist items marked ✅ in submission-checklist.md
- Push branch, open PR for review

## Anti-patterns

- ❌ Don't batch multiple unrelated fixes into one commit
- ❌ Don't forget to update the checklist in each commit
- ❌ Don't commit to main directly — use a branch + PR
- ❌ Don't create separate branches per trivial fix (overhead > value)
- ❌ Don't fix 🔴 (architecture) items in the same branch — those get Jira tickets

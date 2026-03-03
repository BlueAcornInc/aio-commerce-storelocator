# Store Locator — Submission Remediation Checklist

> **Tracking file for the resubmission of Store Locator v1.0.5.**
> For full context on each item (reviewer quotes, file locations, fix details), see [submission-refactoring.md](submission-refactoring.md).

---

## Reviewer Feedback — Must Do

These items come directly from the Adobe review (Ryan Cohen, Maria Kovdrysh — August 18, 2025). Every row = one piece of reviewer feedback. **All must be resolved before resubmission.**

| ID     | Category      | Summary                                                                                                                                                                     | Effort | Status         | Who Resolved      | Notes                                 |
| ------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------- | ----------------- | ------------------------------------- |
| DOC-1  | Documentation | PaaS vs SaaS distinction in README.md — remove "SaaS" references, clarify PaaS-only steps                                                                                   | 🟡     | ⬜ Not Started |                   |                                       |
| DOC-2  | Documentation | Add `npm install` step before `aio app deploy` — already present in code block, needs prose callout                                                                         | 🟢     | ⬜ Not Started |                   | May already be fixed                  |
| DOC-3  | Documentation | Fix broken image link at README.md line ~154 (`docs/img/admin-ui-sdk-setup.png`)                                                                                            | 🟢     | ⬜ Not Started |                   |                                       |
| DOC-4  | Documentation | Fix AIO CLI plugin install command — verify no `@adobe/aio-cli-plugin-commerce` refs remain                                                                                 | 🟢     | ⬜ Not Started |                   | May already be fixed                  |
| DOC-5  | Documentation | Add da.live steps for adding store-locator & product-availability blocks to storefront pages                                                                                | 🟡     | ⬜ Not Started |                   |                                       |
| DOC-6  | Documentation | Fix inaccessible links in `blocks/store-locator/README.md` (private Google Sheets/Docs URLs)                                                                                | 🟡     | ⬜ Not Started |                   |                                       |
| CR-1   | Code Review   | **Security:** Commerce REST API token exposed in public `config.json`. Create App Builder proxy action for inventory. Implement IMS (SaaS) + OAuth (PaaS) auth server-side. | 🔴     | ⬜ Not Started |                   | Separate epic recommended             |
| CFG-1  | Configuration | `requiredProducts` → `productDependencies` in `app.config.yaml`                                                                                                             | 🟢     | ✅ Done        | (post-submission) | Already fixed in current code         |
| CFG-2  | Configuration | Add `author` field to `package.json`                                                                                                                                        | 🟢     | ✅ Done        | (post-submission) | Already fixed in current code         |
| CFG-3  | Configuration | Clean up `deploy.yaml` — remove unused mesh config, commerce-eventing, hardcoded stage URL                                                                                  | 🟢     | ⬜ Not Started |                   |                                       |
| FUNC-1 | Functionality | Support tab links don't open in Admin UI SDK iframe — GitHub links blocked by X-Frame-Options                                                                               | 🟡     | ⬜ Not Started |                   | `sandbox: "allow-popups"` already set |
| DEP-1  | Dependencies  | `npm audit` reports high/critical vulnerabilities — upgrade deps                                                                                                            | 🟡     | ⬜ Not Started |                   |                                       |

---

## Reviewer Feedback — Nice to Have

Recommended by reviewers. Not blockers but strengthen the resubmission.

| ID    | Category      | Summary                                                                                                                 | Effort | Status         | Who Resolved | Notes               |
| ----- | ------------- | ----------------------------------------------------------------------------------------------------------------------- | ------ | -------------- | ------------ | ------------------- |
| NTH-1 | Code Review   | Extension ID mismatch — `extension-manifest.json` uses `StoreLocator`, `ExtensionRegistration.jsx` uses `store-locator` | 🟢     | ✅ Done        | Copilot      | Aligned to manifest |
| NTH-2 | Documentation | `EDS.md` duplicates `README.md` content — consolidate                                                                   | 🟢     | ⬜ Not Started |              |                     |
| NTH-3 | Documentation | `npm install @blueacornici/storefront-storelocator` doesn't work (only `@beta` works)                                   | 🟢     | ⬜ Not Started |              |                     |
| NTH-4 | Script Mgmt   | Lint scripts in `package.json` return errors when run                                                                   | 🟡     | ⬜ Not Started |              |                     |
| NTH-5 | Dependencies  | Outdated deps — run `npx npm-check`, look for `MAJOR UP`                                                                | 🟡     | ⬜ Not Started |              |                     |
| NTH-6 | Dependencies  | Unused deps — run `npx npm-check`, look for `NOTUSED?` (e.g., `oauth-1.0a`)                                             | 🟢     | ⬜ Not Started |              |                     |

---

## Additional Findings — Codebase Audit

These were not in the reviewer's feedback but are submission guideline violations or bugs found during our own code review. Addressing these proactively will reduce risk of rejection in the next round.

| ID     | Category          | Summary                                                                                                                       | Effort | Status         | Who Resolved | Notes                               |
| ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------ | -------------- | ------------ | ----------------------------------- |
| SEC-2  | Security          | `App.jsx` L25 logs `{ imsOrg, imsToken }` — **leaks bearer token to browser console**. `index.js` L63 logs full `imsProfile`. | 🟢     | ✅ Done        | Copilot      |                                     |
| SEC-3  | Security          | Private key + cert in `dist/dev-keys/` — may be git-tracked                                                                   | 🟢     | ⬜ Not Started |              | `git rm -r --cached dist/`          |
| PROJ-1 | Project Structure | `env.dist` is empty (`# no variables are required`) — guidelines require all keys documented                                  | 🟢     | ⬜ Not Started |              |                                     |
| PROJ-2 | Project Structure | `final: false` on registration action — docs say `final: true`                                                                | 🟢     | ✅ Done        | Copilot      |                                     |
| PROJ-3 | Project Structure | `.devcontainer/devcontainer.json` says `"ShipsStation Commerce App"` — copy-paste bug                                         | 🟢     | ✅ Done        | Copilot      |                                     |
| UI-1   | Admin UI          | `App.jsx` L53 — `onError(e, componentStack) {}` is empty (no logging)                                                         | 🟢     | ✅ Done        | Copilot      |                                     |
| UI-2   | Admin UI          | `Welcome.jsx` — says "Magento's native MSI". Guidelines say avoid "Magento"                                                   | 🟢     | ✅ Done        | Copilot      |                                     |
| BLK-1  | Blocks            | `store-locator.js` ~L128 — `tel:${item}` uses string `"phone"` not `store.phone`                                              | 🟢     | ✅ Done        | Copilot      |                                     |
| BLK-2  | Blocks            | `store-locator.js` ~L229-230 — double opacity set (`"100%"` then `"inherit"`)                                                 | 🟢     | ⬜ Not Started |              |                                     |
| BLK-3  | Blocks            | `store-locator.js` ~L155 — `fetch()` for stores.json has no error handling                                                    | 🟢     | ⬜ Not Started |              |                                     |
| BLK-4  | Blocks            | `store-locator.js` L167 — `setTimeout(200)` race condition waiting for Leaflet                                                | 🟡     | ⬜ Not Started |              |                                     |
| BLK-5  | Blocks            | `product-availability.js` — error returns `undefined`, causes silent downstream failure                                       | 🟡     | ⬜ Not Started |              |                                     |
| TEST-1 | Testing           | No test files exist. `jest` in devDeps but `npm test` is a no-op.                                                             | 🔴     | ⬜ Not Started |              | Minimal: registration + postinstall |

---

## Progress Summary

| Section      | Total  | Done  | Remaining |
| ------------ | ------ | ----- | --------- |
| Must Do      | 12     | 2     | 10        |
| Nice to Have | 6      | 0     | 6         |
| Additional   | 13     | 0     | 13        |
| **Total**    | **31** | **2** | **29**    |

**Last Updated:** March 3, 2026

# STORE-LOC: Submission Remediation — Store Locator v1.0.5

**Type:** Epic  
**Priority:** P1 — Blocker for Resubmission  
**Reviewers:** Ryan Cohen, Maria Kovdrysh  
**Review Date:** August 18, 2025  
**Submitted Version:** 1.0.4 (zip: `abu9q09vq6-98f9ca02-89aa-4ce1-adc1-9fc2cc458b09.zip`)  
**Spec:** [store_locator-aug_15_submission.pdf](store_locator-aug_15_submission.pdf)

**References:**

- [App Submission Guidelines](https://developer.adobe.com/commerce/extensibility/app-development/app-submission-guidelines/)
- [Admin UI SDK App Review Checklist](https://developer.adobe.com/commerce/extensibility/admin-ui-sdk/app-review-checklist/)
- [Extension Compatibility (PaaS/SaaS)](https://developer.adobe.com/commerce/extensibility/app-development/extension-compatibility/)
- [Admin UI SDK App Registration](https://developer.adobe.com/commerce/extensibility/admin-ui-sdk/app-registration/)

---

## How We're Working This

We use **two files** in `.spec/`:

| File                                                   | Purpose                                                                                                                                                                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **[submission-checklist.md](submission-checklist.md)** | **Live tracker.** Three tables: (1) Must Do reviewer feedback, (2) Nice to Have reviewer feedback, (3) Additional findings from codebase audit. Each row has a status and "Who Resolved" column. Update this as items are completed. |
| **submission-refactoring.md** (this file)              | **Reference doc.** Full context for every item — exact reviewer quotes, file paths, line numbers, fix instructions, and architectural notes. Use this when you need to understand _what_ to change and _why_.                        |

**Workflow:**

1. Open `submission-checklist.md` to see what's left to do
2. Pick an item — look up its ID (e.g., `DOC-1`, `BLK-1`) in this file for the full details
3. Make the fix
4. Update `submission-checklist.md`: set status to `✅ Done`, fill in "Who Resolved"
5. Commit with the item ID in the message (e.g., `fix(DOC-1): clarify PaaS vs SaaS in README`)

**For Copilot sessions:** Include both `.spec/submission-checklist.md` and `.spec/submission-refactoring.md` as context. The checklist shows what's left; the refactoring doc has the details needed to implement each fix.

---

## How To Read This

Every item in the **Must Do** and **Nice to Have** sections maps 1:1 to a line of reviewer feedback. The exact reviewer comment is quoted in each item so you can trace it back.

Effort tags:
| Tag | Meaning |
|-----|---------|
| 🟢 **Quick Win** | Small, safe, can knock out right now |
| 🟡 **Moderate** | Scoped but needs some care / testing |
| 🔴 **Dev Review** | Architecture decisions, significant effort, or separate epic |

---

## MUST DO — Reviewer Feedback

These map directly to each row in the "Must Do" table from the review PDF.

---

### DOC-1 🟡 PaaS vs SaaS Distinction in README.md

> **Reviewer:** _"In the README.md, more distinction is needed between PaaS and SaaS setup."_
>
> - _In "Local Setup" section: Change "Adobe Commerce SaaS workspace" to "Adobe Commerce", as the app is also compatible with PaaS._
> - _Adjust "Adobe Commerce (Cloud, SaaS or On-Premise): Version 2.4.7 or higher" to "Adobe Commerce: Version 2.4.7 or higher" for simplicity._
> - _In "Register App to Commerce Instance" section: All steps for "Stores>Configuration…" are PaaS/On-Prem-specific (setting up IMS, installing the Admin UI SDK package). Specify these steps are for non-SaaS only._
> - _In "Configuration" section: Remove mention of "SaaS", as the app should be compatible with non-SaaS Commerce instances too._

**What to change in `README.md`:**

1. **Line ~51** — Change `"…set up this project with an Adobe Commerce SaaS Workspace"` → `"…set up this project with Adobe Commerce"`
2. **Line ~56** — Change `"Adobe Commerce (Cloud, SaaS or On-Premise): Version 2.4.7 or higher"` → `"Adobe Commerce: Version 2.4.7 or higher"`
3. **Lines ~139-157** ("Register App to Commerce Instance") — Add a callout: `> **PaaS & On-Prem Only:** The following steps (IMS configuration, Admin UI SDK composer install) apply to PaaS and On-Premise deployments. SaaS instances have these pre-configured.`
4. **Line ~163** ("Configuration" heading) — Change `"Store Locator leverages native Adobe Commerce SaaS Sources…"` → `"Store Locator leverages native Adobe Commerce Sources…"` (drop "SaaS")

**Files:** `README.md`

---

### DOC-2 🟢 Add `npm install` Before `aio app deploy`

> **Reviewer:** _"Please add `npm install` to the README.md before mentioning `aio app deploy`."_

**What to change:** In the "Deploy The App" section (~line 89-99), `npm install` actually IS listed (line 97), but it appears inside a code block and may not be visually prominent. Verify the sequence is clearly:

```
npm install
aio app deploy
```

and add a prose sentence above: "Install dependencies before deploying."

**Files:** `README.md`  
**Status:** ✅ Already present in code block (line 97). Add a prose callout for clarity.

---

### DOC-3 🟢 Fix Broken Image Link at Line 154

> **Reviewer:** _"In line 154 of README.md, please fix the broken image link."_

**Current (line ~154):**

```markdown
![Running Admin UI SDK Locally](docs/img/admin-ui-sdk-setup.png)
```

**Action:** Verify the image file exists at `docs/img/admin-ui-sdk-setup.png`. If it doesn't exist or is gitignored, either add the image to the repo or remove the reference.

**Files:** `README.md`, `docs/img/`

---

### DOC-4 🟢 Fix AIO CLI Plugin Install Command

> **Reviewer:** _"Please replace `aio plugins install @adobe/aio-cli-plugin-commerce` with `aio plugins:install https://github.com/adobe-commerce/aio-cli-plugin-commerce`. Running `aio plugins install @adobe/aio-cli-plugin-commerce` results in a 'Error: @adobe/aio-cli-plugin-commerce does not exist in the registry.' error message."_

**Current (~line 63):**

```bash
$ aio plugins:install @adobe/aio-cli-plugin-api-mesh
$ aio plugins:install https://github.com/adobe-commerce/aio-cli-plugin-commerce
```

**Status:** ✅ This already appears correct in the current README (it shows the GitHub URL). Double-check that no other location in the repo references the `@adobe/` registry path.

**Also check:** `.devcontainer/Dockerfile` line 28 has:

```dockerfile
RUN . "$NVM_DIR/nvm.sh" && aio plugins:install https://github.com/adobe-commerce/aio-cli-plugin-commerce
```

This also looks correct already. Verify no stale references remain.

**Files:** `README.md`, `.devcontainer/Dockerfile`

---

### DOC-5 🟡 Add da.live Steps for EDS Block Setup

> **Reviewer:** _"Please add additional steps in the documentation about editing files in the da.live to reference the product-availability and store-locator blocks. For example, in https://da.live/edit#/blueacorninc/shop/products/default, there are additions for the product-availability and store-locator blocks that are needed for the blocks to show in the storefront. Please add step(s) for these changes that are needed to get the new blocks to show."_

**What to add:** A new section in `README.md` (or `EDS.md`) explaining:

1. How to open your project in da.live (Document Authoring)
2. How to add the `store-locator` and `product-availability` block tables to a page (e.g., a PDP)
3. Link to example: `https://da.live/edit#/blueacorninc/shop/products/default`
4. Screenshots or step-by-step of adding blocks to the document

**Files:** `README.md` and/or `EDS.md`

---

### DOC-6 🟡 Fix Inaccessible Links in Block READMEs

> **Reviewer:** _"Please make sure that links in README files are accessible to the user. For example, all links in `blocks/store-locator/README.md`, except for the last two, are not publicly accessible."_

**Current inaccessible links in `blocks/store-locator/README.md`:**
| Link | Problem |
|------|---------|
| `https://docs.google.com/spreadsheets/d/1zk2k46...` | Private Google Sheet |
| `https://main--showcase-evergreen-...hlx.live/store-locator/stores.json` | Internal hlx.live URL |
| `https://docs.google.com/document/d/1PPViXz...` | Private Google Doc |

The last two links (`https://da.live/#/blueacorninc/shop/store-locator` and the sheet link) are da.live links that **are** accessible.

**Fix:** Replace private Google links with:

- Generic instructions + the `example-stores.csv` as sample data
- Public documentation links or remove the private links entirely
- Keep da.live links as they are accessible

**Files:** `blocks/store-locator/README.md`

---

### CR-1 🔴 Security: Commerce Tokens Exposed in Public `config.json`

> **Reviewer:** _"For the configuration of the store-locator block, the user is currently asked to add their `restApiBaseUrl` and `restApiToken` to their storefront's `config.json` file. However, the `config.json` file is public, and storing a token for the Commerce instance in this file is a security issue."_
>
> _"We recommend creating a public app builder web action that is configured with the base URL and credentials for authentication that can act as a proxy for getting information from the relevant Commerce inventory endpoint. A token would then not be exposed in frontend code and credentials could be passed as environment variables to the web action through action configuration (ext.config.yaml). In the storefront's `config.json`, the block could then be configured with this app builder web action URL and send a request to it."_
>
> _"For generating a REST API token within the app builder action, we recommend using an approach like the one in the Commerce integration starter kit — see the 'Supported Auth Types' section. The approach in the starter kit allows for both PaaS and SaaS support and supports token regeneration within the code, which also avoids issues with token expiration. When adopting this approach, please make sure your documentation includes the required credentials for SaaS and PaaS/on-Prem auth and that these credentials are in your env.dist file."_

**This is the biggest architectural item.** It requires:

1. A new App Builder Runtime action (e.g., `actions/inventory-proxy/index.js`) that:
   - Accepts SKU + warehouse source code as input
   - Authenticates to Commerce REST API server-side (IMS for SaaS, OAuth for PaaS)
   - Returns inventory data
   - Has `require-adobe-auth: true` or is a public action with rate limiting
2. Update `blocks/product-availability/product-availability.js` to call the proxy action URL (from `config.json`) instead of the Commerce REST API directly
3. Update `env.dist` with the required Commerce credentials
4. Update `ext.config.yaml` to pass credentials as action inputs
5. Documentation for both PaaS and SaaS credential setup

**Reference:** [Starter Kit Supported Auth Types](https://github.com/adobe/commerce-integration-starter-kit?tab=readme-ov-file#supported-auth-types)

**Files:** New: `src/commerce-backend-ui-1/actions/inventory-proxy/index.js`, `ext.config.yaml`, `blocks/product-availability/product-availability.js`, `env.dist`, `README.md`

**Recommendation:** Separate epic — [SEC-1](#additional-sec-1--ims-auth--inventory-proxy-action) below.

---

### CFG-1 🟢 `requiredProducts` → `productDependencies` in app.config.yaml

> **Reviewer:** _"Line 4 of app.config.yaml contains 'requiredProducts'. Please replace this with 'productDependencies' as mentioned in the submission guidelines."_

**Current state:** Checking `app.config.yaml`:

```yaml
productDependencies:
  - code: COMMC
    minVersion: 2.4.7
```

**Status:** ✅ This is already `productDependencies` in the current code. Likely fixed after submission. Verify it matches the guidelines format exactly.

---

### CFG-2 🟢 Add `author` to `package.json`

> **Reviewer:** _"In addition to the 'name' and 'version' defined in package.json, please also define an 'author' in the file."_

**Current `package.json`:** Already has `"author": "Doug Hatcher"` and a `contributors` array.

**Status:** ✅ Already present. Verify it's still there — may have been fixed post-submission.

---

### CFG-3 🟢 Clean Up `deploy.yaml`

> **Reviewer:** _"`deploy.yaml` contains some configuration that no longer applies to the app (mesh configuration, the commerce-eventing api). Please cleanup the file."_

**Current state:** `deploy.yaml` exists only in `dist/storelocator-1.0.3/` (not project root). It contains:

```yaml
apis:
  - code: commerceeventing # ← not used
meshConfig: # ← not used
  sources:
    - name: AdobeCommerceAPI
      handler:
        graphql:
          endpoint: https://stage-sandbox.m2cloud.blueacorn.net//graphql # ← HARDCODED STAGE URL
```

**Fix:**

1. Create a clean `deploy.yaml` in the project root with only the relevant config
2. Remove `apis` section (commerceeventing not used)
3. Remove `meshConfig` section (or replace hardcoded URL with documentation)
4. Purge `dist/` from git tracking entirely

**Files:** New: `deploy.yaml` (project root), delete from `dist/`

---

### FUNC-1 🟡 Support Tab Links Don't Open

> **Reviewer:** _"In the Commerce admin Store Locator page, links in the 'Support' tab do not open. It seems the intention is for the links to open in tabs based on the links' html attributes. Opening links in a new tab through a page added with the Admin UI SDK is not currently supported."_
>
> _"In `src/commerce-backend-ui-1/actions/registration/index.js`, `sandbox: "allow-popups"` could be added after line 35 if Admin UI SDK 3.1.0+ is used to allow the 'Blue Acorn iCi', 'Documentation', and 'Contact Us' links to open in the admin. However, with this change, when the 'Create an Issue' and 'Issue Tracker' links, and the 'Shared Blocks' link in the Welcome tab are clicked, a 'github.com refused to connect' error shows due to security headers from GitHub. An alternative option could be to have these links on another page outside of the admin or within the app documentation."_

**Current state:** `registration/index.js` already has `sandbox: "allow-popups"` (line 42). But GitHub links will still fail due to GitHub's `X-Frame-Options` header.

**Fix options (pick one):**

1. **Move GitHub links to documentation page** — Replace GitHub links in Support.jsx with a link to the app's public documentation site (`https://apps.blueacornici.shop/`) which can list the issue tracker links
2. **Show links as copyable text** — Display the URLs as copyable text rather than clickable links for GitHub URLs
3. **Keep non-GitHub links as clickable** (Blue Acorn iCi, Contact Us, Documentation) and show GitHub URLs as copy-to-clipboard

**Also applies to Welcome.jsx:** The "Shared Blocks" link (`https://github.com/BlueAcornInc/aio-commerce-storelocator`) will also fail.

**Files:** `src/.../components/Support.jsx`, `src/.../components/Welcome.jsx`

---

### DEP-1 🟡 npm audit — High/Critical Vulnerabilities

> **Reviewer:** _"`npm audit` reports high and critical vulnerabilities. Please look into upgrading dependencies while ensuring that functionality does not break."_

**Action:**

1. Run `npm audit` and document findings
2. Run `npm audit fix` for non-breaking updates
3. For breaking updates, test individually
4. Re-run `npm audit` and verify no critical/high remain

**Files:** `package.json`, `package-lock.json`

---

## NICE TO HAVE — Reviewer Feedback

These are recommended improvements from the review. Not blockers but will strengthen resubmission.

---

### NTH-1 🟢 Extension ID Mismatch

> **Reviewer:** _"Please consider using the same extension ID in `extension-manifest.json` and `ExtensionRegistration.jsx` as mentioned in the docs. `extension-manifest.json` currently uses 'StoreLocator' and `ExtensionRegistration.jsx` currently uses 'store-locator'."_

**Current state:**
| Location | Value |
|----------|-------|
| `extension-manifest.json` | `"StoreLocator"` |
| `ExtensionRegistration.jsx` | `"store-locator"` |
| `registration/index.js` | `"StoreLocator"` |

**Fix:**

1. Create `src/commerce-backend-ui-1/web-src/src/components/Constants.js`:
   ```js
   export const extensionId = "StoreLocator";
   ```
2. Import and use in `ExtensionRegistration.jsx` and `registration/index.js`
3. This aligns with [the docs](https://developer.adobe.com/commerce/extensibility/admin-ui-sdk/app-registration/#add-an-extensionregistration-component): _"The extension ID should be the same as the one defined in the extension-manifest.json."_

**Files:** New: `Constants.js`, update `ExtensionRegistration.jsx`, `registration/index.js`

---

### NTH-2 🟢 EDS.md Duplicates README.md Content

> **Reviewer:** _"`EDS.md` contains content that is repeated in the `README.md`. Please consider reducing the duplicated content/documentation."_

**Fix:** Refactor `EDS.md` to either:

- Reference `README.md` for shared content and only contain EDS-specific instructions, OR
- Merge EDS content into README.md and delete `EDS.md`

**Files:** `EDS.md`, `README.md`

---

### NTH-3 🟢 blocks/README.md npm Install Not Working

> **Reviewer:** _"In `blocks/README.md`, the `npm install @blueacornici/storefront-storelocator` command does not yet work (we were able to install `npm install @blueacornici/storefront-storelocator@beta` though). Please confirm whether this is known and whether it is planned to be fixed when the app is published."_

**Fix:** Either:

1. Publish a stable release to npmjs.com so the command works, OR
2. Update the README to recommend `@beta` until stable is published, with a note about the timeline

**Files:** `blocks/README.md`, `blocks/package.json`

---

### NTH-4 🟡 Lint Scripts Return Errors/Warnings

> **Reviewer:** _"The lint scripts in package.json return errors when run. Please consider addressing the errors and warnings."_

**Action:**

1. Run `npm run lint:check` and capture output
2. Fix all errors (warnings can remain if intentional)
3. Ensure `npm run lint:check` passes cleanly

**Files:** Various source files, `.eslintrc.js`

---

### NTH-5 🟡 Outdated Dependencies (MAJOR UP)

> **Reviewer:** _"Some dependencies can be updated. Please check them: Run `npx npm-check` and look for the label 'MAJOR UP'."_

**Action:** Run `npx npm-check`, evaluate major updates for risk, update where safe.

**Files:** `package.json`

---

### NTH-6 🟢 Unused Dependencies (NOTUSED?)

> **Reviewer:** _"Some not used dependencies. Please check them. Run `npx npm-check` and look for the label 'NOTUSED?'. Please remove them if not used."_

**Known unused:** `oauth-1.0a` is in `package.json` but not imported anywhere.

**Action:** Run `npx npm-check`, remove all `NOTUSED?` packages.

**Files:** `package.json`

---

## ADDITIONAL FINDINGS — From Codebase Audit

These weren't in the reviewer's feedback but are submission guideline violations or bugs found during codebase review. Grouped by effort.

---

### Additional-SEC-1 🔴 IMS Auth + Inventory Proxy Action

This is the implementation epic for **CR-1** above. Creating the inventory proxy action that:

- Runs server-side in App Builder Runtime
- Authenticates to Commerce using IMS (SaaS) or OAuth/Integration (PaaS)
- Proxies `/inventory/source-items` requests
- Removes the need for tokens in the public storefront `config.json`

**Sub-tasks:**

1. Create `actions/inventory-proxy/index.js` with Commerce REST API call
2. Add IMS auth support using Starter Kit patterns
3. Keep OAuth 1.0a as PaaS fallback
4. Add action to `ext.config.yaml` with credential inputs
5. Update `product-availability.js` to call proxy instead of Commerce directly
6. Update `env.dist` with all required credential keys
7. Update `README.md` with PaaS and SaaS credential setup instructions
8. Add unit tests for the proxy action

**Reference:** [Starter Kit Auth Types](https://github.com/adobe/commerce-integration-starter-kit?tab=readme-ov-file#supported-auth-types) · [Extension Compatibility](https://developer.adobe.com/commerce/extensibility/app-development/extension-compatibility/)

---

### Additional-SEC-2 🟢 IMS Token Logged to Console

`App.jsx` line 25 logs `{ imsOrg, imsToken }` on configuration change events. This **leaks the bearer token to browser console**. Also `index.js` line 63 logs the full `imsProfile`.

Per guidelines: _"No logging of sensitive credentials or tokens."_

**Fix:** Remove or redact these console.log calls.

**Files:** `src/.../components/App.jsx` (L24-28), `src/.../web-src/src/index.js` (L63)

---

### Additional-SEC-3 🟢 Private Key & Build Artifacts in `dist/`

`dist/dev-keys/private.key` and `dist/dev-keys/cert-pub.crt` exist. While `.gitignore` lists `dist`, these may be tracked in git history.

**Fix:**

1. `git rm -r --cached dist/` to untrack
2. Consider `git filter-branch` or BFG to purge from history
3. Rotate any credentials associated with these keys

**Files:** `dist/`, `.gitignore`

---

### Additional-PROJ-1 🟢 Populate `env.dist`

Current content: `# no variables are required for use`

Per guidelines: _"Provide a clear `.env.dist` file containing all needed keys used by YAML files."_

**Fix:** Add all keys that the app uses (or will use after CR-1 proxy):

```bash
## Paste your workspace config here (generated by `aio app use`)
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=

## Commerce API Configuration
## See README.md for PaaS vs SaaS credential differences
# COMMERCE_BASE_URL=
# LOG_LEVEL=debug
```

**Files:** `env.dist`

---

### Additional-PROJ-2 🟢 `final: true` Missing on Registration Action

`ext.config.yaml` has `final: false`. The [registration docs](https://developer.adobe.com/commerce/extensibility/admin-ui-sdk/app-registration/#add-or-update-the-extconfigyaml) specify `final: true`.

**Fix:** Change `final: false` → `final: true`.

**Files:** `src/commerce-backend-ui-1/ext.config.yaml`

---

### Additional-PROJ-3 🟢 Devcontainer Name Says "ShipsStation"

`.devcontainer/devcontainer.json` line 2: `"name": "ShipsStation Commerce App"` — copy-paste from another project.

**Fix:** Change to `"name": "Store Locator Commerce App"`.

**Files:** `.devcontainer/devcontainer.json`

---

### Additional-UI-1 🟢 Empty Error Handler in App.jsx

`App.jsx` line 53: `function onError(e, componentStack) {}` — does nothing.

**Fix:** `console.error('UI Render Error:', e.message, componentStack);`

**Files:** `src/.../components/App.jsx`

---

### Additional-UI-2 🟢 "Magento" Reference in Welcome.jsx

Says _"leverages Magento's native Multi-Source Inventory"_. Per guidelines: _"Use project-specific language. Avoid generic references to 'Magento'."_

**Fix:** Change to "Adobe Commerce's native Multi-Source Inventory".

**Files:** `src/.../components/Welcome.jsx`

---

### Additional-BLK-1 🟢 `tel:` Link Bug

`store-locator.js` ~line 128: `el.href = \`tel:${item}\``sets href to`tel:phone` (the string "phone") instead of the actual phone number.

**Fix:** Change to `` el.href = `tel:${store[item]}` `` or `` el.href = `tel:${store.phone}` ``.

**Files:** `blocks/store-locator/store-locator.js`

---

### Additional-BLK-2 🟢 Double Opacity Assignment

`store-locator.js` ~lines 229-230: Sets opacity to `"100%"` then immediately overwrites with `"inherit"`.

**Fix:** Remove the first line.

**Files:** `blocks/store-locator/store-locator.js`

---

### Additional-BLK-3 🟢 No Error Handling on Store Data Fetch

`store-locator.js` ~line 155: `fetch("/store-locator/stores.json")` has no error handling.

**Fix:** Wrap in try/catch, check `response.ok`, show fallback message.

**Files:** `blocks/store-locator/store-locator.js`

---

### Additional-BLK-4 🟡 `setTimeout(200)` Race Condition

`store-locator.js` line 167: Uses 200ms timeout to wait for Leaflet to load. May fail on slow connections.

**Fix:** Await `loadScript()` if it returns a Promise, or poll for `window.L`.

**Files:** `blocks/store-locator/store-locator.js`

---

### Additional-BLK-5 🟡 Product Availability Silent Failure

`product-availability.js`: Error is caught and logged but function returns `undefined`. Downstream code (`setWarehouse(undefined)`) will throw.

**Fix:** Return empty result on error; add null checks in `setWarehouse`.

**Files:** `blocks/product-availability/product-availability.js`

---

### Additional-TEST-1 🔴 No Test Suite

`jest` is in devDependencies but zero test files exist. `npm test` is a no-op. Per guidelines: _"Ensure all tests are passing. Run `npm test` to validate."_

**Minimal scope for resubmission:**

- Unit test for `registration/index.js` (verify response shape)
- Unit test for `blocks/postinstall.js` (exported functions)
- Verify `npm test` runs and passes

**Files:** New: `test/` directory

---

## PRIORITIZED WORK PLAN

### Phase 1: Quick Wins (do now, ~2-3 hours)

| #   | Item                                                | Files                                           |
| --- | --------------------------------------------------- | ----------------------------------------------- |
| 1   | Additional-SEC-2: Remove console.log of tokens      | `App.jsx`, `index.js`                           |
| 2   | Additional-UI-1: Implement empty onError handler    | `App.jsx`                                       |
| 3   | Additional-UI-2: "Magento" → "Adobe Commerce"       | `Welcome.jsx`                                   |
| 4   | Additional-PROJ-2: `final: true` in ext.config.yaml | `ext.config.yaml`                               |
| 5   | Additional-PROJ-3: Fix devcontainer name            | `devcontainer.json`                             |
| 6   | Additional-BLK-1: Fix `tel:` link bug               | `store-locator.js`                              |
| 7   | Additional-BLK-2: Fix double opacity                | `store-locator.js`                              |
| 8   | NTH-1: Extension ID alignment + Constants.js        | `ExtensionRegistration.jsx`, new `Constants.js` |
| 9   | NTH-6: Remove unused deps (`oauth-1.0a`, etc.)      | `package.json`                                  |
| 10  | DOC-3: Fix broken image link                        | `README.md`                                     |
| 11  | DOC-4: Verify CLI plugin command                    | `README.md`                                     |
| 12  | CFG-1: Verify `productDependencies`                 | `app.config.yaml`                               |
| 13  | CFG-2: Verify `author` in package.json              | `package.json`                                  |

### Phase 2: Documentation & Config (1-2 days)

| #   | Item                                           | Files                            |
| --- | ---------------------------------------------- | -------------------------------- |
| 14  | DOC-1: PaaS vs SaaS distinction                | `README.md`                      |
| 15  | DOC-2: Clarify npm install step                | `README.md`                      |
| 16  | DOC-5: da.live EDS block setup steps           | `README.md` / `EDS.md`           |
| 17  | DOC-6: Fix inaccessible links in block READMEs | `blocks/store-locator/README.md` |
| 18  | NTH-2: Deduplicate EDS.md & README.md          | `EDS.md`                         |
| 19  | NTH-3: Fix/document npm install status         | `blocks/README.md`               |
| 20  | CFG-3: Clean up deploy.yaml                    | new `deploy.yaml`, purge `dist/` |
| 21  | Additional-PROJ-1: Populate env.dist           | `env.dist`                       |
| 22  | Additional-SEC-3: Untrack dist/ from git       | `.gitignore`, git commands       |

### Phase 3: Functionality & Dependencies (2-3 days)

| #   | Item                                          | Files                        |
| --- | --------------------------------------------- | ---------------------------- |
| 23  | FUNC-1: Fix Support tab links                 | `Support.jsx`, `Welcome.jsx` |
| 24  | DEP-1: npm audit fix                          | `package.json`               |
| 25  | NTH-4: Fix lint errors                        | various                      |
| 26  | NTH-5: Update outdated deps                   | `package.json`               |
| 27  | Additional-BLK-3: Fetch error handling        | `store-locator.js`           |
| 28  | Additional-BLK-4: Leaflet load race fix       | `store-locator.js`           |
| 29  | Additional-BLK-5: Availability error handling | `product-availability.js`    |

### Phase 4: Separate Epic — Architecture (1-2 weeks)

| #   | Item                                                       | Files                                                          |
| --- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| 30  | CR-1 / Additional-SEC-1: Inventory proxy action + IMS auth | New action, `ext.config.yaml`, blocks, `env.dist`, `README.md` |
| 31  | Additional-TEST-1: Minimal test suite                      | New `test/` directory                                          |

---

## Acceptance Criteria for Resubmission

- [ ] All **Must Do** items resolved or have documented mitigation
- [ ] `npm audit` shows no critical/high vulnerabilities
- [ ] `npm test` runs and passes (at least minimal tests)
- [ ] `npm run lint:check` passes without errors
- [ ] No tokens, secrets, or private URLs in source code or docs
- [ ] `env.dist` documents all required keys
- [ ] README documents both PaaS and SaaS setup paths
- [ ] Extension ID consistent across manifest, registration, and component
- [ ] `dist/` directory not tracked in git
- [ ] All links in README/block docs are publicly accessible
- [ ] Support tab links work or are moved to documentation

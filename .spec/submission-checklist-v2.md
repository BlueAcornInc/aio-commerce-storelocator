# Store Locator — Adobe Submission Review v2 (March 2026)

## Metadata

| Field    | Value                                               |
| -------- | --------------------------------------------------- |
| Zip      | abu9q09vq6-10e79d4b-051e-43a0-ba9c-8771f6075ffd.zip |
| Reviewer | Mayur Bagwe                                         |
| Date     | Started 23 Mar 2026                                 |

---

## Must Do

| ID    | Category      | Description                                                                                                                                                                         | Status | Resolved By |
| ----- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------- |
| DOC-1 | Documentation | Mention app is compatible with Adobe Commerce SaaS in Pre-Reqs: **Adobe Commerce:** Version 2.4.7 or higher / Adobe Commerce SaaS                                                   | ⬜     |             |
| DOC-2 | Documentation | Add the `Adobe Commerce as a Cloud Service` API to the App Builder project for SaaS env and `I/O Management API` for PaaS in Pre-Reqs                                               | ⬜     |             |
| DOC-3 | Documentation | Indicate whether this is an EDS storefront or a Luma storefront in the README.md — **Setup EDS Storefront**                                                                         | ⬜     |             |
| DOC-4 | Documentation | Mention format of `restApiBaseUrl` for SaaS & PaaS before the **Configuration Fields** section: `COMMERCE_BASE_URL` — SaaS includes tenantId, no `/rest`; PaaS ends with `/rest/V1` | ⬜     |             |
| DOC-5 | Documentation | If app uses API Mesh, mention steps to configure it                                                                                                                                 | ⬜     |             |
| DOC-6 | Documentation | Include a snippet showing how the Store Locator block appears on the EDS Storefront                                                                                                 | ⬜     |             |
| DOC-7 | Documentation | Consolidate the README.md from docs/ into the main README.md — merge multiple installation, configuration, and EDS Markdown files into a single README.md                           | ⬜     |             |

## Nice to Have

| ID    | Category     | Description                                                                   | Status | Resolved By |
| ----- | ------------ | ----------------------------------------------------------------------------- | ------ | ----------- |
| DEP-1 | Dependencies | `npx npm-check` indicates major version updates available — consider updating | ⬜     |             |
| DEP-2 | Dependencies | `npx npm-check` suggests unused dependencies — consider removing if safe      | ⬜     |             |

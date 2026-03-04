# DOC-5: Add da.live Steps for EDS Block Setup

**Type:** Story
**Priority:** P1 — Must Do (Reviewer Feedback)
**Estimate:** 3-5 hours
**Labels:** documentation, submission-remediation, store-locator

---

## Summary

Add step-by-step documentation for editing pages in da.live (Document Authoring) to reference the `store-locator` and `product-availability` blocks. Without these steps, users don't know how to make the blocks appear on their storefront pages.

## Background

> **Reviewer (Ryan Cohen / Maria Kovdrysh):** _"Please add additional steps in the documentation about editing files in the da.live to reference the product-availability and store-locator blocks. For example, in https://da.live/edit#/blueacorninc/shop/products/default, there are additions for the product-availability and store-locator blocks that are needed for the blocks to show in the storefront. Please add step(s) for these changes that are needed to get the new blocks to show."_

## Acceptance Criteria

- [ ] New section in `README.md` or `EDS.md` titled "Adding Blocks to Storefront Pages" (or similar)
- [ ] Step-by-step instructions covering:
  1. How to open your project in da.live (Document Authoring)
  2. How to add a `store-locator` block table to a page (e.g., the store locator page)
  3. How to add a `product-availability` block table to a PDP
  4. How to Preview and Publish the changes via AEM Sidekick
- [ ] At least one screenshot showing the block table in da.live editor (we already have `docs/img/install-storelocator-dalive.png` — use it)
- [ ] Link to example page: `https://da.live/edit#/blueacorninc/shop/products/default`
- [ ] Update `submission-checklist.md` to mark DOC-5 as Done

## Implementation Notes

- The `EDS.md` file has been consolidated to a pointer to README — so add the new section to `README.md` in the "Configuration" area, or create a new `docs/storefront-setup.md` page.
- The screenshot `docs/img/install-storelocator-dalive.png` already exists and is tracked.
- The `blocks/store-locator/README.md` Installation section already links to `https://da.live/#/blueacorninc/shop/store-locator` — cross-reference but don't duplicate.
- This requires domain expertise — the person writing this should have actually gone through the da.live authoring flow for this project.

## Files to Touch

- `README.md` (or `docs/storefront-setup.md`)
- Possibly `EDS.md` (add cross-reference)
- `.spec/submission-checklist.md` (mark DOC-5 done)

## References

- [Submission Refactoring Doc — DOC-5](./../submission-refactoring.md)
- [Submission Checklist](./../submission-checklist.md)
- [AEM Document Authoring](https://www.aem.live/docs/authoring)
- Example page: https://da.live/edit#/blueacorninc/shop/products/default

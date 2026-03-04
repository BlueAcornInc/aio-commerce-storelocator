# CR-1: Inventory Proxy Action — Remove Public Token Exposure

**Type:** Epic
**Priority:** P1 — Must Do (Reviewer Feedback, Security)
**Estimate:** 13-21 hours (across subtasks)
**Labels:** security, architecture, submission-remediation, store-locator

---

## Summary

The `product-availability` EDS block currently requires a Commerce REST API token in the storefront's public `config.json`. This exposes the token client-side. Create an App Builder Runtime action that proxies inventory requests server-side, authenticating to Commerce using IMS (SaaS) or OAuth 1.0a (PaaS).

## Background

> **Reviewer (Ryan Cohen / Maria Kovdrysh):** _"For the configuration of the store-locator block, the user is currently asked to add their `restApiBaseUrl` and `restApiToken` to their storefront's `config.json` file. However, the `config.json` file is public, and storing a token for the Commerce instance in this file is a security issue."_
>
> _"We recommend creating a public app builder web action that is configured with the base URL and credentials for authentication that can act as a proxy for getting information from the relevant Commerce inventory endpoint."_
>
> _"For generating a REST API token within the app builder action, we recommend using an approach like the one in the Commerce integration starter kit — see the 'Supported Auth Types' section."_

## Current State

`blocks/product-availability/product-availability.js` lines 36-48:
```js
const configData = await getConfigFromSession();
// configData.restApiBaseUrl and configData.restApiToken come from public config.json
const options = {
  headers: { Authorization: `Bearer ${configData.restApiToken}` }
};
fetch(`${configData.restApiBaseUrl}/inventory/source-items?...`, options)
```

The `restApiBaseUrl` and `restApiToken` values are stored in the storefront's `config.json` which is publicly accessible — anyone can extract the Commerce API token.

## Target Architecture

```
Browser (EDS Block)
  → App Builder Runtime Action (inventory-proxy)
    → Commerce REST API (/inventory/source-items)
       (authenticated server-side via IMS or OAuth 1.0a)
```

The block calls the proxy action URL (configured in `config.json`). The proxy authenticates to Commerce using credentials stored as action environment variables (never exposed to the client).

## Acceptance Criteria

- [ ] Commerce REST API token is NOT in `config.json` or any client-side code
- [ ] New App Builder action proxies `/inventory/source-items` requests
- [ ] Supports IMS authentication (SaaS instances)
- [ ] Supports OAuth 1.0a authentication (PaaS/On-Prem instances)
- [ ] Token regeneration is handled within the action (no expiry issues)
- [ ] `product-availability.js` block calls the proxy action URL instead of Commerce directly
- [ ] `config.json` only contains the proxy action URL — no credentials
- [ ] `env.dist` documents all required credential keys for both PaaS and SaaS
- [ ] `ext.config.yaml` passes credentials as action inputs
- [ ] README documents credential setup for both PaaS and SaaS
- [ ] Unit tests cover the proxy action (happy path + auth failures)
- [ ] Update `submission-checklist.md` to mark CR-1 as Done

---

## Subtasks

### 1. Create Inventory Proxy Action
**Estimate:** 5-8 hours

Create `src/commerce-backend-ui-1/actions/inventory-proxy/index.js`:
- Accept `sku` and optional `sourceCode` as query parameters
- Determine auth type from environment config (IMS vs OAuth)
- Authenticate to Commerce REST API server-side
- Call `GET /rest/V1/inventory/source-items?searchCriteria[...][value]={sku}`
- Return inventory data as JSON
- Handle errors (auth failure, Commerce unavailable, invalid SKU)

**Existing code to leverage:**
- `actions/oauth1a.js` — OAuth 1.0a client helper (already tracked)
- `actions/commerce/index.js` — Commerce API client (already tracked)
- `actions/utils.js` — Shared utilities (already tracked)

**Reference:** [Starter Kit Auth Types](https://github.com/adobe/commerce-integration-starter-kit?tab=readme-ov-file#supported-auth-types)

### 2. Configure Action in ext.config.yaml
**Estimate:** 1-2 hours

Add the inventory-proxy action to `src/commerce-backend-ui-1/ext.config.yaml`:
```yaml
inventory-proxy:
  function: actions/inventory-proxy/index.js
  web: 'yes'
  runtime: nodejs:20
  inputs:
    LOG_LEVEL: $LOG_LEVEL
    COMMERCE_BASE_URL: $COMMERCE_BASE_URL
    COMMERCE_CONSUMER_KEY: $COMMERCE_CONSUMER_KEY
    COMMERCE_CONSUMER_SECRET: $COMMERCE_CONSUMER_SECRET
    COMMERCE_ACCESS_TOKEN: $COMMERCE_ACCESS_TOKEN
    COMMERCE_ACCESS_TOKEN_SECRET: $COMMERCE_ACCESS_TOKEN_SECRET
  annotations:
    require-adobe-auth: false
    final: true
```

Decide on auth model:
- `require-adobe-auth: true` → requires IMS token from caller (more secure, SaaS-friendly)
- `require-adobe-auth: false` → public action (simpler for EDS blocks, needs rate limiting)

### 3. Update product-availability Block
**Estimate:** 2-3 hours

Modify `blocks/product-availability/product-availability.js`:
- Read proxy action URL from `config.json` (e.g., `inventoryProxyUrl`)
- Remove `restApiBaseUrl` and `restApiToken` from config usage
- Call the proxy action instead of Commerce REST API directly
- Handle proxy-specific errors (action timeout, rate limit)

### 4. Update env.dist and Documentation
**Estimate:** 2-3 hours

- Add all credential keys to `env.dist` with comments explaining PaaS vs SaaS differences
- Update `README.md` with credential setup instructions for both deployment types
- Update `blocks/README.md` config section — replace `restApiToken` with proxy URL
- Remove any references to storing Commerce tokens in `config.json`

### 5. Unit Tests
**Estimate:** 3-5 hours

- Test proxy action with mocked Commerce API responses
- Test IMS auth flow
- Test OAuth 1.0a auth flow
- Test error scenarios (invalid SKU, auth failure, Commerce down)
- Ensure `npm test` passes

---

## Files to Touch

| File | Change |
|------|--------|
| **New:** `src/.../actions/inventory-proxy/index.js` | Proxy action |
| `src/.../ext.config.yaml` | Register action + credential inputs |
| `blocks/product-availability/product-availability.js` | Call proxy instead of Commerce |
| `env.dist` | Add credential keys |
| `README.md` | Document PaaS/SaaS credential setup |
| `blocks/README.md` | Update config section |
| **New:** `test/inventory-proxy.test.js` | Unit tests |
| `.spec/submission-checklist.md` | Mark CR-1 done |

## References

- [Submission Refactoring Doc — CR-1](./../submission-refactoring.md)
- [Submission Checklist](./../submission-checklist.md)
- [Starter Kit Supported Auth Types](https://github.com/adobe/commerce-integration-starter-kit?tab=readme-ov-file#supported-auth-types)
- [Extension Compatibility (PaaS/SaaS)](https://developer.adobe.com/commerce/extensibility/app-development/extension-compatibility/)
- [App Builder Action Configuration](https://developer.adobe.com/app-builder/docs/guides/application_state/)

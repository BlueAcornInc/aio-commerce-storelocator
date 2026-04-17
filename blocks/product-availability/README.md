# Product Availability Block for Adobe Commerce

## Overview

This JavaScript module decorates a block with product availability details based on the selected store and its warehouse stock. It utilizes an event bus and session storage to dynamically update stock information for Adobe Commerce.

## Features

- Displays product availability for a selected store.
- Fetches warehouse stock data from an API.
- Updates the block when the store selection changes.
- Hides the availability information if no store is selected.

## Implementation

### 1. **Initialize the Block**

- Creates HTML elements to display stock availability, store details, and store address.
- Adds CSS classes for styling and hides elements initially.

### 2. **Fetch Warehouse Availability**

- Calls an API to retrieve product availability data.
- Uses the `sku` from the last recorded `pdp/data` event.
- The block resolves the inventory proxy URL from `window.__EXC_CONFIG__.actions["inventory-proxy"]` (set automatically when running inside App Builder) or from `window._myStoreConfig.inventoryProxyUrl` as a fallback.
- Authentication is handled via the IMS token from `window.__EXC_CONFIG__.ims.token` or `window._myStoreConfig.imsToken`. No tokens should be hardcoded in the block or in storefront configuration files.

### 3. **Update Block with Data**

- If a store is selected, finds the corresponding warehouse and updates the UI.
- If no store is selected, displays a message indicating unknown stock availability.

### 4. **Event Listener for Store Updates**

- Listens for the `updateAvailability` event.
- Retrieves the updated store from `sessionStorage` and updates the warehouse data.

# Product Availability Block for Adobe Commerce

## Overview

This block displays product stock availability for the selected store on the Product Details Page. It queries the Catalog Service GraphQL API (the same `commerce-endpoint` used by the rest of the storefront) and works with both Adobe Commerce SaaS and PaaS deployments.

## Features

- Displays product availability (`In Stock`, `Low Stock`, or `Out of Stock`) for the selected store.
- Queries stock status via the Catalog Service GraphQL `ProductView` type — no additional API configuration required.
- Updates dynamically when the store selection changes.
- Gracefully handles missing store selection or unavailable stock data.

## Implementation

### 1. **Initialize the Block**

- Creates HTML elements to display stock availability, store details, and store address.
- Adds CSS classes for styling and hides elements initially.

### 2. **Fetch Product Availability**

- Queries the Catalog Service GraphQL API using the `commerce-endpoint` and Catalog Service headers from `configs.json`.
- Uses the `sku` from the last recorded `pdp/data` event.
- Reads the `inStock` and `lowStock` fields from the `ProductView` response.

### 3. **Update Block with Data**

- If a store is selected and stock data is available, displays the stock status and store details.
- If no store is selected, prompts the user to choose one.

### 4. **Event Listener for Store Updates**

- Listens for the `updateAvailability` event dispatched by the Store Locator block.
- Re-queries availability and updates the display when the user selects a different store.

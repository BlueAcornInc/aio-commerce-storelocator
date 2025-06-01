---
title: Storefront Blocks
parent: Store Locator
---

# Storefront Blocks

The store locator has a set of blocks that are used with Adobe Commerce Storefront to show the locator and product availability.

* [Store Locator Block Collection](https://github.com/blueacorninc/aio-commerce-storelocator-blocks)

## Installation

### 1. **Initialize the Block**
- Loads Leaflet.js and required CSS.
- Creates UI components including a store list, ZIP code filter, and interactive map.

### 2. **Fetch and Display Store Data**
- Retrieves store data from `/store-locator/stores.json`.
- Dynamically generates store cards and map markers.

### 3. **Interactive Store Selection**
- Clicking a store card triggers an event to update session storage.
- Updates the displayed selected store details.
- Scrolls the list and pans the map to the selected store.

### 4. **ZIP Code Filtering**
- Implements a form to filter stores by ZIP code.
- Hides stores that do not match the entered ZIP.
- Adjusts map marker visibility accordingly.

### 5. **Event Handling and Custom Events**
- Listens for `storeNum` and `updateAvailability` events.
- Updates UI dynamically when a store is selected.


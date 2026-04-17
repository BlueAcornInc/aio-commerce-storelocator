# Store Locator Shared Block

Store locators for Edge Delivery Services

[View Demo](https://blueacornici.shop/products/photoshop-tee/ADB386)

## Technical Approach

The storefront exposes a `store-locator/stores` sheet as a `stores.json` endpoint that is consumed by the `store-locator` block in this directory.

With the AEM Sidekick installed, you can manage the entire store locator experience from your authoring environment (Google Drive, SharePoint, or da.live).

Edit your `store-locator/stores` sheet and use AEM Sidekick to Preview and Publish the changes. This produces a `stores.json` file that drives the store locator experience via this shared block.

The experience is driven by a combination of this block and a `store-locator/index` document. The document contains a `store-locator` table that places and configures the block at runtime.

### Product Availability

This block is intended to work in concert with the Product Availability block also included in this repository. It fetches store availability using the native GraphQL APIs that serve availability data.

## Installation

1. Add [this folder](https://da.live/#/blueacorninc/shop/store-locator) to your document-based project.

2. Then configure the [stores sheet](https://da.live/sheet#/blueacorninc/shop/store-locator/stores) to suit your needs.

## Document-based Authoring

To add the store locator block to a page, create a single-cell table in your EDS document (Google Doc, SharePoint, or da.live) with the header `store-locator`:

| store-locator |
| ------------- |
|               |

This renders as the following HTML on the storefront, which the block's `decorate()` function then populates with the interactive map, store list, ZIP code filter, and store selection UI:

```html
<div class="store-locator-wrapper">
  <div class="store-locator block" data-block-name="store-locator">
    <div>
      <div></div>
    </div>
  </div>
</div>
```

### Store Card Configuration

The block supports configuring which fields appear on store cards via `data-store-card-row-*` attributes on a `.store-locator-container` element. If no configuration is provided, the block defaults to showing the store **name**, **address**, and **phone**.

### Stores Sheet

The block reads store data from `/store-locator/stores.json`. This is produced by a `store-locator/stores` sheet in your authoring environment. The sheet should contain columns matching the fields in [example-stores.csv](../example-stores.csv):

| Column                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `name`                  | Store name                                 |
| `rating`                | Star rating (1-5)                          |
| `numOfReviews`          | Review count label (e.g. "26 reviews")     |
| `type`                  | Store type label                           |
| `address`               | Street address                             |
| `phone`                 | Phone number                               |
| `lat`                   | Latitude                                   |
| `lng`                   | Longitude                                  |
| `commerce_warehouse_id` | Commerce source code for inventory lookups |
| `zip`                   | ZIP code                                   |
| `state`                 | State                                      |
| `city`                  | City                                       |
| `hours`                 | Store hours                                |

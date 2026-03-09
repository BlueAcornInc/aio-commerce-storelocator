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

# Store Locator Shared Block

Store locators for Edge Delivery Services

[View Demo](https://blueacornici.shop/products/photoshop-tee/ADB386)

## Technical Approach

Helix exposes the [store-locator/stores sheet](https://docs.google.com/spreadsheets/d/1zk2k46zqc73RS_NhzvkxTmgPbSRN0Vsunjla-tzUAyw/edit?gid=1909637118#gid=1909637118) as [hlx.live/store-locator/stores.json](https://main--showcase-evergreen-commerce-storefront--blueacorninc.hlx.live/store-locator/stores.json) that is consumed by the `store-locator` block in this directory.

with the AEM Sidekick installed, we can manage the entire store locator experience within Google Drive or Sharepoint. 

Edit [store-locator/stores sheet](https://docs.google.com/spreadsheets/d/1zk2k46zqc73RS_NhzvkxTmgPbSRN0Vsunjla-tzUAyw/edit?gid=1909637118#gid=1909637118) and use AEM Sidekick to Preview and Publish the changes. This will produce a [hlx.live/store-locator/stores.json](https://main--showcase-evergreen-commerce-storefront--blueacorninc.hlx.live/store-locator/stores.json) that we can drive our experience with the shared block.

The experience will be driven by a combination of this block and the [store-locator/index doc](https://docs.google.com/document/d/1PPViXzysO9FdQouEtEPp1pmww1NrJScWgIy0KxmKsPQ/edit?tab=t.0#heading=h.nbh8hvrzlmhd). The doc will contain a `store-locator` table that will be used to place and configure the block in runtime. 

### Product Availability

This block is intended to work in concert with the Product Availability block also included in this repository. It fetches store availability works using the native GraphQL APIs that serve availability data. 

### Todo


## Installation

1. Add [this folder](https://da.live/#/blueacorninc/shop/store-locator) to your document-based project:

2. Then configure the [stores sheet](https://da.live/sheet#/blueacorninc/shop/store-locator/stores) to suit your needs. 

### Example Stores Sheet

```

```
																																	
																			
																			
																			
																			
																			
																			
																			
																			
																			
																			
																			
																			
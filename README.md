# Store Locator App for Adobe Commerce

The **Store Locator App** is a customizable, cloud-native application built using Adobe Commerce App Builder. It integrates seamlessly with Adobe Commerce Core SaaS and Edge Delivery Services.

Originally developed and showcased at Adobe Summit, the app serves as a production-ready starter kit for brands looking to add location-based services to their Adobe Commerce storefronts with minimal setup and full configurability.

---

## Environment Info

```bash
Customize your code: https://github.com/blueacorninc/shop-storelocator
Manage your Commerce config: https://github.com/blueacorninc/shop-storelocator/blob/main/config.json
Edit your content: https://da.live/#/blueacorninc/shop-storelocator
Preview your storefront: https://main--shop-storelocator--blueacorninc.aem.page/
Access your Commerce Admin: https://na1-sandbox.admin.commerce.adobe.com/C6wSs2HrNy7D79CYD5AFZP
Try out your API: https://edge-graph.adobe.io/api/d5814934-4c87-49e1-9c70-1bdac684f1b2/graphql
To check the status of your Mesh, run aio api-mesh status
To update your Mesh, run aio api-mesh update mesh_config.json
View your Mesh details: https://developer.adobe.com/console/projects/1244026/4566206088345438655/workspaces/4566206088345462424/details
For next steps, including how to customize your storefront and make it your own, check out our docs:
https://experienceleague.adobe.com/developer/commerce/storefront/
```

## Features

### Location Management
- Admin interface for managing physical store locations
- Supports address, contact info, operating hours, and more
- Integrated with Adobe Commerce's Multi-Source Inventory (MSI) to fetch store/warehouse locations dynamically

### Frontend Store Finder
- Customer-facing UI to search for stores near a specific location
- Integrated map component with location pins
- Filtering based on distance or available products
- Built using Edge Delivery Services for fast, native rendering

### Configurable Theme
- Fully themeable: update logos, colors, and layout with no code
- Based on document-based authoring model compatible with Adobe Edge Delivery
- Built as a reusable starter kit with design tokens ready for customization

### Commerce-Aware
- Optionally display product availability by location
- Useful for Buy Online, Pickup In Store (BOPIS) use cases
- Deep integration with Adobe Commerce product catalog and inventory APIs

### Admin Config UI
- Embedded directly into Adobe Commerce Admin Panel
- Native look and feel using Adobe Spectrum Web Components
- Configure map provider API keys, UI settings, and behavior rules

### Fast Deployment
- Deployable as an Adobe Commerce App Builder extension
- Powered by Adobe Runtime and Edge Delivery
- Typically goes live in under 1 week with full functionality

---

## Use Cases

- Retail brands with multiple physical store locations
- Omnichannel strategies needing local pickup options
- B2B companies with warehouse ordering systems
- Franchises or partners requiring localized storefronts

---

## Tech Stack

- Adobe Commerce App Builder (Node.js Runtime)
- Adobe Edge Delivery Services
- Adobe Commerce Core SaaS APIs
- Multi-Source Inventory (MSI)
- Spectrum Web Components
- Mapbox or Google Maps (Configurable)
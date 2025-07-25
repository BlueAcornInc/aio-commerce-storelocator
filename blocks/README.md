# Store Locator Block for Adobe Commerce Storefront

This npm package provides a Store Locator block that can be easily installed into any Adobe Commerce Storefront project.

## Features
- Store availability by leveraging native inventory sources
- Interactive maps using Leaflet.js
- Store filtering by ZIP code
- Seamless integration with Adobe Commerce Storefront
- Automatic installation into your project's blocks directory

## Installation for Merchants

### Install via npm

To install the Store Locator blocks in your Adobe Commerce Storefront project:

```bash
npm install @blueacorninc/storefront-storelocator
```

The post-install script will automatically copy the store locator blocks to your project's `blocks/` directory.

### Requirements

- Your project must have a `blocks/` directory (standard in Adobe Commerce Storefront projects)
- Node.js and npm installed

### Manual Installation

Alternatively, you can manually copy the blocks:

1. Download or clone this repository
2. Copy the `store-locator/` and `product-availability/` directories from `aio/storelocator/blocks/` to your storefront's `blocks/` directory
3. The blocks will be available at `/blocks/store-locator` and `/blocks/product-availability`

### Verify Installation

After installation, you should see the store locator blocks in your `blocks/` directory with the following structure:

```
blocks/
├── store-locator/
│   ├── store-locator.js
│   ├── store-locator.css
│   └── README.md
└── product-availability/
    ├── product-availability.js
    ├── product-availability.css
    └── README.md
```

## Usage

Once installed, the Store Locator block can be used in your Adobe Commerce Storefront pages by referencing it in your content.

## Configuration

Store Locator leverages native Adobe Commerce SaaS Sources and Inventory to provide store locations and product availability. You'll need to configure:

1. **Sources** - Set up store locations in Adobe Commerce Admin under Stores > Inventory > Sources
2. **Inventory** - Assign product inventory to your sources through Catalog > Products

## Features

- **Store availability** by leveraging native inventory sources
- **Interactive maps** with Leaflet.js integration
- **ZIP code filtering** for easy store location
- **Store selection** with session storage
- **Responsive design** that works on all devices

## Support

For support and documentation, please visit the [main repository](https://github.com/BlueAcornInc/storefront).

## License

MIT License - see LICENSE file for details.

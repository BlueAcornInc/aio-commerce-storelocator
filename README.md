# Store Locator by Blue Acorn

This app introduces store locator functionality, allowing users to select a store and view details on a map using Adobe Commerce Storefront (Edge Delivery Services).

It integrates Leaflet.js to display store locations and enables filtering by ZIP code. It also provides store availability leveraging the native commerce APIs.

## Features

- Store availability by leveraging native inventory sources
- Interactive maps powered by Leaflet.js
- Store locations retrieved from an API and displayed as cards and map markers
- ZIP code filtering to narrow down store results
- Store selection with session storage persistence
- Dynamic UI updates when a store is selected
- Product availability per store via native Commerce inventory

## Setup Instructions

Full installation and configuration steps live in the **[Installation Guide](install.md)**, which covers:

- Prerequisites and Adobe I/O CLI setup
- Adobe Commerce PaaS / On-Prem setup
- Adobe Commerce SaaS (Cloud Service) setup
- Deploying the app and configuring API Mesh
- Storing Commerce credentials via App Management
- Configuring Sources and Inventory
- Installing the EDS Storefront blocks and stores sheet

## EDS Storefront Blocks

The Store Locator includes shared blocks for Adobe Commerce Storefront (Edge Delivery Services):

- **[Store Locator Block](blocks/store-locator/README.md)** — Interactive store finder with map, ZIP code filtering, and store selection.
- **[Product Availability Block](blocks/product-availability/README.md)** — Displays product inventory availability across store locations.

See the [Installation Guide](install.md#eds-storefront-blocks) for block installation, the stores sheet format, and document-based authoring.

## Local Development

### Setup

- Populate the `.env` file in the project root and fill it as shown [below](#env)

### Local Dev

- `aio app run` to start your local Dev server
- App will run on `localhost:9080` by default

By default the UI will be served locally but actions will be deployed and served from Adobe I/O Runtime. To start a
local serverless stack and also run your actions locally use the `aio app run --local` option.

### Deploy & Cleanup

- `aio app deploy` to build and deploy all actions on Runtime and static files to CDN
- `aio app undeploy` to undeploy the app

### `.env`

You can generate this file using the command `aio app use`.

```bash
# This file must **not** be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=
```

### Debugging in VS Code

While running your local server (`aio app run`), both UI and actions can be debugged, to do so open the vscode debugger
and select the debugging configuration called `WebAndActions`.
Alternatively, there are also debug configs for only UI and each separate action.

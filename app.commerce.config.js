/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * App Management Configuration Schema
 * 
 * This file defines the configuration schema for Store Locator app using
 * Adobe Commerce App Management. Merchants configure these values via
 * Commerce Admin (Apps > App Management).
 * 
 * Security: All sensitive credentials are stored securely in App Builder
 * and retrieved server-side via getConfigurationByKey() - never exposed
 * in public storefront code.
 * 
 * @see https://developer.adobe.com/commerce/extensibility/app-management/
 */
const { defineConfig } = require("@adobe/aio-commerce-lib-app/config");

module.exports = defineConfig({
  metadata: {
    id: "store-locator",
    displayName: "Store Locator",
    description: "Provides store locator functionality with interactive maps and product availability",
    version: "1.0.5"
  },
  businessConfig: {
    schema: [
      {
        name: "restApiBaseUrl",
        type: "url",
        label: "Commerce REST API Base URL",
        description: "The base URL for your Adobe Commerce REST API (e.g., https://commerce.example.com)",
        required: true
      },
      {
        name: "authType",
        type: "list",
        label: "Authentication Type",
        description: "Select your Commerce authentication method",
        selectionMode: "single",
        options: [
          { label: "PaaS/On-Premise (OAuth 1.0a)", value: "oauth" },
          { label: "SaaS (IMS)", value: "ims" }
        ],
        default: "oauth"
      },
      {
        name: "consumerKey",
        type: "password",
        label: "Consumer Key",
        description: "Commerce integration consumer key (for OAuth 1.0a - PaaS/On-Premise)",
        requiredIf: { field: "authType", value: "oauth" }
      },
      {
        name: "consumerSecret",
        type: "password",
        label: "Consumer Secret",
        description: "Commerce integration consumer secret (for OAuth 1.0a - PaaS/On-Premise)",
        requiredIf: { field: "authType", value: "oauth" }
      },
      {
        name: "accessToken",
        type: "password",
        label: "Access Token",
        description: "Commerce integration access token",
        requiredIf: { field: "authType", value: "oauth" }
      },
      {
        name: "accessTokenSecret",
        type: "password",
        label: "Access Token Secret",
        description: "Commerce integration access token secret",
        requiredIf: { field: "authType", value: "oauth" }
      },
      {
        name: "imsClientId",
        type: "password",
        label: "IMS Client ID",
        description: "Adobe IMS client ID (for SaaS authentication)",
        requiredIf: { field: "authType", value: "ims" }
      },
      {
        name: "imsClientSecret",
        type: "password",
        label: "IMS Client Secret",
        description: "Adobe IMS client secret (for SaaS authentication)",
        requiredIf: { field: "authType", value: "ims" }
      }
    ]
  }
});

/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Registers the Store Locator extension menu items and page.
 * @returns {{statusCode: number, body: object}} The registration response object.
 */
function main() {
  const extensionId = "StoreLocator";

  return {
    statusCode: 200,
    body: {
      registration: {
        menuItems: [
          {
            id: `${extensionId}::first`,
            title: "Store Locator",
            parent: `${extensionId}::apps`,
            sortOrder: 1,
          },
          {
            id: `${extensionId}::apps`,
            title: "Store Locator",
            isSection: false,
            sortOrder: 100,
          },
        ],
        page: {
          title: "Store Locator",
        },
      },
    },
  };
}

exports.main = main;

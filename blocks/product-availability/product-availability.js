import { events } from "@dropins/tools/event-bus.js";

/**
 * Commerce context — endpoint + headers for the catalog-service GraphQL call.
 *
 * Self-contained: no dep on a consuming storefront's scripts/configs.js.
 * Three sources, first match wins:
 *
 *   1. Injected via setCommerceContext({ endpoint, headers }) at storefront
 *      boot. Most flexible for consumers with centralized config.
 *   2. Block-config markdown rows (EDS-idiomatic). Editor sets endpoint +
 *      store code + store view code etc. on the block:
 *        | product-availability |                                        |
 *        |----------------------|----------------------------------------|
 *        | endpoint             | https://edge-graph.adobe.io/api/...   |
 *        | store-code           | main_website_store                    |
 *        | store-view-code      | default                               |
 *        | website-code         | base                                  |
 *        | customer-group       | b6589fc6ab0dc82cf12099d1c2d40ab994... |
 *        | api-key              | <optional>                            |
 *   3. /configs.json or /placeholders.json — the block auto-reads commerce
 *      keys from whichever is available (Adobe Boilerplate Commerce ships
 *      configs.json; pure EDS storefronts usually use placeholders.json).
 *
 * All three resolve to the same shape: { endpoint, headers }.
 */

let injectedContext = null;

// Public: consumer storefronts can call this at boot.
export function setCommerceContext(ctx) {
  injectedContext = ctx;
}

/** Read block-config pairs from the decorated block's markdown rows. */
function readContextFromBlock(block) {
  const pairs = {};
  block.querySelectorAll(":scope > div").forEach((row) => {
    const cells = row.querySelectorAll(":scope > div");
    if (cells.length !== 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    const value = cells[1].textContent.trim();
    if (key && value) pairs[key] = value;
  });

  const endpoint = pairs["endpoint"] || pairs["commerce-endpoint"];
  if (!endpoint) return null;

  const headers = { "Content-Type": "application/json" };
  const headerMap = {
    "store-code": "Magento-Store-Code",
    "store-view-code": "Magento-Store-View-Code",
    "website-code": "Magento-Website-Code",
    "customer-group": "Magento-Customer-Group",
    "api-key": "x-api-key",
    "environment-id": "Magento-Environment-Id",
  };
  Object.entries(headerMap).forEach(([cfgKey, headerKey]) => {
    if (pairs[cfgKey]) headers[headerKey] = pairs[cfgKey];
  });

  return { endpoint, headers };
}

/**
 * Last-resort: pull commerce keys out of a storefront's sheet. Tries
 * /configs.json first (Adobe Boilerplate Commerce convention) then falls
 * back to /placeholders.json (EDS default) — different storefronts ship
 * commerce config in different places.
 */
async function readContextFromSheet() {
  for (const path of ["/configs.json", "/placeholders.json"]) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(path);
      if (!res.ok) continue;
      // eslint-disable-next-line no-await-in-loop
      const doc = await res.json();
      const rows =
        doc.data || doc.default?.data || (Array.isArray(doc) ? doc : []);
      const lookup = {};
      rows.forEach((row) => {
        if (row.key) lookup[row.key.toLowerCase()] = row.value;
      });

      const endpoint =
        lookup["commerce-endpoint"] || lookup["commerce-core-endpoint"];
      if (!endpoint) continue;

      const headers = { "Content-Type": "application/json" };
      const prefix = "commerce.headers.cs.";
      Object.entries(lookup).forEach(([k, v]) => {
        if (v && k.startsWith(prefix)) {
          headers[k.slice(prefix.length)] = v;
        }
      });

      return { endpoint, headers };
    } catch {
      /* try next path */
    }
  }
  return null;
}

async function resolveCommerceContext(block) {
  if (injectedContext?.endpoint) return injectedContext;

  const fromBlock = readContextFromBlock(block);
  if (fromBlock) return fromBlock;

  const fromSheet = await readContextFromSheet();
  if (fromSheet) return fromSheet;

  return null;
}

export default async function decorate(block) {
  let myStore = JSON.parse(window.sessionStorage.getItem("myStore"));

  const baseClassName = "availability";
  const productAvailabilityEl = document.createElement("div");
  productAvailabilityEl.className = `${baseClassName}__stock`;

  const storeEl = document.createElement("div");
  storeEl.className = `${baseClassName}__store`;

  const storeAddressEl = document.createElement("div");
  storeAddressEl.className = `${baseClassName}__store-address`;

  // Resolve commerce context BEFORE emptying the block — the block-config
  // markdown lives in the DOM we're about to clear.
  const commerceContext = await resolveCommerceContext(block);

  // Clear the block and populate our structure.
  block.textContent = "";
  const addEmptyBlock = () => {
    productAvailabilityEl.classList.add("hidden");
    storeEl.classList.add("hidden");
    storeAddressEl.classList.add("hidden");
    block.appendChild(productAvailabilityEl);
    block.appendChild(storeEl);
    block.appendChild(storeAddressEl);
  };
  addEmptyBlock();

  const updateBlock = (store, stockData) => {
    if (stockData.inStock) {
      productAvailabilityEl.innerText = stockData.lowStock
        ? "Low Stock"
        : "In Stock";
    } else {
      productAvailabilityEl.innerText = "Out of Stock";
    }
    storeEl.innerText = `Shopping from store #${store.number}.`;
    storeAddressEl.innerText = `${store.address}\n ${store.city}, ${store.state} ${store.zip}`;
  };

  const getProductAvailability = async () => {
    const product = events._lastEvent?.["pdp/data"]?.payload ?? null;
    if (!product?.sku) {
      return null;
    }

    if (!commerceContext) {
      console.warn(
        "[product-availability] No commerce context found. Provide it via setCommerceContext(), block-config markdown, or placeholders.json. See the block README."
      );
      return null;
    }

    const query = `{
      products(skus: ["${product.sku}"]) {
        sku
        name
        inStock
        lowStock
      }
    }`;

    try {
      const response = await fetch(commerceContext.endpoint, {
        method: "POST",
        headers: commerceContext.headers,
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result?.data?.products?.[0] || null;
    } catch (error) {
      console.error(
        "[product-availability] Error fetching availability:",
        error
      );
      return null;
    }
  };

  const showAvailability = async () => {
    const stockData = await getProductAvailability();

    if (myStore && stockData) {
      updateBlock(myStore, stockData);
      productAvailabilityEl.classList.remove("hidden");
      storeEl.classList.remove("hidden");
      storeAddressEl.classList.remove("hidden");
    } else if (myStore) {
      productAvailabilityEl.innerText = "Unavailable";
      productAvailabilityEl.classList.remove("hidden");
    } else {
      productAvailabilityEl.innerText = "No store selected.";
      productAvailabilityEl.classList.remove("hidden");
    }
  };

  await showAvailability();

  document.addEventListener("updateAvailability", async () => {
    myStore = JSON.parse(window.sessionStorage.getItem("myStore"));
    if (!myStore) return;
    await showAvailability();
  });
}

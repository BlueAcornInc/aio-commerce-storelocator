import { events } from "@dropins/tools/event-bus.js";
import { getConfigValue, getHeaders } from "../../scripts/configs.js";

export default async function decorate(block) {
  let myStore = JSON.parse(window.sessionStorage.getItem("myStore"));

  const baseClassName = "availability";
  const productAvailabilityEl = document.createElement("div");
  productAvailabilityEl.className = `${baseClassName}__stock`;

  const storeEl = document.createElement("div");
  storeEl.className = `${baseClassName}__store`;

  const storeAddressEl = document.createElement("div");
  storeAddressEl.className = `${baseClassName}__store-address`;

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

    const endpoint = await getConfigValue("commerce-endpoint");
    if (!endpoint) {
      console.error(
        "[product-availability] Commerce endpoint not configured in configs.json"
      );
      return null;
    }

    const headers = {
      "Content-Type": "application/json",
      ...(await getHeaders("cs")),
    };

    const query = `{
      products(skus: ["${product.sku}"]) {
        sku
        name
        inStock
        lowStock
      }
    }`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const productData = result?.data?.products?.[0];
      return productData || null;
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

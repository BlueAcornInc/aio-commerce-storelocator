import { events } from "@dropins/tools/event-bus.js";
import { getConfigValue } from "../../scripts/configs.js";

export default async function decorate(block) {
  let warehousesAvailability;
  let myWarehouseId;
  let myWarehouse;
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

  const updateBlock = (store, warehouse) => {
    productAvailabilityEl.innerText = `Stock: ${warehouse.quantity}`;
    storeEl.innerText = `Shopping from store #${store.number}.`;
    storeAddressEl.innerText = `${store.address}\n ${store.city}, ${store.state} ${store.zip}`;
  };

  const getWarehousesAvailability = async () => {
    const product = events._lastEvent?.["pdp/data"]?.payload ?? null;
    if (!product?.sku) {
      return { items: [] };
    }

    const configUrl = await getConfigValue("inventory-proxy-url");
    const actionUrl =
      configUrl ||
      window.__EXC_CONFIG__?.actions?.["inventory-proxy"] ||
      window._myStoreConfig?.inventoryProxyUrl;
    if (!actionUrl) {
      console.error(
        "[product-availability] Inventory proxy URL not configured. " +
          'Add "inventory-proxy-url" to your storefront configs sheet.'
      );
      return { items: [] };
    }

    const imsToken =
      window.__EXC_CONFIG__?.ims?.token || window._myStoreConfig?.imsToken;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(imsToken && { Authorization: `Bearer ${imsToken}` }),
      },
      body: JSON.stringify({
        sku: product.sku,
        sourceCode: myStore?.commerce_warehouse_id,
      }),
    };

    const data = fetch(actionUrl, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        return responseData;
      })
      .catch((error) => {
        console.error(
          "[product-availability] Error fetching inventory:",
          error
        );
        return { items: [] };
      });
    return data;
  };
  if (myStore) {
    myWarehouseId = myStore.commerce_warehouse_id;
  } else {
    productAvailabilityEl.innerText =
      "In-store stock: unknown. No store selected.";
    productAvailabilityEl.classList.remove("hidden");
  }

  const setWarehouse = (warehouses) => {
    if (warehouses?.items) {
      Object.values(warehouses?.items).forEach((warehouse) => {
        const { source_code } = warehouse;
        if (source_code === myWarehouseId) {
          myWarehouse = warehouse;
        }
      });
    }
    if (myStore && myWarehouse) {
      updateBlock(myStore, myWarehouse);
      productAvailabilityEl.classList.remove("hidden");
      storeEl.classList.remove("hidden");
      storeAddressEl.classList.remove("hidden");
    } else if (myStore) {
      productAvailabilityEl.innerText =
        "In-store stock: unavailable for this store.";
      productAvailabilityEl.classList.remove("hidden");
    }
  };
  warehousesAvailability = await getWarehousesAvailability();
  if (myWarehouseId) {
    setWarehouse(warehousesAvailability);
  }

  document.addEventListener("updateAvailability", () => {
    myStore = JSON.parse(window.sessionStorage.getItem("myStore"));
    if (!myStore) return;
    myWarehouseId = myStore.commerce_warehouse_id;
    setWarehouse(warehousesAvailability);
  });
}

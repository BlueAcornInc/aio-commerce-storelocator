import { events } from "@dropins/tools/event-bus.js";
import { getConfigFromSession } from "../../scripts/commerce.js";

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

  if (myStore) {
    myWarehouseId = myStore.commerce_warehouse_id;
  } else {
    // no store selected
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
      updateBlock(myStore, myWarehouse);
    }
  };
  warehousesAvailability = await fetch(`https://localhost:9080/api/v1/web/admin-ui-sdk/warehouse-availability`);
  if (myWarehouseId) {
    setWarehouse(warehousesAvailability);y
  }

  document.addEventListener("updateAvailability", () => {
    myStore = JSON.parse(window.sessionStorage.getItem("myStore"));
    myWarehouseId = myStore.commerce_warehouse_id;
    setWarehouse(warehousesAvailability);
    storeEl.classList.remove("hidden");
    storeAddressEl.classList.remove("hidden");
    productAvailabilityEl.classList.remove("hidden");
  });
}

import { events } from '@dropins/tools/event-bus.js';

export default async function decorate(block) {
  let warehousesAvailability;
  let myWarehouseId;
  let myWarehouse;
  let myStore = JSON.parse(window.sessionStorage.getItem('myStore'));

  const baseClassName = 'availability'
  const productAvailabilityEl = document.createElement('div');
  productAvailabilityEl.className = `${baseClassName}__stock`;

  const storeEl = document.createElement('div');
  storeEl.className = `${baseClassName}__store`;

  const storeAddressEl = document.createElement('div');
  storeAddressEl.className = `${baseClassName}__store-address`;

  const addEmptyBlock = () => {
    productAvailabilityEl.classList.add('hidden');
    storeEl.classList.add('hidden');
    storeAddressEl.classList.add('hidden');
    block.appendChild(productAvailabilityEl);
    block.appendChild(storeEl);
    block.appendChild(storeAddressEl);
  }
  addEmptyBlock();

  const updateBlock = (store, warehouse) => {
    productAvailabilityEl.innerText = `Stock: ${warehouse.quantity}`;
    storeEl.innerText = `Shopping from store #${store.number}.`;
    storeAddressEl.innerText = `${store.address}\n ${store.city}, ${store.state} ${store.zip}`;
  }

  const getWarehousesAvailability = async () => {
    const config = {
      // To Do, To-Do. Change baseUrl to production instead of stage
      baseUrl: 'https://stage-sandbox.m2cloud.blueacorn.net/rest/default/V1/inventory/source-items',
      product: events._lastEvent?.['pdp/data']?.payload ?? null,
    }
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // To Do, To-Do. Remove this bearer token
        'Authorization': 'Bearer ci5ewjokz5e39xbskprillktpc1uj7eb',
      },
    };

    const data = fetch(`${config.baseUrl}?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=${config.product.sku}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(responseData => {
        return responseData;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    return data;
  }
  if (myStore) {
    myWarehouseId = myStore.commerce_warehouse_id;
  } else {
    // no store selected
    productAvailabilityEl.innerText = 'In-store stock: unknown. No store selected.';
    productAvailabilityEl.classList.remove('hidden');
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

  }
  warehousesAvailability = await getWarehousesAvailability();
  if (myWarehouseId) {
    setWarehouse(warehousesAvailability);
  };

  document.addEventListener('updateAvailability', () => {
    myStore = JSON.parse(window.sessionStorage.getItem('myStore'));
    myWarehouseId = myStore.commerce_warehouse_id;
    setWarehouse(warehousesAvailability);
    storeEl.classList.remove('hidden');
    storeAddressEl.classList.remove('hidden');
    productAvailabilityEl.classList.remove('hidden');
  });
}

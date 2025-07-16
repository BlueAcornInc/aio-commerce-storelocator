import { loadCSS, loadScript } from '../../scripts/aem.js';

export default async function decorate(block) {
  loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
  const myStoreSession = JSON.parse(window.sessionStorage.getItem('myStore'));
  const getRatingPercentage = (n) => {
    if (typeof n !== 'number' || isNaN(n)) {
      throw new Error('Input must be a valid number');
    }
    return (n / 5) * 100;
  }

  const createMyStore = () => {
    const baseClassName = 'my-store';
    const myStoreEl = document.createElement('div');
    myStoreEl.className = `${baseClassName}`;
    const shoppingFromEl = document.createElement('div');
    shoppingFromEl.className = `${baseClassName}__shopping-from`;
    shoppingFromEl.textContent = 'Shopping from: ';
    const selectedStoreEl = document.createElement('div');
    selectedStoreEl.className = `${baseClassName}__selected-store`;
    selectedStoreEl.innerText = !!myStoreSession ? ` Store: ${myStoreSession.number}. ` : 'No store selected.'
    myStoreEl.appendChild(shoppingFromEl);
    myStoreEl.appendChild(selectedStoreEl);
    return myStoreEl;
  }

  const myStore = createMyStore();
  const selectedStoreEl = myStore.querySelector('.my-store__selected-store');
  block.appendChild(myStore);

  const createStoreCardContainer = () => {
    const container = document.createElement('div');
    container.className = 'store-cards-container';
    return container;
  };
  const createStoreCardZipFilter = () => {
    // form
    const form = document.createElement('form');
    form.classList.add('zip-form');

    // label
    const label = document.createElement('label');
    label.setAttribute('for', 'zip-code');
    label.classList.add('zip-form__label');
    label.textContent = 'Filter by ZIP';

    // input
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'zip-code');
    input.setAttribute('name', 'zip-code');
    input.setAttribute('placeholder', 'Filter by ZIP');
    input.setAttribute('maxlength', '5');
    input.classList.add('zip-form__input');

    // submit
    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.classList.add('zip-form__button');
    button.textContent = 'Search';

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);
    return form;
  };

  function emitCustomEvent(eventName, params) {
    const event = new CustomEvent(eventName, { detail: params });
    document.dispatchEvent(event);
  }
  const cards = [];
  const markers = [];

  const createStoreCard = (store, storeCardDisplayOrder, i) => {
    // Create the phone SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');

    // Create the path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M5.58685 5.90217C6.05085 6.86859 6.68337 7.77435 7.48443 8.5754C8.28548 9.37645 9.19124 10.009 10.1577 10.473C10.2408 10.5129 10.2823 10.5328 10.3349 10.5482C10.5218 10.6027 10.7513 10.5635 10.9096 10.4502C10.9542 10.4183 10.9923 10.3802 11.0685 10.304C11.3016 10.0709 11.4181 9.95437 11.5353 9.87818C11.9772 9.59085 12.5469 9.59085 12.9889 9.87818C13.106 9.95437 13.2226 10.0709 13.4556 10.304L13.5856 10.4339C13.9398 10.7882 14.117 10.9653 14.2132 11.1556C14.4046 11.534 14.4046 11.9808 14.2132 12.3592C14.117 12.5494 13.9399 12.7266 13.5856 13.0809L13.4805 13.186C13.1274 13.539 12.9508 13.7156 12.7108 13.8504C12.4445 14 12.0308 14.1076 11.7253 14.1067C11.45 14.1059 11.2619 14.0525 10.8856 13.9457C8.86333 13.3717 6.95509 12.2887 5.36311 10.6967C3.77112 9.10473 2.68814 7.19649 2.11416 5.17423C2.00735 4.79793 1.95395 4.60978 1.95313 4.33448C1.95222 4.029 2.0598 3.61534 2.20941 3.34901C2.34424 3.10898 2.52078 2.93244 2.87386 2.57936L2.97895 2.47427C3.33325 2.11998 3.5104 1.94283 3.70065 1.8466C4.07903 1.65522 4.52587 1.65522 4.90424 1.8466C5.0945 1.94283 5.27164 2.11998 5.62594 2.47427L5.75585 2.60418C5.98892 2.83726 6.10546 2.95379 6.18165 3.07098C6.46898 3.5129 6.46898 4.08262 6.18165 4.52455C6.10546 4.64174 5.98892 4.75827 5.75585 4.99134C5.67964 5.06755 5.64154 5.10565 5.60965 5.15019C5.4963 5.30848 5.45717 5.53799 5.51165 5.72489C5.52698 5.77748 5.54694 5.81905 5.58685 5.90217Z');
    path.setAttribute('stroke', '#131313');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    // Append the path to the SVG
    svg.appendChild(path);

    const baseClassName = 'store-card';
    // create store card
    const card = document.createElement('div');
    card.className = baseClassName;
    card.setAttribute('data-store-num', i + 1);
    card.setAttribute('data-zip', store.zip);
    cards.push(card);

    card.addEventListener('click', () => {
      emitCustomEvent('storeNum', { num: Number(card.dataset.storeNum) });
      emitCustomEvent('updateAvailability');
    });

    // create store card header
    const header = document.createElement('div');
    header.className = `${baseClassName}__header`;
    // create store card body
    const body = document.createElement('div');
    body.className = `${baseClassName}__body`;

    storeCardDisplayOrder.forEach((configObj) => {
      const { row, itemOrder } = configObj;
      if (row === 1) {
        // create store name
        itemOrder.forEach((item) => {
          const elContainer = document.createElement('div');
          elContainer.className = `row-${row}`;
          let el;
          if (item === 'name') {
            const storeNumber = document.createElement('div');
            storeNumber.className = `${baseClassName}__number`;
            storeNumber.textContent = `${i + 1}`;
            elContainer.appendChild(storeNumber);
            el = document.createElement('h4');
          } else {
            el = document.createElement('div');
          }
          el.className = `${baseClassName}__${item}`;
          el.textContent = store[item];
          elContainer.appendChild(el);
          header.appendChild(elContainer);
        });
      } else {
        const elContainer = document.createElement('div');
        elContainer.className = `row-${row}`;
        itemOrder.forEach((item) => {
          let el;
          if (item === 'phone') {
            elContainer.appendChild(svg);
            el = document.createElement('a');
            el.href = `tel:${item}`;
          } else {
            el = document.createElement('div');
          }
          if (item === 'rating') {
            const rating = Number(store.rating);
            const percentRating = getRatingPercentage(rating).toPrecision(3);
            const starRatingEl = document.createElement('div');
            starRatingEl.className = `${baseClassName}__star-rating`;

            const starsEl = document.createElement('object');
            starsEl.data = '/images/stars/stars-medium.svg';
            starsEl.type = 'image/svg+xml';
            starsEl.className = `${baseClassName}__stars`;

            const sliderEl = document.createElement('div');
            sliderEl.className = `${baseClassName}__slider`;
            sliderEl.style.width = `${percentRating}px`;
            starRatingEl.appendChild(starsEl);
            starRatingEl.appendChild(sliderEl);
            elContainer.appendChild(starRatingEl);
          }
          el.className = `${baseClassName}__${item}`;
          el.textContent = store[item];
          elContainer.appendChild(el);
        });
        body.appendChild(elContainer);
      }
    });
    card.appendChild(header);
    card.appendChild(body);
    return card;
  };

  const response = await fetch('/store-locator/stores.json');
  const stores = await response.json();
  const parentBlock = document.querySelector('.store-locator-container');

  const storeCardDisplayOrder = [];
  if (parentBlock) {
    Object.entries(parentBlock.dataset).forEach(([key, value]) => {
      if (key.indexOf('storeCardRow') === 0) {
        const conf = {};
        conf.row = Number(key.charAt(key.length - 1));
        conf.itemOrder = value.split(', ');
        storeCardDisplayOrder.push(conf);
      }
    });
  }

  // Create and append the map container
  const mapContainer = document.createElement('div');
  mapContainer.id = 'map';
  mapContainer.style.width = '100%';
  mapContainer.style.height = '500px';
  block.appendChild(mapContainer);

  setTimeout(() => {
    const { L } = window;
    const map = L.map('map');

    map.setView([stores.data[0].lat, stores.data[0].lng], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    L.control.zoom({
      position: 'topright',
    }).addTo(map);

    // create store card container
    const container = createStoreCardContainer();
    // create ZIP filter
    const filter = createStoreCardZipFilter();

    block.appendChild(filter);
    block.appendChild(container);
    stores.data.forEach((store, i) => {
      // create store card
      const storeCard = createStoreCard(store, storeCardDisplayOrder, i);
      container.appendChild(storeCard);
      // Add marker to the map if store has lat and lng
      if (store.lat && store.lng) {
        const customIcon = L.divIcon({ className: 'blue-acorn__icon', iconSize: 40 });
        const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(map);
        markers.push(marker);
        marker.bindPopup(`<div class='leaflet-popup-content__container'  data-store-map-num=${i + 1}><p>${i + 1}</p></div>`);
        marker.addEventListener('click', () => {
          emitCustomEvent('storeNum', { num: i + 1 });
          emitCustomEvent('updateAvailability');
        });
      }
    });

    document.addEventListener('storeNum', (e) => {
      const currentCard = cards[e.detail.num - 1];
      const currentMarker = markers[e.detail.num - 1];
      const currentStore = stores.data[e.detail.num - 1];
      currentStore.number = e.detail.num;
      window?.sessionStorage.setItem('myStore', JSON.stringify(currentStore));
      cards.forEach((card) => {
        card.classList.remove('selected');
      });

      currentCard.classList.add('selected');
      selectedStoreEl.innerText = ` Store: ${e.detail.num}.`

      const cardRect = currentCard.getBoundingClientRect();
      if (window.innerWidth > 990) {
        container.scrollBy({ left: 0, top: cardRect.top - container.getBoundingClientRect().top - 64, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: cardRect.left - ((innerWidth / 2) - (cardRect.width / 2)), top: 0, behavior: 'smooth' });
      }
      currentMarker.openPopup();
      map.panTo(currentMarker.getLatLng());
    });

    document.querySelector('.zip-form__button').addEventListener('click', (e) => {
      const { previousElementSibling: { value } } = e.target;
      e.preventDefault();

      cards.forEach((card, i) => {
        if (!card.dataset.zip.startsWith(value)) {
          card.classList.add('hidden');
          markers[i]._icon.style.opacity = '50%';
          markers[i]._icon.style.pointerEvents = 'none';
        } else {
          card.classList.remove('hidden');
          markers[i]._icon.style.opacity = '100%';
          markers[i]._icon.style.opacity = 'inherit';
        }
      });
    });
    if (myStoreSession) {
      container?.children[myStoreSession?.number - 1]?.click();
    }
  }, 200);


}

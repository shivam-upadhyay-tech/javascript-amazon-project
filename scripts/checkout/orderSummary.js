import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
// syntax using curly brackets called named export

import {products, getProduct} from '../../data/products.js';
import formatCurrency from '../utils/money.js'; // one dot means look into the current folder.

import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
// Default export for only one thing to import

import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

cartQuantity();

export function renderOrderSummary () {

let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  const matchingProduct = getProduct(productId);

  const deliveryOptionId = cartItem.deliveryOptionId;

  const deliveryOption = getDeliveryOption(deliveryOptionId);

  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOption.deliveryDays,
    'days'
  );
  const dateString = deliveryDate.format(
    'dddd, MMMM D'
  );

  cartSummaryHTML += `
  <div class="cart-item-container 
  js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            $${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    const priceString = deliveryOption.priceCents
    === 0
    ? 'FREE'
    : `$${formatCurrency(deliveryOption.priceCents)} -`;

    // Below code for radio selector because we need a checked radio selector ny default
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    html += `
    <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
      <input type="radio"
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString} Shipping
        </div>
      </div>
    </div>
    `
  });

  return html;
}


document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      // .dataset to access the data attribute
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      // .remove() method will delete it from the page.
      container.remove();

      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        /*
        const productId = element.dataset.productId;
        const deliveryOptionId = element.deliveryOptionId;
        */

        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);

        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}

export function cartQuantity () {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-return-to-home-link').innerHTML = cartQuantity + ' items';
}

renderOrderSummary();


/* A function can call itself and this is called recursion */
/*
   1. Update the data
   2. Regenerate all the HTML
   = MVC (a design pattern)
*/
/* M stands for model = Saves and manages the data */
/* V stands for view = Takes the data and display it on the page */
/* C stands for controller = Runs some code when we interact with the page */
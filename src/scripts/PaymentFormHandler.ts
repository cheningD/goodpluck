import { initSwell } from "../lib/swell-js";

document.addEventListener("DOMContentLoaded", () => {
  const swell = initSwell(
    import.meta.env.PUBLIC_SWELL_STORE_ID,
    import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
  );

  // Recover the shopping cart using checkout ID
  const checkoutIdElement = document.querySelector("[data-checkout-id]");
  if (checkoutIdElement) {
    const checkoutId = checkoutIdElement.getAttribute("data-checkout-id");
    if (checkoutId) {
      swell.cart.recover(checkoutId);
    }
  }

  // Initialize Stripe card element
  swell.payment.createElements({
    card: {
      elementId: "card-element",
      options: {
        style: { base: { fontSize: "16px" } },
        hidePostalCode: true,
      },
    },
  });

  // Toggle billing address visibility
  const toggleBillingVisibility = (isVisible: boolean): void => {
    const billingContainer = document.getElementById("billing-container");
    if (billingContainer) {
      billingContainer.style.display = isVisible ? "none" : "block";
      billingContainer
        .querySelectorAll('input[type="text"]')
        .forEach((input) => {
          if (input instanceof HTMLInputElement) {
            input.required = !isVisible;
          }
        });
    }
  };
  const checkbox = document.getElementById("same-address-checkbox");
  if (checkbox instanceof HTMLInputElement) {
    checkbox.addEventListener("change", () => {
      toggleBillingVisibility(checkbox.checked);
    });
  }

  // Submit payment form
  const form = document.querySelector("#payment-info-form");
  if (form instanceof HTMLFormElement) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      swell.payment.tokenize({
        card: {
          onError: (err: Error) => {
            const errorMessage = document.querySelector("#error-msg");
            if (errorMessage) {
              errorMessage.textContent = err.message;
            }
          },
          onSuccess: () => {
            const tokenInput = document.createElement("input");
            tokenInput.type = "hidden";
            tokenInput.name = "token";
            // Ensure the token is retrieved safely
            const cart = swell.cart.get();
            if (cart?.billing?.card?.token) {
              tokenInput.value = cart.billing.card.token;
              form.appendChild(tokenInput);
              form.submit();
            }
          },
        },
      });
    });
  }
});

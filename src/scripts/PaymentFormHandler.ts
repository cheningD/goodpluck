import { initSwell } from "@src/lib/swell-js";

const swell = initSwell(
  import.meta.env.PUBLIC_SWELL_STORE_ID,
  import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
);

document.addEventListener("DOMContentLoaded", () => {
  createStripeCardElement();
  initializeBillingAddressToggle();
  handleSubmitPaymentForm();
});

const createStripeCardElement = (): void => {
  const checkoutIdElement: Element | null =
    document.querySelector("[data-checkout-id]");
  if (checkoutIdElement) {
    const checkoutId: string | null =
      checkoutIdElement.getAttribute("data-checkout-id");
    if (checkoutId) {
      void (async () => {
        await swell.cart.recover(checkoutId);
        swell.payment.createElements({
          card: {
            elementId: "card-element",
            options: {
              style: { base: { fontSize: "16px" } },
              hidePostalCode: true,
            },
            onReady: () => {
              const submitButton = document.querySelector(
                "#submit-btn",
              ) as HTMLButtonElement;
              if (submitButton) {
                submitButton.disabled = false;
              }
            },
          },
        });
      })();
    }
  }
};

const initializeBillingAddressToggle = (): void => {
  const checkbox: HTMLElement | null = document.getElementById(
    "same-address-checkbox",
  );
  if (checkbox instanceof HTMLInputElement) {
    checkbox.addEventListener("change", () => {
      const billingContainer: HTMLElement | null =
        document.getElementById("billing-container");
      if (billingContainer) {
        billingContainer.style.display = checkbox.checked ? "none" : "block";
      }
    });
  }
};

const appendTokenAndSubmitForm = async (
  form: HTMLFormElement,
): Promise<void> => {
  try {
    const token: string = (await swell.cart.get()).billing.card.token;
    const tokenInput: HTMLInputElement = document.createElement("input");
    tokenInput.type = "hidden";
    tokenInput.name = "token";
    tokenInput.value = token;
    form.appendChild(tokenInput);
    form.submit();
  } catch (err) {
    if (err instanceof Error) {
      handleError(err);
    } else {
      console.error("An unexpected error occurred during token submission.");
    }
  }
};

const handleSubmitPaymentForm = (): void => {
  const form: Element | null = document.querySelector("#payment-info-form");
  if (form instanceof HTMLFormElement) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      toggleSubmitButton(true);

      // Validate form fields
      const sameAddressCheckbox = document.getElementById(
        "same-address-checkbox",
      ) as HTMLInputElement;

      if (
        sameAddressCheckbox &&
        !sameAddressCheckbox.checked &&
        ["first-name", "last-name", "address", "city", "state", "zip"].some(
          isEmptyInputValue,
        )
      ) {
        handleError(new Error("Please fill out all required fields."));
        return;
      }

      // Tokenize payment
      void (async () => {
        try {
          await swell.payment.tokenize({
            card: {
              onError: (err: Error) => {
                handleError(err);
              },
              onSuccess: async () => {
                await appendTokenAndSubmitForm(form);
              },
            },
          });
        } catch (err) {
          if (err instanceof Error) {
            handleError(err);
          } else {
            console.error(
              "An unexpected error occurred during payment tokenization.",
            );
          }
        }
      })();
    });
  }
};

// Helper functions:
const isEmptyInputValue = (id: string): boolean => {
  const input = document.getElementById(id) as HTMLInputElement;
  return !input?.value;
};
const handleError = (err: Error): void => {
  const errorMessage: Element | null = document.querySelector("#error-msg");
  if (errorMessage) {
    errorMessage.textContent = err.message;
    errorMessage.removeAttribute("hidden");
  }
  toggleSubmitButton(false);
};
const toggleSubmitButton = (isLoading: boolean): void => {
  const submitButton = document.querySelector(
    "#submit-btn",
  ) as HTMLButtonElement;
  const spinner = document.getElementById("spinner");
  const submitButtonText = document.getElementById("submit-btn-text");

  if (submitButton) submitButton.disabled = isLoading;
  if (spinner) spinner.classList.toggle("hidden", !isLoading);
  if (submitButtonText) submitButtonText.classList.toggle("hidden", isLoading);
};

import { initSwell } from "../lib/swell-js";

const form = document.querySelector("#payment_form") as HTMLFormElement;

form.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  void (async () => {
    try {
      const swell = initSwell(
        import.meta.env.PUBLIC_SWELL_STORE_ID,
        import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
      );

      const formData = new FormData(form);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { number, exp_month, exp_year, cvc } = Object.fromEntries(
        formData.entries(),
      );

      const response = await swell.card.createToken({
        number,
        exp_month,
        exp_year,
        cvc,
      });

      const tokenInput = form.querySelector(
        "input[name=token]",
      ) as HTMLInputElement;
      if (tokenInput) {
        tokenInput.value = response.token;
      }

      form.submit();
    } catch (error) {
      const errorDiv = document.querySelector(".error-msg");
      if (errorDiv) {
        errorDiv.textContent = error as string;
      }
    }
  })();
});

const toggleBillingAddress = (checkbox: HTMLInputElement): void => {
  const billingAddressFields = document.getElementById(
    "billing_address_fields",
  );
  if (billingAddressFields) {
    const displayStyle = checkbox.checked ? "none" : "block";
    billingAddressFields.style.display = displayStyle;

    const inputs = billingAddressFields.querySelectorAll("input");
    inputs.forEach((input) => {
      input.required = displayStyle === "block";
    });
  }
};

const checkbox = document.getElementById(
  "same_as_shipping",
) as HTMLInputElement;
checkbox?.addEventListener("click", () => {
  toggleBillingAddress(checkbox);
});

toggleBillingAddress(checkbox);

import { getAccount, updateAccount, type AccountMetadata } from "../lib/swell";

const handleFormSubmit = async (event: Event): Promise<void> => {
  event.preventDefault();

  const account = await getAccount();

  // Checks if the user has already completed onboarding
  const metadata = account?.metadata as AccountMetadata | undefined;
  if (metadata?.onboarded) {
    window.location.href =
      "/?message=" +
      encodeURIComponent("You have already completed your onboarding");
    return;
  }

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const data = {
    email: account?.email as string,
    firstName: formData.get("first_name") as string,
    lastName: formData.get("last_name") as string,
    phone: formData.get("phone_number") as string,
    consent: formData.get("consent") as string,
    address1: formData.get("address address-search") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postcode: formData.get("postcode") as string,
    apartment: (formData.get("apartment") as string) || undefined,
  };

  const requiredFields = [
    data.email,
    data.firstName,
    data.lastName,
    data.phone,
    data.consent,
    data.address1,
    data.city,
    data.state,
    data.postcode,
  ];
  if (requiredFields.some((value) => !value)) {
    displayErrorMessage("Please fill all the required fields");
    return;
  }

  try {
    await updateAccount({
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      email_optin: data.consent === "on",
      shipping: {
        address1: data.address1,
        address2: data.apartment,
        city: data.city,
        state: data.state,
        zip: data.postcode,
      },
      type: "individual",
      metadata: { onboarded: true },
    });

    window.location.href =
      "/?message=" + encodeURIComponent("Onboarding completed");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    displayErrorMessage(errorMessage);
  }
};

const displayErrorMessage = (message: string): void => {
  const errorMessageElement = document.getElementById("error-message");
  if (errorMessageElement) errorMessageElement.textContent = message;
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (event) => {
      void handleFormSubmit(event);
    });
  }
});

import {
  login,
  createAccount,
  setSessionCookie,
  type AccountMetadata,
} from "../lib/swell";
import { confirmed_zipcodes } from "../lib/constants";
import { type Account } from "swell-js";

const handleFormSubmit = async (event: Event): Promise<void> => {
  event.preventDefault();

  const form = document.getElementById("signupForm") as HTMLFormElement | null;
  const errorElement = document.getElementById("error");
  if (!form || !errorElement) return;

  errorElement.textContent = "";

  const formData = new FormData(form);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const zipcode = formData.get("zipcode") as string;

  if (!email) {
    displayError("Invalid email address.", errorElement);
    return;
  }
  if (!password) {
    displayError("Password is required.", errorElement);
    return;
  }
  if (!zipcode || !confirmed_zipcodes.includes(zipcode)) {
    window.location.href =
      "/waitlist?zipcode=" + zipcode + "&email=" + encodeURIComponent(email);
    return;
  }

  try {
    const account = await login(email, password);
    if (account) {
      handleSuccessfulLogin(account);
    } else {
      await createAccount(email, password);
      const newAccount = await login(email, password);
      if (newAccount) handleSuccessfulLogin(newAccount);
    }
  } catch (error) {
    displayError("An error occurred. Please try again later.", errorElement);
  }
};

const handleSuccessfulLogin = (account: Account): void => {
  setSessionCookie();

  // If the user has not completed onboarding, redirect to the onboarding page.
  const metadata = account?.metadata as AccountMetadata | undefined;
  if (!metadata?.onboarded) {
    window.location.href = "/onboarding";
  } else {
    window.location.href =
      "/?message=" + encodeURIComponent("You are now logged in.");
  }
};

const displayError = (message: string, errorElement: HTMLElement): void => {
  errorElement.textContent = message;
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm") as HTMLFormElement | null;
  if (form) {
    form.addEventListener("submit", (event) => {
      void handleFormSubmit(event);
    });
  }
});

import { getSwellClient } from "../lib/swell";
import { confirmed_zipcodes } from "../lib/constants";
import { type Account } from "swell-js";

const swell = getSwellClient(
  import.meta.env.PUBLIC_SWELL_STORE_ID,
  import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
);

interface Metadata {
  onboarded?: boolean;
  [key: string]: any;
}

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
      console.log("account", account);
      handleSuccessfulLogin(account);
    } else {
      console.log("creating account");
      await createAccount(email, password);
      const newAccount = await login(email, password);
      if (newAccount) handleSuccessfulLogin(newAccount);
    }
  } catch (error) {
    displayError("An error occurred. Please try again later.", errorElement);
  }
};

const login = async (
  email: string,
  password: string,
): Promise<Account | null> => {
  try {
    await swell.account.login(email, password);
    const account = await swell.account.get();
    return account;
  } catch {
    return null;
  }
};

const createAccount = async (
  email: string,
  password: string,
): Promise<void> => {
  try {
    await swell.account.create({ email, password, type: "individual" });
  } catch (error) {
    throw new Error("An error occurred while creating an account.");
  }
};

const handleSuccessfulLogin = (account: Account): void => {
  setSessionCookie();

  // If the user has not completed onboarding, redirect to the onboarding page.
  const metadata = account?.metadata as Metadata | undefined;
  if (!metadata?.onboarded) {
    window.location.href = "/create-account";
  } else {
    window.location.href =
      "/?message=" + encodeURIComponent("You are now logged in.");
  }
};

const setSessionCookie = (): void => {
  const sessionCookie = swell.session.getCookie();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `gp_session_token=${sessionCookie};expires=${expires.toUTCString()};path=/;Secure;SameSite=Lax`;
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

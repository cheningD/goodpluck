import { getSwellClient } from "../lib/swell";
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

  const form = document.getElementById("loginForm") as HTMLFormElement | null;
  const errorElement = document.getElementById("error");
  if (!form || !errorElement) return;

  errorElement.textContent = "";

  const formData = new FormData(form);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    displayError("Please enter your email and password.", errorElement);
    return;
  }

  try {
    const account = await login(email, password);
    if (account) {
      handleSuccessfulLogin(account);
    } else {
      displayError("Invalid email or password.", errorElement);
    }
  } catch (error) {
    displayError(
      "A network error or unexpected issue occurred, please try again later.",
      errorElement,
    );
  }
};

const login = async (
  email: string,
  password: string,
): Promise<Account | null> => {
  try {
    await swell.account.login(email, password);
    console.log("Logged in", await swell.account.get());
    return await swell.account.get();
  } catch {
    return null;
  }
};

const handleSuccessfulLogin = (account: Account): void => {
  setSessionCookie();

  const metadata = account.metadata as Metadata;
  console.log(metadata);
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

const displayError = (
  message: string,
  errorElement: HTMLElement | null,
): void => {
  if (errorElement) {
    errorElement.textContent = message;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm") as HTMLFormElement | null;
  if (form) {
    form.addEventListener("submit", (event) => {
      void handleFormSubmit(event);
    });
  }
});

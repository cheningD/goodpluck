import { login, setSessionCookie, type AccountMetadata } from "../lib/swell";
import { type Account } from "swell-js";

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
    console.log("account", account);
    if (account) {
      handleSuccessfulLogin(account);
    } else {
      console.log("Invalid email or password.", errorElement);
      displayError("Invalid email or password.", errorElement);
    }
  } catch (error) {
    displayError(
      "A network error or unexpected issue occurred, please try again later.",
      errorElement,
    );
  }
};

const handleSuccessfulLogin = (account: Account): void => {
  setSessionCookie();

  const metadata = account.metadata as AccountMetadata;
  if (!metadata?.onboarded) {
    window.location.href = "/onboarding";
  } else {
    window.location.href =
      "/?message=" + encodeURIComponent("You are now logged in.");
  }
};

const displayError = (
  message: string,
  errorElement: HTMLElement | null,
): void => {
  if (errorElement) {
    errorElement.style.display = "block";
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

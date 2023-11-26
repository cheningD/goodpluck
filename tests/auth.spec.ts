import { expect, test } from "@playwright/test";

const isDevelopment = !process.env.CI;

// Testing Login Form
test.describe("Login Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/login`);
  });

  test("should redirect to OTP verification page upon entering a valid email", async ({
    page,
  }) => {
    await page.fill('input[type="email"]', "sandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await expect(
      page.locator('h2:has-text("Check your email!")'),
    ).toBeVisible();
    await expect(page.locator('input[name="otp-input"]')).toBeVisible();
  });

  test("should display an error for unregistered email entries", async ({
    page,
  }) => {
    await page.fill('input[type="email"]', "NOTsandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await expect(
      page.locator("text=Email not found. Do you need to create an account?"),
    ).toBeVisible();
  });

  test("should display a tooltip when an invalid email format is entered", async ({
    page,
  }) => {
    await page.fill('input[type="email"]', "invalid-email");
    await page.click('button[data-testid="login-btn"]');

    // Check if the email input is in an invalid state
    const isInvalid = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      return (
        emailInput instanceof HTMLInputElement &&
        emailInput.validity.valid === false
      );
    });

    expect(isInvalid).toBeTruthy();
  });

  test("should redirect users to the homepage if they are already logged in and attempt to visit the login page", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari won't let you set a cookie on localhost without https in development environment",
    );
    // Step 1: Login with valid credentials
    await page.goto(`/login`);
    await page.fill('input[type="email"]', "sandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await page.fill('input[name="otp-input"]', "000000");
    await page.click('button[type="submit"]');

    // Step 2: Attempt to navigate to the login page again
    await page.goto(`/login`);
    await page.waitForTimeout(2000);

    // Step 3: Check if the user is redirected to the homepage
    const message = "You are already logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });
});

// Testing OTP Login
test.describe("Validate Login Code", () => {
  test.beforeEach(async ({ page }) => {
    // OTP Login with Valid Email
    await page.goto(`/login`);
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
  });

  test("should set goodpluck session cookie, and redirect to `/#basket` given valid code", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    // Check if the user is redirected to the homepage
    const message = "You are now logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}#basket`);

    // This is the default OTP code for the sandbox user
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "gp_session_token",
    );
    expect(sessionCookie).toBeDefined();

    expect(sessionCookie?.value).toBe(
      "WJtR5BCy38Szd5AfoDpf0iqFKEt4EE5JhjlWUY7l3FtY",
    ); // This is the default session token for the sandbox user

    expect(sessionCookie?.secure).toBeTruthy();
    expect(sessionCookie?.httpOnly).toBeTruthy();
    expect(sessionCookie?.sameSite).toBe("Lax");
  });

  test("should throw an error when an invalid code is entered", async ({
    page,
  }) => {
    await page.fill("#otp-input", "900900"); // invalid code
    await page.click('button[id="submit-login-code-btn"]');
    await expect(
      page.locator(
        "text=Oops, wrong passcode. Try again or request a new one.",
      ),
    ).toBeVisible();

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "gp_session_token",
    );
    expect(sessionCookie).toBeUndefined();
  });

  test("should show an error for invalid OTP code format", async ({ page }) => {
    await page.fill("#otp-input", "invalid-code");
    await page.click('button[id="submit-login-code-btn"]');

    // Check if the code input is in an invalid state
    const inputIsFocused = await page.evaluate(() => {
      const otpInput = document.getElementById("otp-input");
      return document.activeElement === otpInput;
    });

    expect(inputIsFocused).toBeTruthy();
  });

  test("should redirect users to the 'login' page when a resend OTP code request is sent", async ({
    page,
  }) => {
    await page.click('a[id="resend-button"]');
    await expect(page).toHaveURL(`/login?resend=true`);
  });

  test("should redirect users to the homepage if they are already logged in and attempt to visit the login-code page", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    // Step 1: Login with valid credentials
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    // Step 2: Attempt to navigate to the login-code page again
    await page.goto(`/login-code`);
    const message = "You are already logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });
});

// Testing Logout
test.describe("Logout", () => {
  test("should successfully log out a user if a session exists", async ({
    page,
  }) => {
    // // Check if the user is redirected to the homepage with a toast message
    // await page.goto(`/logout`);
    // const message = "Successfully logged out"
    // const encodedMessage = encodeURIComponent(message);
    // expect(page.url()).toContain(`/?message=${encodedMessage}`);
    // // Check if the session cookie is deleted
    // const cookies = await page.context().cookies();
    // const sessionCookie = cookies.find(
    //   (cookie) => cookie.name === "gp_session_token",
    // );
    // expect(sessionCookie).toBeUndefined();
  });

  test("should show an error for users who are not logged in and attempt to log out", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.goto(`/logout`);
    await page.waitForTimeout(2000);

    const message = "You are not logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);

    // Check if the session cookie is not present
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "gp_session_token",
    );
    expect(sessionCookie).toBeUndefined();
  });

  test("should show an error when attempting to log out using Stytch's sandbox user", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    // OTP Login with Valid Email
    await page.goto(`/login`);
    await page.waitForTimeout(2000);
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    // Logout
    await page.goto(`/logout`);

    const message = "Error logging out";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });
});

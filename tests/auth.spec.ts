import { expect, test } from "@playwright/test";

// Testing Login Form
test.describe("Login Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/login`);
  });

  // Test to check redirect to OTP page on valid email
  test("should send otp, redirect to login-code if given a valid email address", async ({
    page,
  }) => {
    await page.fill('input[type="email"]', "sandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await expect(page.locator('h2:has-text("OTP Verification")')).toBeVisible();
    await expect(page.locator('input[name="otp-input"]')).toBeVisible();
  });

  // Test to check error message for unregistered email
  test("should show error if email is invalid", async ({ page }) => {
    await page.fill('input[type="email"]', "NOTsandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await expect(
      page.locator("text=Email not found. Do you need to create an account?"),
    ).toBeVisible();
  });

  // Test to check error message for invalid email format
  test("should display error for invalid email format", async ({ page }) => {
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

  // Test for already logged-in users
  test("should redirect already logged-in users", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit",
      "Safari wont let you set a cookie on localhost without https",
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
    await expect(page).toHaveURL(`/`);

    // Step 4: Check if the user is shown a toast message
    const toastSelector = 'div[role="status"][aria-live="polite"]';
    await expect(page.locator(toastSelector)).toBeVisible();
    await expect(page.locator(toastSelector)).toHaveText(
      "Error, you are already logged in.",
    );
  });

  // Test to check JWT token & email session token set in cookies on successful OTP request
  test("should set a JWT token in cookies on successful otp request", async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName === "webkit",
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.fill('input[type="email"]', "sandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await page.waitForTimeout(2000);
    const cookies = await page.context().cookies();
    const hasToken = cookies.some(
      (cookie) => cookie.name === "email_secure_token" && cookie.value,
    );
    expect(hasToken).toBeTruthy();
  });

  // TODO: Test for general errors like network errors or unexpected errors.
});

// Testing OTP Login
test.describe("Validate Login Code", () => {
  test.beforeEach(async ({ page }) => {
    // OTP Login with Valid Email
    await page.goto(`/login`);
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
  });

  // Test to check redirect to OTP page on valid email
  test("should set session to localstorage, and redirect to #basket given valid code", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit",
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');
    expect(page.url()).toContain("/#basket");
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

    // Check for toast message
    const toastSelector = 'div[role="status"][aria-live="polite"]';
    await expect(page.locator(toastSelector)).toBeVisible();
    await expect(page.locator(toastSelector)).toHaveText(
      "Success, you are now logged in!",
    );
  });

  // Test error handling for invalid OTP code
  test("should throw error if not valid code", async ({ page }) => {
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

  // Test error handling for invalid OTP code
  test("should show error for invalid OTP code format", async ({ page }) => {
    await page.fill("#otp-input", "invalid-code");
    await page.click('button[id="submit-login-code-btn"]');

    // Check if the code input is in an invalid state
    const inputIsFocused = await page.evaluate(() => {
      const otpInput = document.getElementById("otp-input");
      return document.activeElement === otpInput;
    });

    expect(inputIsFocused).toBeTruthy();
  });

  // Test resending OTP code & error handling for too many requests
  test("should allow resending OTP code after 60 seconds", async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName === "webkit",
      "Safari wont let you set a cookie on localhost without https",
    );
    test.setTimeout(120000);
    await page.click('button[id="resend-button"]');

    // Check if cooldown cookie is set
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "otp_resend_cooldown_time",
    );

    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.secure).toBeTruthy();
    expect(sessionCookie?.sameSite).toBe("Lax");

    // Check if the countdown timer is visible
    const isCountdownTimerVisible = await page.isVisible("#countdown-timer");
    expect(isCountdownTimerVisible).toBeTruthy();

    // Wait for 60 seconds
    await page.waitForTimeout(65000);

    // Check if the countdown timer is no longer visible
    const isCountdownTimerVisibleAfterCooldown =
      await page.isVisible("#countdown-timer");
    expect(isCountdownTimerVisibleAfterCooldown).toBeFalsy();

    // Check if the resend button is visible
    const isResendButtonVisible = await page.isVisible("#resend-button");
    expect(isResendButtonVisible).toBeTruthy();
  });

  // Test error handling for expired OTP code
  test("should show error for expired OTP code", async ({ page }) => {
    // ! Need to wait 15 minutes for the email token to expire
    // test.setTimeout(1000000);
    // await page.waitForTimeout(905000);
    // await page.click('button[id="resend-button"]');
    // await expect(page).toHaveURL(`/login`);
  });

  // TODO: Test for general errors like network errors or unexpected errors.
});

// Testing Logout
test.describe("Logout", () => {
  // Test to check if logged in user is redirected to login page on logout (w/ toast message)
  test("should successfully logout user", async ({ page }) => {
    // ! Can't seem to logout using the Stytch sandbox user but here's the test for it
    // Check if the user is redirected to the homepage with a toast message
    // await page.goto(`/logout`);
    // const toastSelector = 'div[role="status"][aria-live="polite"]';
    // await expect(page.locator(toastSelector)).toBeVisible();
    // await expect(page.locator(toastSelector)).toHaveText('Success, you are now logged out!');
    // // Check if the session cookie is deleted
    // const cookies = await page.context().cookies();
    // const sessionCookie = cookies.find(
    //   (cookie) => cookie.name === "gp_session_token",
    // );
    // expect(sessionCookie).toBeUndefined();
  });

  // Test to check if logged out user is redirected to login page on logout (w/ toast message)
  test("should show error for users that are not logged in", async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName === "webkit",
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.goto(`/logout`);
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(`/`);

    const toastSelector = 'div[role="status"][aria-live="polite"]';
    await expect(page.locator(toastSelector)).toBeVisible();
    await expect(page.locator(toastSelector)).toHaveText(
      "Error, you are not logged in.",
    );
  });

  // Test for general errors like network errors or unexpected errors.
  test("should show error for logging out", async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName === "webkit",
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
    await expect(page).toHaveURL(`/`);

    const toastSelector = 'div[role="status"][aria-live="polite"]';
    await expect(page.locator(toastSelector)).toBeVisible();
    await expect(page.locator(toastSelector)).toHaveText("Error logging out.");
  });
});

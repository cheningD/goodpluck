import { expect, test } from "@playwright/test";

const isDevelopment = !process.env.CI;

// Testing Login Form
test.describe("Login Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/login`, { waitUntil: 'domcontentloaded' });
  });

  test("should redirect to OTP verification page upon entering a valid email", async ({ page }) => {
    await page.fill('input[type="email"]', "sandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await expect(page.locator('h2:has-text("Check your email!")')).toBeVisible();
    await expect(page.locator('input[name="otp-input"]')).toBeVisible();
  });

  test("should display an error for unregistered email entries", async ({ page }) => {
    await page.fill('input[type="email"]', "NOTsandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await expect(page.locator("text=Email not found. Do you need to create an account?")).toBeVisible();
  });

  test("should display a tooltip when an invalid email format is entered", async ({ page }) => {
    await page.fill('input[type="email"]', "invalid-email");
    await page.click('button[data-testid="login-btn"]');
    const isInvalid = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      return emailInput instanceof HTMLInputElement && !emailInput.validity.valid;
    });
    expect(isInvalid).toBeTruthy();
  });

  test("should redirect users to the homepage if they are already logged in and attempt to visit the login page", async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari won't let you set a cookie on localhost without https in development environment",
    );
    await page.goto(`/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('input[type="email"]', "sandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await page.fill('input[name="otp-input"]', "000000");
    await page.click('button[type="submit"]');

    await page.goto(`/login`, { waitUntil: 'domcontentloaded' });

    const message = "You are already logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });
});

// Testing OTP Login
test.describe("Validate Login Code", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/login`, { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').fill("sandbox@stytch.com");
    await page.locator('button[data-testid="login-btn"]').click();
  });

  test("should set goodpluck session cookie, and redirect to `/#basket` given valid code", async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari won't let you set a cookie on localhost without https",
    );
    await page.locator("#otp-input").fill("000000");
    await page.locator('button[id="submit-login-code-btn"]').click();

    const message = "You are now logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}#basket`);

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === "gp_session_token");
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).toBe("WJtR5BCy38Szd5AfoDpf0iqFKEt4EE5JhjlWUY7l3FtY");
    expect(sessionCookie?.secure).toBeTruthy();
    expect(sessionCookie?.httpOnly).toBeTruthy();
    expect(sessionCookie?.sameSite).toBe("Lax");
  });

  test("should throw an error when an invalid code is entered", async ({ page }) => {
    await page.locator("#otp-input").fill("900900");
    await page.locator('button[id="submit-login-code-btn"]').click();
    await expect(page.locator("text=Oops, wrong passcode. Try again or request a new one.")).toBeVisible();

    const cookies = await page.context().cookies();
    expect(cookies.find(cookie => cookie.name === "gp_session_token")).toBeUndefined();
  });

  test("should show an error for invalid OTP code format", async ({ page }) => {
    await page.locator("#otp-input").fill("invalid-code");
    await page.locator('button[id="submit-login-code-btn"]').click();

    const inputIsFocused = await page.evaluate(() => document.activeElement?.id === "otp-input");
    expect(inputIsFocused).toBeTruthy();
  });

  test("should redirect users to the 'login' page when a resend OTP code request is sent", async ({ page }) => {
    await page.locator('a[id="resend-button"]').click();
    await expect(page).toHaveURL(`/login?resend=true`);
  });

  test("should redirect users to the homepage if they are already logged in and attempt to visit the login-code page", async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari won't let you set a cookie on localhost without https",
    );
    await page.locator("#otp-input").fill("000000");
    await page.locator('button[id="submit-login-code-btn"]').click();

    await page.goto(`/login-code`, { waitUntil: 'domcontentloaded' });
    const message = "You are already logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });
});

// Testing Logout
test.describe("Logout", () => {
  test("should delete the session cookie even if Stytch API fails to invalidate the cookie", async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari won't let you set a cookie on localhost without https in development environment",
    );

    // OTP Login with sandbox email
    await page.goto(`/login`, { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').fill("sandbox@stytch.com");
    await page.locator('button[data-testid="login-btn"]').click();
    await page.locator("#otp-input").fill("000000");
    await page.locator('button[id="submit-login-code-btn"]').click();

    // Attempt to logout
    await page.goto(`/logout`, { waitUntil: 'domcontentloaded' });

    // Check if the session cookie is deleted
    const cookies = await page.context().cookies();
    expect(cookies.find(cookie => cookie.name === "gp_session_token")).toBeUndefined();

    // Check for the successful logout message in the URL
    const message = "Successfully logged out";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });

  test("should show an error for users who are not logged in and attempt to log out", async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari won't let you set a cookie on localhost without https",
    );
    await page.goto(`/logout`, { waitUntil: 'domcontentloaded' });

    // Check if the session cookie is not present
    const cookies = await page.context().cookies();
    expect(cookies.find(cookie => cookie.name === "gp_session_token")).toBeUndefined();

    // Check for the error message in the URL
    const message = "You are not logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });
});
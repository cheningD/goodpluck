import { expect, test } from "@playwright/test";

const isDevelopment = typeof process.env.CI === "undefined";

// Testing Login Form
test.describe("Login Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
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
        emailInput instanceof HTMLInputElement && !emailInput.validity.valid
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
    await page.goto("/login");
    await page.fill('input[type="email"]', "sandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await page.fill('input[name="otp-input"]', "000000");
    await page.click('button[type="submit"]');

    // Step 2: Attempt to navigate to the login page again
    await page.goto("/login");
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
    await page.goto("/login");
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
    await expect(page).toHaveURL("/login?resend=true");
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
    await page.goto("/login-code");
    const message = "You are already logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });
});

// Testing Logout
test.describe("Logout", () => {
  test("should delete the session cookie even if Stytch API fails to invalidate the cookie", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari won't let you set a cookie on localhost without https in development environment",
    );

    // OTP Login with sandbox email
    await page.goto("/login");
    await page.waitForTimeout(2000);
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    // Attempt to logout
    await page.goto("/logout");
    await page.waitForTimeout(2000);

    // Check if the session cookie is deleted
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "gp_session_token",
    );
    expect(sessionCookie).toBeUndefined();

    // Check for the successful logout message in the URL
    const message = "Successfully logged out";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });

  test("should show an error for users who are not logged in and attempt to log out", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.goto("/logout");
    await page.waitForTimeout(2000);

    // Check if the session cookie is not present
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "gp_session_token",
    );
    expect(sessionCookie).toBeUndefined();

    // Check for the error message in the URL
    const message = "You are not logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });
});

// Testing Join Form
test.describe("Goodpluck Sign-up Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/join");
  });

  const validEmail = "sandbox@stytch.com";
  const validZipcode = "48201";

  test("should validate when an email is not entered", async ({ page }) => {
    await page.fill("#zipcode", validZipcode);
    await page.click('button:text("Continue")');

    const isInvalid = await page.evaluate(() => {
      const emailInput = document.querySelector('input[id="email"]');
      return (
        emailInput instanceof HTMLInputElement && !emailInput.validity.valid
      );
    });

    expect(isInvalid).toBeTruthy();
  });

  test("should validate for invalid email format", async ({ page }) => {
    await page.fill("#zipcode", validZipcode);
    await page.click('button:text("Continue")');

    const isInvalid = await page.evaluate(() => {
      const emailInput = document.querySelector('input[id="email"]');
      return (
        emailInput instanceof HTMLInputElement && !emailInput.validity.valid
      );
    });

    expect(isInvalid).toBeTruthy();
  });

  test("should validate when a zip code is not entered", async ({ page }) => {
    await page.fill("#email", validEmail);
    await page.click('button:text("Continue")');

    const isInvalid = await page.evaluate(() => {
      const zipcodeInput = document.querySelector('input[id="zipcode"]');
      return (
        zipcodeInput instanceof HTMLInputElement && !zipcodeInput.validity.valid
      );
    });

    expect(isInvalid).toBeTruthy();
  });

  test("should throw an error for an unserviced zip code", async ({ page }) => {
    await page.fill("#email", validEmail);
    await page.fill("#zipcode", "99999");
    await page.click('button:text("Continue")');
    await expect(
      page.locator("h2", {
        hasText: "Unfortunately, we don't deliver to 99999 yet!",
      }),
    ).toBeVisible();
    await page.click('button[id="join-waitlist-btn"]');
    expect(page.url()).toContain(
      `https://airtable.com/appJVu70KyaMMofIb/shrs9WED21nlCwrrc?prefill_email=${validEmail}&prefill_zip=99999`,
    );
  });

  test("should redirect to login page on clicking `Log in` link", async ({
    page,
  }) => {
    await page.click("text=Log in");
    await expect(page).toHaveURL("/login");
  });

  test("should redirect users to the homepage if they are already logged in and attempt to visit the join page", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari won't let you set a cookie on localhost without https in development environment",
    );
    // Step 1: Login with valid credentials
    await page.goto("/login");
    await page.fill('input[type="email"]', "sandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await page.fill('input[name="otp-input"]', "000000");
    await page.click('button[type="submit"]');

    // Step 2: Attempt to navigate to the join page
    await page.goto("/join");

    // Step 3: Check if the user is redirected to the homepage
    const message = "You are already logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });

  test("should redirect to login-code page if user account already exists", async ({
    page,
  }) => {
    await page.fill("#email", validEmail);
    await page.fill("#zipcode", validZipcode);
    await page.click('button:text("Continue")');
    await expect(
      page.locator('h2:has-text("Check your email!")'),
    ).toBeVisible();
    await expect(page.locator('input[name="otp-input"]')).toBeVisible();
  });
});

// Testing OTP Join
test.describe("Validate Join Code", () => {
  test.beforeEach(async ({ page }) => {
    // OTP Join with Valid Email
    await page.goto(
      "/signup-code?method_id=email-test-23873e89-d4ed-4e92-b3b9-e5c7198fa286",
    ); // workaround for using the stytch sandbox email
  });

  test("should set goodpluck session cookie, and redirect to `/create-account` given valid code", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-signup-code-btn"]');

    // Check if the user is redirected to the create-account page
    expect(page.url()).toContain("/create-account");

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

  test("should throw an error when a wrong code is entered", async ({
    page,
  }) => {
    await page.fill("#otp-input", "900900"); // invalid code
    await page.click('button[id="submit-signup-code-btn"]');
    await expect(
      page.locator(
        "text=Oops, wrong passcode. Try again or request a new one!",
      ),
    ).toBeVisible();

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "gp_session_token",
    );
    expect(sessionCookie).toBeUndefined();
  });

  test("should redirect users to the homepage if they are already logged in and attempt to visit the signup-code page", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    // Step 1: Join with valid credentials
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-signup-code-btn"]');

    // Step 2: Attempt to navigate to the signup-code page again
    await page.goto("/signup-code");

    // Step 3: Check if the user is redirected to the homepage
    const message = "You are already logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });

  test("should show an error when user leaves OTP input blank", async ({
    page,
  }) => {
    await page.click('button[id="submit-signup-code-btn"]');

    // Check if the code input is in an invalid state
    const inputIsFocused = await page.evaluate(() => {
      const otpInput = document.getElementById("otp-input");
      return document.activeElement === otpInput;
    });

    expect(inputIsFocused).toBeTruthy();
  });

  test("should show an error for OTP less than 6 digits", async ({ page }) => {
    const invalidCode = "12345";
    await page.fill("#otp-input", invalidCode);
    await page.click('button[id="submit-signup-code-btn"]');
    await expect(
      page.locator(`text=Code is not valid: ${invalidCode}`),
    ).toBeVisible();
  });
});

// Testing Create Account
test.describe("Detailed Sign-Up (Create Account)", () => {
  test("should redirect to login page if user is unauthenticated", async ({
    page,
  }) => {
    await page.goto("/create-account");
    expect(page.url()).toContain("/?message=You%20are%20not%20logged%20in");
  });

  test("should not submit form if required fields are missing", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari won't let you set a cookie on localhost without https in development environment",
    );

    // OTP Login with sandbox email
    await page.goto("/login");
    await page.waitForTimeout(2000);
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    // Check if the user is redirected to the create-account page when submitting the form with missing fields
    await page.goto("/create-account");
    await page.fill('input[name="first_name"]', "John");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/create-account");
  });
});

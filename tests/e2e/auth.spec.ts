import { expect, test } from "@playwright/test";

const isDevelopment = typeof process.env.CI === "undefined";

// Testing Login Form
test.describe("Login Form", () => {
  test("should redirect to OTP verification page upon entering a valid email", async ({
    page,
  }) => {
    test.skip(
      !isDevelopment,
      "Skipping test in production environment due to sandbox@stytch.com restrictions",
    );

    await page.goto("/login");
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
    await page.goto("/login");
    await page.fill('input[type="email"]', "NOTsandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await expect(
      page.locator("text=Email not found. Do you need to create an account?"),
    ).toBeVisible();
  });

  test("should display a tooltip when an invalid email format is entered", async ({
    page,
  }) => {
    await page.goto("/login");
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
    test.skip(
      !isDevelopment,
      "Skipping test in production environment due to sandbox@stytch.com restrictions",
    );

    // Step 1: Login with valid credentials
    await page.goto("/login");
    await page.fill('input[type="email"]', "sandbox@stytch.com");
    await page.click('button[data-testid="login-btn"]');
    await page.fill('input[name="otp-input"]', "000000");
    await page.click('button[type="submit"]');

    // Step 2: Attempt to navigate to the login page again
    await page.goto("/login");

    // Step 3: Check if the user is redirected to the homepage
    const message = "You are already logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });
});

// Testing OTP Login
test.describe("Validate Login Code", () => {
  test.skip(
    !isDevelopment,
    "Skipping test in production environment due to sandbox@stytch.com restrictions",
  );

  test.beforeEach(async ({ page }) => {
    // OTP Login with Valid Email
    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
  });

  test("should set goodpluck session cookie, and redirect to either the homepage or onboarding page given valid code", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    // Check if the user is redirected to the join/personal-info page or the homepage
    const expectedUrlPattern = /\/join|\/personal-info/;
    expect(page.url()).toMatch(expectedUrlPattern);

    // This is the default OTP code for the sandbox user
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "gp_session_token",
    );
    expect(sessionCookie).toBeDefined();

    expect(sessionCookie?.value).toBe(
      "WJtR5BCy38Szd5AfoDpf0iqFKEt4EE5JhjlWUY7l3FtY",
    );

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
    test.skip(
      !isDevelopment,
      "Skipping test in production environment due to sandbox@stytch.com restrictions",
    );

    // OTP Login with sandbox email
    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    // Attempt to logout
    await page.goto("/logout");

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
test.describe("Join - Stytch Account Creation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/join");
  });

  const validEmail = "sandbox@stytch.com";
  const validZipcode = "48201";

  test("should validate when an email is not entered", async ({ page }) => {
    await page.fill("#zipcode", validZipcode);
    await page.click('button[id="submit-join-code-btn"]');

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
    await page.click('button[id="submit-join-code-btn"]');

    const isInvalid = await page.evaluate(() => {
      const emailInput = document.querySelector('input[id="email"]');
      return (
        emailInput instanceof HTMLInputElement && !emailInput.validity.valid
      );
    });

    expect(isInvalid).toBeTruthy();
  });

  test("should validate when a zip code is not entered", async ({ page }) => {
    test.skip(
      !isDevelopment,
      "Skipping test in production environment due to sandbox@stytch.com restrictions",
    );

    await page.fill("#email", validEmail);
    await page.click('button[id="submit-join-code-btn"]');

    const isInvalid = await page.evaluate(() => {
      const zipcodeInput = document.querySelector('input[id="zipcode"]');
      return (
        zipcodeInput instanceof HTMLInputElement && !zipcodeInput.validity.valid
      );
    });

    expect(isInvalid).toBeTruthy();
  });

  test("should throw an error for an unserviced zip code", async ({ page }) => {
    test.skip(
      !isDevelopment,
      "Skipping test in production environment due to sandbox@stytch.com restrictions",
    );

    await page.fill("#email", validEmail);
    await page.fill("#zipcode", "99999");
    await page.click('button[id="submit-join-code-btn"]');
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

  test("should redirect to login page on clicking `Sign in` link", async ({
    page,
  }) => {
    await page.click("text=Sign in");
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
    test.skip(
      !isDevelopment,
      "Skipping test in production environment due to sandbox@stytch.com restrictions",
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
    test.skip(
      !isDevelopment,
      "Skipping test in production environment due to sandbox@stytch.com restrictions",
    );

    await page.fill("#email", validEmail);
    await page.fill("#zipcode", validZipcode);
    await page.click('button[id="submit-join-code-btn"]');
    await expect(
      page.locator('h2:has-text("Check your email!")'),
    ).toBeVisible();
    await expect(page.locator('input[name="otp-input"]')).toBeVisible();
  });
});

// Testing OTP Join
test.describe("Join - Validate OTP Code", () => {
  test.skip(
    !isDevelopment,
    "Skipping test in production environment due to sandbox@stytch.com restrictions",
  );

  test.beforeEach(async ({ page }) => {
    // OTP Join with Valid Email
    await page.goto(
      "/join/code/?method_id=email-test-23873e89-d4ed-4e92-b3b9-e5c7198fa286",
    ); // workaround for using the stytch sandbox email
  });

  test("should set goodpluck session cookie, and redirect to home page or onboarding page given valid code", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-join-code-btn"]');

    // Check if the user is redirected to the create-account page or the homepage
    const expectedUrlPattern = /\/join|\/personal-info/;

    expect(page.url()).toMatch(expectedUrlPattern);

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
    await page.click('button[id="submit-join-code-btn"]');
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

  test("should redirect users to the homepage if they are already logged in and attempt to visit the join/code page", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );
    // Step 1: Join with valid credentials
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-join-code-btn"]');

    // Step 2: Attempt to navigate to the join/code page again
    await page.goto("/join/code");

    // Step 3: Check if the user is redirected to the homepage
    const message = "You are already logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });

  test("should show an error when user leaves OTP input blank", async ({
    page,
  }) => {
    await page.click('button[id="submit-join-code-btn"]');

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
    await page.click('button[id="submit-join-code-btn"]');
    await expect(
      page.locator(`text=Code is not valid: ${invalidCode}`),
    ).toBeVisible();
  });
});

// Testing Join Personal Info Form
test.describe("Join - Personal Information Form", () => {
  test.skip(
    !isDevelopment,
    "Skipping test in production environment due to sandbox@stytch.com restrictions",
  );

  test("should redirect unauthenticated users to the homepage", async ({
    page,
  }) => {
    await page.goto("/join/personal-info");
    const message = "You are not logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });

  test("should redirect users who have already completed the onboarding process", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    await page.goto("/join/personal-info");
    expect(page.url()).not.toEqual("/join/personal-info");
  });

  test("should redirect to `join/payment-info` if swell account is created successfully", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );

    // OTP Login with sandbox email
    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');
    await page.waitForTimeout(1000);
    const zip = "48201";

    const url = page.url();
    if (url.includes("/join/personal-info")) {
      // Fill in create account form
      await page.fill('input[name="first_name"]', "John");
      await page.fill('input[name="last_name"]', "Doe");
      await page.fill('input[name="phone_number"]', "1234567890");
      await page.fill('input[name="address"]', "123 Main St");
      await page.fill('input[name="city"]', "Detroit");
      await page.fill('input[name="postcode"]', zip);
      await page.fill('input[name="state"]', "MI");
      await page.click('input[name="consent"]');
      await page.click('button[type="submit"]');

      // Check if the user is redirected to the `/join/payment-info` page
      expect(page.url()).toContain("/join/payment-info");
    }
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
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    const url = page.url();
    if (url.includes("/join/personal-info")) {
      await page.fill('input[name="first_name"]', "John");
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL("/join/personal-info");
    }
  });
});

// Testing Join Payment Info Form
test.describe("Join - Payment Information Form", () => {
  test.skip(
    !isDevelopment,
    "Skipping test in production environment due to sandbox@stytch.com restrictions",
  );

  test("should redirect unauthenticated users to the homepage", async ({
    page,
  }) => {
    await page.goto("/join/payment-info");
    const message = "You are not logged in";
    const encodedMessage = encodeURIComponent(message);
    expect(page.url()).toContain(`/?message=${encodedMessage}`);
  });

  test("should redirect users who have already completed the onboarding process", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );

    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');

    await page.goto("/join/payment-info");
    expect(page.url()).not.toEqual("/join/payment-info");
  });

  test("should show an error for empty required fields", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );

    // OTP Login with sandbox email
    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');
    await page.waitForTimeout(1000);
    const url = page.url();

    if (url.includes("/join/payment-info")) {
      await page.click('button[type="submit"]');
      await expect(
        page.locator("text=Please fill out all required fields."),
      ).toBeVisible();
    }
  });

  test("should show billing address inputs when the checkbox is checked", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );

    // OTP Login with sandbox email
    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');
    await page.waitForTimeout(1000);
    const url = page.url();

    if (url.includes("/join/payment-info")) {
      await page.click('input[name="same-address"]');
      await expect(page.locator('input[name="billing_address"]')).toBeVisible();
    } else {
      const message = "Onboarding complete!";
      expect(page.url()).toContain(`/?message=${encodeURIComponent(message)}`);
    }
  });

  test("should redirect to the homepage on successful form submission", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit" && isDevelopment,
      "Safari wont let you set a cookie on localhost without https",
    );

    // OTP Login with sandbox email
    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await page.fill("#otp-input", "000000");
    await page.click('button[id="submit-login-code-btn"]');
    await page.waitForTimeout(1000);
    const url = page.url();

    if (url.includes("/join/payment-info")) {
      const stripeFrame = page.frameLocator("iframe").first();
      await stripeFrame
        .locator('[placeholder="Card number"]')
        .fill("4242424242424242");
      await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
      await stripeFrame.locator('[placeholder="CVC"]').fill("242");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(10000);
    }

    const message = "Onboarding complete!";
    expect(page.url()).toContain(`/?message=${encodeURIComponent(message)}`);
  });
});

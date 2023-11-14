import { expect, test } from "@playwright/test";
test.describe("Login Form", () => {
  test("should send otp, redirect to login-code if given a valid email address", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await expect(
      page.getByRole("heading", { name: "Check your email" }),
    ).toBeVisible();
  });

  test("should show error if email is invalid", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("NOTsandbox@stytch.com");
    await page.getByTestId("login-btn").click();
    await expect(page.getByTestId("login-error")).toHaveText(
      "Email not found. Do you need to create an account?",
    );
  });
});

test.describe("Validate Login Code", () => {
  test.beforeEach(async ({ page }) => {
    //OTP Login with Valid Email
    await page.goto("/login");
    await page.getByLabel("Email").fill("sandbox@stytch.com");
    await page.getByTestId("login-btn").click();
  });

  test("should set session to localstorage, and redirect to #basket given valid code", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit",
      "Safari wont let you set a cookie on localhost without https",
    );
    await page.getByTestId("otp-input").fill("000000");
    await page.getByTestId("submit-login-code-btn").click();
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
  });

  test("should throw error if not valid code", async ({ page }) => {
    await page.getByTestId("otp-input").fill("900900"); //Code is invalid

    await page.getByTestId("submit-login-code-btn").click();
    expect(page.getByTestId("login-code-error")).toHaveText(
      "Oops, code isn't valid. Please try again.",
    );

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "gp_session_token",
    );
    expect(sessionCookie).toBeUndefined();
  });
});
